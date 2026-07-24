"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function submitLead(formData: FormData) {
  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

  const lead = {
    companyName: get("companyName"),
    contactName: get("contactName"),
    email: get("email"),
    website: get("website"),
    productDescription: get("productDescription"),
  };

  if (!lead.companyName || !lead.contactName || !lead.email.includes("@")) {
    throw new Error("Please fill in company, contact name and a valid email.");
  }

  await prisma.merchantLead.create({ data: lead });

  // Best-effort admin notification — a mail hiccup must never lose the
  // lead, which is already saved above.
  const adminEmail = (process.env.ADMIN_EMAILS ?? "").split(",")[0]?.trim();
  if (adminEmail) {
    try {
      await sendMail({
        to: adminEmail,
        subject: `New merchant lead: ${lead.companyName}`,
        text: [
          `Company: ${lead.companyName}`,
          `Contact: ${lead.contactName} <${lead.email}>`,
          `Website: ${lead.website}`,
          ``,
          lead.productDescription,
        ].join("\n"),
      });
    } catch (err) {
      console.error("Failed to email admin about new lead:", err);
    }
  }

  redirect("/for-businesses/thanks");
}
