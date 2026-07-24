import { prisma } from "@/lib/prisma";
import { countryFlag } from "@/lib/countries";
import { deleteInstitution, upsertInstitution } from "../actions";

export default async function AdminInstitutionsPage() {
  const institutions = await prisma.institution.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: [{ countryCode: "asc" }, { name: "asc" }],
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="font-display text-lg font-extrabold">
          Institutions ({institutions.length})
        </h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink/10 text-ink/50">
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Domains</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst) => (
                <tr key={inst.id} className="border-b border-ink/5">
                  <td className="px-4 py-2.5 font-bold">
                    {countryFlag(inst.countryCode)} {inst.name}
                    {!inst.isActive && <span className="ml-2 text-ink/40">(inactive)</span>}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    {inst.emailDomains.join(", ")}
                  </td>
                  <td className="px-4 py-2.5">{inst._count.users}</td>
                  <td className="px-4 py-2.5">
                    <form action={deleteInstitution}>
                      <input type="hidden" name="id" value={inst.id} />
                      <button type="submit" className="text-xs font-bold text-red-500 hover:underline">
                        delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-extrabold">Add institution</h2>
        <form action={upsertInstitution} className="card mt-4 flex flex-col gap-3 p-5">
          <div>
            <label className="label">Name</label>
            <input name="name" required className="input" />
          </div>
          <div>
            <label className="label">Country code</label>
            <input name="countryCode" required maxLength={2} placeholder="SE" className="input" />
          </div>
          <div>
            <label className="label">Email domains (one per line or comma-separated)</label>
            <textarea name="emailDomains" rows={3} required placeholder="kth.se" className="input font-mono text-sm" />
          </div>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" name="isActive" defaultChecked className="h-5 w-5 accent-accent" />
            Active
          </label>
          <button type="submit" className="btn-primary self-start px-4 py-2 text-sm">
            Add institution
          </button>
        </form>
      </div>
    </div>
  );
}
