import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/categories";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    include: { _count: { select: { deals: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold">Merchants ({merchants.length})</h2>
        <Link href="/admin/merchants/new" className="btn-primary px-4 py-2 text-sm">
          + New merchant
        </Link>
      </div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Countries</th>
              <th className="px-4 py-3">Deals</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m) => (
              <tr key={m.id} className="border-b border-ink/5 hover:bg-wash/60">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/merchants/${m.id}`} className="font-bold text-accent-dark hover:underline">
                    {m.name}
                  </Link>
                  <span className="ml-2 text-ink/40">/{m.slug}</span>
                </td>
                <td className="px-4 py-2.5">{categoryLabel(m.category)}</td>
                <td className="px-4 py-2.5">{m.availableCountries.join(", ")}</td>
                <td className="px-4 py-2.5">{m._count.deals}</td>
                <td className="px-4 py-2.5">{m.isActive ? "✅ Active" : "⏸️ Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
