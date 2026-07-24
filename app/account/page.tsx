import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { EU_COUNTRIES } from "@/lib/countries";
import { updateCountry } from "./actions";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "Your account — poorstudents.eu",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const redemptions = await prisma.redemption.findMany({
    where: { userId: user.id },
    include: {
      deal: {
        select: {
          title: true,
          discountLabel: true,
          merchant: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold">Your account</h1>
        <SignOutButton />
      </div>

      <div className="card mt-6 flex flex-col gap-5 p-6">
        <div>
          <p className="label">Email</p>
          <p className="font-bold">{user.email}</p>
          {user.isAcademicEmail && (
            <p className="mt-1 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-dark">
              🎓 University email
            </p>
          )}
        </div>
        <form action={updateCountry} className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="country" className="label">
              Your country
            </label>
            <select
              id="country"
              name="country"
              defaultValue={user.countryCode || ""}
              className="input"
            >
              <option value="" disabled>
                Pick a country
              </option>
              {EU_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-secondary shrink-0 px-4 py-3">
            Save
          </button>
        </form>
      </div>

      <h2 className="mt-10 font-display text-xl font-extrabold">Codes you&apos;ve grabbed</h2>
      {redemptions.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="text-ink/60">
            Nothing yet. Your revealed codes will show up here.
          </p>
          <Link href="/tools" className="btn-primary mt-4">
            Browse tools
          </Link>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {redemptions.map((r) => (
            <li key={r.id}>
              <Link
                href={`/tools/${r.deal.merchant.slug}`}
                className="card flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold">{r.deal.title}</p>
                  <p className="text-xs text-ink/50">
                    {r.deal.merchant.name} ·{" "}
                    {r.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-badge px-2.5 py-1 font-display text-sm font-extrabold">
                  {r.deal.discountLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
