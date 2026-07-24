import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Stats" },
  { href: "/admin/merchants", label: "Merchants" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/institutions", label: "Institutions" },
  { href: "/admin/domains", label: "Unknown domains" },
  { href: "/admin/leads", label: "Leads" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold">Admin</h1>
      <nav className="mt-4 flex flex-wrap gap-2 border-b-2 border-ink/10 pb-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink/70 shadow-card transition hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
