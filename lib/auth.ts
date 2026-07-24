import type { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createTransport } from "nodemailer";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { classifyEmailDomain } from "@/lib/academic";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM ?? "PoorStudents <hello@poorstudents.eu>",
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url, provider }) {
        // No SMTP configured (local dev): print the magic link instead of sending.
        if (!process.env.EMAIL_SERVER) {
          console.log(`\n✉️  Magic link for ${identifier}:\n${url}\n`);
          return;
        }
        const transport = createTransport(process.env.EMAIL_SERVER);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Your sign-in link for poorstudents.eu",
          text: `Sign in to poorstudents.eu:\n\n${url}\n\nThis link expires in 24 hours. If you didn't request it, ignore this email.`,
          html: [
            `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">`,
            `<h1 style="font-size:20px">Sign in to poorstudents.eu</h1>`,
            `<p>One click and you're in:</p>`,
            `<p><a href="${url}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">Sign in</a></p>`,
            `<p style="color:#666;font-size:13px">This link expires in 24 hours. If you didn't request it, you can safely ignore this email.</p>`,
            `</div>`,
          ].join(""),
        });
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      const result = await classifyEmailDomain(user.email);

      // Country preference: the selector cookie wins, then the matched
      // institution's country. cookies() is available because this runs
      // inside the auth route handler.
      let countryCode = "";
      try {
        const cookieCountry = cookies().get(COUNTRY_COOKIE)?.value;
        if (isValidCountry(cookieCountry)) countryCode = cookieCountry;
      } catch {
        // outside a request context; leave empty
      }
      if (!countryCode && result.institutionCountry) {
        countryCode = result.institutionCountry;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isAcademicEmail: result.isAcademicEmail,
          institutionId: result.institutionId,
          ...(countryCode ? { countryCode } : {}),
        },
      });
    },
  },
};

export type SessionUser = {
  id: string;
  email: string;
  countryCode: string;
  isAcademicEmail: boolean;
  name: string | null;
};

/** Current DB user for the active session, or null. */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails.includes(email.toLowerCase());
}

/** Throws unless the current session belongs to an allowlisted admin. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Not authorized");
  }
  return user;
}
