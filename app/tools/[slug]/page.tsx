import Link from "next/link";
import { notFound } from "next/navigation";
import MerchantLogo from "@/components/MerchantLogo";
import RedeemPanel from "@/components/RedeemPanel";
import { categoryLabel } from "@/lib/categories";
import { countryFlag, countryName } from "@/lib/countries";
import { getMerchantWithDeals } from "@/lib/deals";
import { getViewer } from "@/lib/viewer";

export const dynamic = "force-dynamic";

function availabilityLabel(countries: string[]): string {
  if (countries.length === 0 || countries.includes("ALL")) {
    return "🇪🇺 Available across the EU";
  }
  return countries.map((c) => `${countryFlag(c)} ${countryName(c)}`).join(" · ");
}

export default async function MerchantPage({ params }: { params: { slug: string } }) {
  const { user, country } = await getViewer();
  const data = await getMerchantWithDeals(params.slug, country);

  if (!data) notFound();
  const { merchant, deals } = data;

  if (deals.length === 0) {
    // Merchant exists but nothing is available in the viewer's country:
    // the merchant page itself stays reachable, deals stay invisible.
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <MerchantLogo name={merchant.name} size="lg" logoUrl={merchant.logoUrl} />
        <h1 className="mt-4 font-display text-3xl font-extrabold">{merchant.name}</h1>
        <p className="mt-4 text-ink/70">
          No deals from {merchant.name} are available in {countryName(country)} right now.
        </p>
        <Link href="/tools" className="btn-secondary mt-6">
          ← Back to all tools
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/tools" className="text-sm font-bold text-ink/50 hover:text-ink">
        ← All tools
      </Link>

      {/* Merchant header */}
      <div className="mt-4 flex items-center gap-4">
        <MerchantLogo name={merchant.name} size="lg" logoUrl={merchant.logoUrl} />
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{merchant.name}</h1>
          <p className="text-sm font-bold text-ink/50">{categoryLabel(merchant.category)}</p>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-ink/80">{merchant.description}</p>

      {/* Deals */}
      <div className="mt-8 flex flex-col gap-6">
        {deals.map((deal) => (
          <section key={deal.id} className="card relative p-6 sm:p-8">
            <div className="absolute -right-2 -top-3 rotate-2 rounded-xl bg-badge px-4 py-2 font-display text-base font-extrabold tracking-tight shadow-card sm:text-lg">
              {deal.discountLabel}
            </div>

            <h2 className="pr-24 font-display text-xl font-bold leading-snug sm:text-2xl">
              {deal.title}
            </h2>
            <p className="mt-3 leading-relaxed text-ink/80">{deal.description}</p>

            <div className="mt-5">
              <RedeemPanel
                dealId={deal.id}
                redemptionType={deal.redemptionType}
                requiresAccount={deal.requiresAccount}
                loggedIn={!!user}
                merchantName={merchant.name}
              />
            </div>

            <dl className="mt-6 flex flex-col gap-2 border-t-2 border-ink/5 pt-4 text-sm text-ink/60">
              <div>
                <dt className="inline font-bold">Where:</dt>{" "}
                <dd className="inline">{availabilityLabel(deal.availableCountries)}</dd>
              </div>
              {deal.expiresAt && (
                <div>
                  <dt className="inline font-bold">Expires:</dt>{" "}
                  <dd className="inline">
                    {deal.expiresAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
              <div>
                <dt className="inline font-bold">The fine print:</dt>{" "}
                <dd className="inline">{deal.terms}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
