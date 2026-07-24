import Link from "next/link";
import type { Metadata } from "next";
import DealCard from "@/components/DealCard";
import { CATEGORIES, isCategory } from "@/lib/categories";
import { getCatalogue } from "@/lib/deals";
import { getViewer } from "@/lib/viewer";
import { countryFlag, countryName } from "@/lib/countries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse tools — poorstudents.eu",
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { country } = await getViewer();
  const category = isCategory(searchParams.category) ? searchParams.category : undefined;
  const q = searchParams.q?.trim() || undefined;

  const deals = await getCatalogue({ country, category, q });

  const chipHref = (cat?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/tools?${s}` : "/tools";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">All tools</h1>
      <p className="mt-1 font-medium text-ink/60">
        Showing deals available in {countryFlag(country)} {countryName(country)} — switch country in the header.
      </p>

      {/* Search */}
      <form action="/tools" method="GET" className="mt-6 flex gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search tools, merchants…"
          className="input max-w-md"
        />
        <button type="submit" className="btn-primary shrink-0 px-5 py-2.5">
          Search
        </button>
      </form>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={chipHref()}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            !category ? "bg-ink text-white" : "bg-white text-ink/70 shadow-card hover:text-ink"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={chipHref(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              category === c.value
                ? "bg-ink text-white"
                : "bg-white text-ink/70 shadow-card hover:text-ink"
            }`}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      {/* Results */}
      {deals.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="text-4xl" aria-hidden>🕳️</p>
          <h2 className="mt-3 font-display text-xl font-bold">Nothing here (yet)</h2>
          <p className="mx-auto mt-2 max-w-sm text-ink/60">
            No deals match that combination in {countryName(country)}. Try another category, or
            clear your search.
          </p>
          <Link href="/tools" className="btn-secondary mt-5">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
