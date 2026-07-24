import { prisma } from "@/lib/prisma";
import { resolveDomain } from "../actions";

export default async function AdminDomainsPage() {
  const domains = await prisma.unknownDomain.findMany({
    include: { resolvedInstitution: { select: { name: true } } },
    orderBy: { sightings: "desc" },
    take: 200,
  });

  return (
    <div>
      <h2 className="font-display text-lg font-extrabold">Unknown email domains</h2>
      <p className="mt-1 max-w-2xl text-sm text-ink/60">
        Domains from signups that didn&apos;t match any institution, sorted by how often we&apos;ve
        seen them. Frequently seen domains are probably universities we&apos;re missing — resolve
        them to start counting those students as academic.
      </p>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-ink/50">
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Sightings</th>
              <th className="px-4 py-3">Last seen</th>
              <th className="px-4 py-3">Resolve as institution</th>
            </tr>
          </thead>
          <tbody>
            {domains.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No unknown domains yet.
                </td>
              </tr>
            )}
            {domains.map((d) => (
              <tr key={d.id} className="border-b border-ink/5 align-middle">
                <td className="px-4 py-2.5 font-mono font-bold">{d.domain}</td>
                <td className="px-4 py-2.5">{d.sightings}</td>
                <td className="px-4 py-2.5">
                  {d.lastSeenAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </td>
                <td className="px-4 py-2.5">
                  {d.resolvedInstitution ? (
                    <span className="font-bold text-accent-dark">
                      ✓ {d.resolvedInstitution.name}
                    </span>
                  ) : (
                    <form action={resolveDomain} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="domainId" value={d.id} />
                      <input
                        name="name"
                        required
                        placeholder="Institution name"
                        className="input w-44 px-2 py-1 text-xs"
                      />
                      <input
                        name="countryCode"
                        required
                        maxLength={2}
                        placeholder="CC"
                        className="input w-14 px-2 py-1 text-xs uppercase"
                      />
                      <button type="submit" className="btn-secondary px-3 py-1 text-xs">
                        Resolve
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
