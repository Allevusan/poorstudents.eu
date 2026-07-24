import type { Deal, User } from "@prisma/client";

/**
 * A deal or merchant is available in a country when its availableCountries
 * list contains "ALL" or the country code. An empty list means ALL.
 */
export function isAvailableIn(
  availableCountries: string[],
  countryCode: string | null | undefined
): boolean {
  if (availableCountries.length === 0 || availableCountries.includes("ALL")) {
    return true;
  }
  if (!countryCode) return false;
  return availableCountries.includes(countryCode);
}

export type Viewer = Pick<User, "id" | "countryCode"> | null;

/**
 * The single server-side gate for redemption details (codes, redemption URLs).
 * Never decide access on the client: anything this returns false for must be
 * stripped from the page payload entirely.
 */
export function canAccess(
  user: Viewer,
  deal: Pick<Deal, "isActive" | "requiresAccount" | "expiresAt" | "availableCountries">,
  viewerCountry?: string | null
): boolean {
  if (!deal.isActive) return false;
  if (deal.expiresAt && deal.expiresAt < new Date()) return false;
  const country = user?.countryCode || viewerCountry || null;
  if (!isAvailableIn(deal.availableCountries, country)) return false;
  if (deal.requiresAccount && !user) return false;
  return true;
}
