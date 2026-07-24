import type { Category, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Country + liveness filter, applied at query time so unavailable deals never
 * reach the page at all. A deal is visible when both it and its merchant are
 * active, it hasn't expired, and both merchant and deal cover the country.
 */
function visibleWhere(country: string): Prisma.DealWhereInput {
  const coversCountry = { hasSome: ["ALL", country] };
  return {
    isActive: true,
    availableCountries: coversCountry,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    merchant: { isActive: true, availableCountries: coversCountry },
  };
}

/** Card-safe fields — codes and redemption URLs never appear in list payloads. */
const cardSelect = {
  id: true,
  title: true,
  discountLabel: true,
  category: true,
  requiresAccount: true,
  isFeatured: true,
  createdAt: true,
  merchant: {
    select: { name: true, slug: true, logoUrl: true },
  },
} satisfies Prisma.DealSelect;

export type DealCardData = Prisma.DealGetPayload<{ select: typeof cardSelect }>;

export async function getFeaturedDeals(country: string): Promise<DealCardData[]> {
  const featured = await prisma.deal.findMany({
    where: { ...visibleWhere(country), isFeatured: true },
    select: cardSelect,
    orderBy: { createdAt: "asc" },
    take: 8,
  });
  if (featured.length >= 8) return featured;

  const fill = await prisma.deal.findMany({
    where: { ...visibleWhere(country), id: { notIn: featured.map((d) => d.id) } },
    select: cardSelect,
    orderBy: { createdAt: "asc" },
    take: 8 - featured.length,
  });
  return [...featured, ...fill];
}

export async function getCatalogue(opts: {
  country: string;
  category?: Category;
  q?: string;
}): Promise<DealCardData[]> {
  const { country, category, q } = opts;
  return prisma.deal.findMany({
    where: {
      ...visibleWhere(country),
      ...(category ? { category } : {}),
      ...(q
        ? {
            AND: [
              {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { merchant: { is: { name: { contains: q, mode: "insensitive" } } } },
                ],
              },
            ],
          }
        : {}),
    },
    select: cardSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
  });
}

/**
 * Merchant page payload. staticCode and redemptionUrl are deliberately never
 * selected here: they only ever leave the server via the redeem endpoint,
 * which runs canAccess() first. This keeps gated codes out of the page
 * payload by construction, not by CSS.
 */
export async function getMerchantWithDeals(slug: string, country: string) {
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
  });
  if (!merchant || !merchant.isActive) return null;

  const deals = await prisma.deal.findMany({
    where: { ...visibleWhere(country), merchantId: merchant.id },
    select: {
      id: true,
      title: true,
      description: true,
      discountLabel: true,
      category: true,
      redemptionType: true,
      terms: true,
      availableCountries: true,
      requiresAccount: true,
      expiresAt: true,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return { merchant, deals };
}

export type MerchantPageDeal = NonNullable<
  Awaited<ReturnType<typeof getMerchantWithDeals>>
>["deals"][number];
