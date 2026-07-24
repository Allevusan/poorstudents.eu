import Link from "next/link";
import DealCard from "@/components/DealCard";
import { getFeaturedDeals } from "@/lib/deals";
import { getViewer } from "@/lib/viewer";
import { countryName } from "@/lib/countries";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    emoji: "👀",
    title: "Find your tool",
    text: "Browse discounts on the study software, AI assistants and apps you were going to pay full price for.",
  },
  {
    emoji: "✉️",
    title: "One email, one click",
    text: "Plenty of deals need no account at all. For the rest, sign up with any email — no documents, no ID card photos.",
  },
  {
    emoji: "🎉",
    title: "Copy the code, save the money",
    text: "Reveal your code, redeem it at the merchant, and spend the difference on something nicer than software.",
  },
];

export default async function HomePage() {
  const { country } = await getViewer();
  const deals = await getFeaturedDeals(country);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-12 text-center sm:py-20">
        <p className="mb-4 inline-block rounded-full bg-washdeep px-4 py-1.5 text-sm font-bold text-ink/70">
          🎓 Free for students, anywhere in the EU
        </p>
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          We know you&apos;re a{" "}
          <span className="relative inline-block">
            <span className="relative z-10">poor student</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-badge sm:h-5" aria-hidden />
          </span>
          .
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-ink/70 sm:text-xl">
          Every tool you actually need for studying, cheaper. Free, anywhere in the EU. No paywall, ever.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/tools" className="btn-primary w-full text-lg sm:w-auto">
            Browse tools
          </Link>
          <Link href="/#how-it-works" className="btn-secondary w-full text-lg sm:w-auto">
            How it works
          </Link>
        </div>
      </section>

      {/* Featured deals */}
      <section className="py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Fresh deals in {countryName(country)}
          </h2>
          <Link href="/tools" className="text-sm font-bold text-accent-dark hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 py-14">
        <h2 className="mb-8 text-center font-display text-2xl font-extrabold sm:text-3xl">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-badge font-display text-lg font-extrabold">
                  {i + 1}
                </span>
                <span className="text-2xl" aria-hidden>{step.emoji}</span>
              </div>
              <h3 className="font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Merchant CTA */}
      <section className="py-8">
        <div className="card flex flex-col items-start gap-4 border-2 border-accent/20 bg-accent-soft/60 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold sm:text-2xl">
              Selling a tool students love?
            </h2>
            <p className="mt-1 max-w-md text-ink/70">
              One listing reaches students in 27 countries. You only pay for results.
            </p>
          </div>
          <Link href="/for-businesses" className="btn-primary shrink-0">
            List your product →
          </Link>
        </div>
      </section>
    </div>
  );
}
