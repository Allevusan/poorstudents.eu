import Link from "next/link";
import MerchantLogo from "@/components/MerchantLogo";
import { categoryLabel } from "@/lib/categories";
import type { DealCardData } from "@/lib/deals";

export default function DealCard({ deal }: { deal: DealCardData }) {
  return (
    <Link
      href={`/tools/${deal.merchant.slug}`}
      className="card group relative flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* The loudest element on the page */}
      <div className="absolute -right-2 -top-3 rotate-2 rounded-xl bg-badge px-3 py-1.5 font-display text-sm font-extrabold tracking-tight text-ink shadow-card transition group-hover:rotate-3 sm:text-base">
        {deal.discountLabel}
      </div>

      <div className="flex items-center gap-3 pr-16">
        <MerchantLogo name={deal.merchant.name} logoUrl={deal.merchant.logoUrl} />
        <div className="min-w-0">
          <p className="truncate font-bold">{deal.merchant.name}</p>
          <p className="truncate text-xs font-bold text-ink/50">
            {categoryLabel(deal.category)}
          </p>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold leading-snug">{deal.title}</h3>

      <div className="mt-auto">
        {deal.requiresAccount ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-dark">
            🔓 Sign up free to unlock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-washdeep px-3 py-1 text-xs font-bold text-ink/70">
            ⚡ No account needed
          </span>
        )}
      </div>
    </Link>
  );
}
