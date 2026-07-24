import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  countryFromAcceptLanguage,
  isValidCountry,
} from "@/lib/countries";

/**
 * Resolves who is looking at the page and from which country, server-side.
 * Priority: logged-in user's saved country → selector cookie → browser
 * locale → default.
 */
export async function getViewer() {
  const user = await getCurrentUser();

  let country: string | null = null;
  if (user && isValidCountry(user.countryCode)) {
    country = user.countryCode;
  }
  if (!country) {
    const cookieCountry = cookies().get(COUNTRY_COOKIE)?.value;
    if (isValidCountry(cookieCountry)) country = cookieCountry;
  }
  if (!country) {
    country = countryFromAcceptLanguage(headers().get("accept-language"));
  }

  return { user, country: country ?? DEFAULT_COUNTRY };
}
