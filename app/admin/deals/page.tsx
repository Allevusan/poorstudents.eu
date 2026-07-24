import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDealsPage() {
  const deals = await prisma.deal.findMany({
    include: {
      merchant: { select: { name: true } },
      _count: { select: { redemptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold">Deals ({deals.length})</h2>
        <Link href="/admin/deals/new" className="btn-primary px-4 py-2 text-sm">
          + New deal
        </Link>
      </div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-ink/50">
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Countries</th>
              <th className="px-4 py-3">Gated</th>
              <th className="px-4 py-3">Redeemed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} className="border-b border-ink/5 hover:bg-wash/60">
                <td className="max-w-[220px] px-4 py-2.5">
                  <Link href={`/admin/deals/${d.id}`} className="font-bold text-accent-dark hover:underline">
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-2.5">{d.merchant.name}</td>
                <td className="px-4 py-2.5">{d.redemptionType}</td>
                <td className="px-4 py-2.5">{d.availableCountries.join(", ")}</td>
                <td className="px-4 py-2.5">{d.requiresAccount ? "🔒" : "open"}</td>
                <td className="px-4 py-2.5">{d._count.redemptions}</td>
                <td className="px-4 py-2.5">{d.isActive ? "✅" : "⏸️"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
