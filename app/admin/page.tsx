import { prisma } from "@/lib/prisma";
import { countryFlag, countryName } from "@/lib/countries";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-bold text-ink/50">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
    </div>
  );
}

export default async function AdminStatsPage() {
  const [totalUsers, academicUsers, totalRedemptions, activeDeals, activeMerchants, leads] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isAcademicEmail: true } }),
      prisma.redemption.count(),
      prisma.deal.count({ where: { isActive: true } }),
      prisma.merchant.count({ where: { isActive: true } }),
      prisma.merchantLead.count(),
    ]);

  const byCountry = await prisma.user.groupBy({
    by: ["countryCode"],
    _count: { _all: true },
    orderBy: { _count: { countryCode: "desc" } },
  });
  const academicByCountry = await prisma.user.groupBy({
    by: ["countryCode"],
    where: { isAcademicEmail: true },
    _count: { _all: true },
  });
  const academicMap = new Map(
    academicByCountry.map((row) => [row.countryCode, row._count._all])
  );

  const pct = (part: number, total: number) =>
    total === 0 ? "—" : `${Math.round((part / total) * 100)}%`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total users" value={totalUsers} />
        <Stat
          label="Signed up with a university email"
          value={pct(academicUsers, totalUsers)}
        />
        <Stat label="Redemptions" value={totalRedemptions} />
        <Stat label="Active deals" value={`${activeDeals} (${activeMerchants} merchants)`} />
      </div>
      <p className="mt-2 text-sm text-ink/50">
        {academicUsers} of {totalUsers} users have a recognised university email. {leads} merchant
        lead{leads === 1 ? "" : "s"} waiting.
      </p>

      <h2 className="mt-8 font-display text-lg font-extrabold">Users by country</h2>
      <div className="card mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-ink/50">
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Users</th>
              <th className="px-4 py-3">University email</th>
              <th className="px-4 py-3">Share</th>
            </tr>
          </thead>
          <tbody>
            {byCountry.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No users yet.
                </td>
              </tr>
            )}
            {byCountry.map((row) => {
              const academic = academicMap.get(row.countryCode) ?? 0;
              const label = row.countryCode
                ? `${countryFlag(row.countryCode)} ${countryName(row.countryCode)}`
                : "🌍 Not set";
              return (
                <tr key={row.countryCode || "unset"} className="border-b border-ink/5">
                  <td className="px-4 py-2.5 font-bold">{label}</td>
                  <td className="px-4 py-2.5">{row._count._all}</td>
                  <td className="px-4 py-2.5">{academic}</td>
                  <td className="px-4 py-2.5">{pct(academic, row._count._all)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
