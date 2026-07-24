import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
  const leads = await prisma.merchantLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h2 className="font-display text-lg font-extrabold">Merchant leads ({leads.length})</h2>
      {leads.length === 0 ? (
        <p className="mt-4 text-ink/60">No leads yet. Send merchants to /for-businesses.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-extrabold">{lead.companyName}</h3>
                <span className="text-xs text-ink/50">
                  {lead.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-ink/70">
                {lead.contactName} ·{" "}
                <a href={`mailto:${lead.email}`} className="text-accent-dark hover:underline">
                  {lead.email}
                </a>{" "}
                ·{" "}
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-dark hover:underline"
                >
                  {lead.website}
                </a>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{lead.productDescription}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
