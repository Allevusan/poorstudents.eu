export const EU_COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czechia", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
];

export const COUNTRY_COOKIE = "ps_country";
export const DEFAULT_COUNTRY = "DE";

export function isValidCountry(code: string | undefined | null): code is string {
  return !!code && EU_COUNTRIES.some((c) => c.code === code);
}

export function countryName(code: string): string {
  return EU_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export function countryFlag(code: string): string {
  return EU_COUNTRIES.find((c) => c.code === code)?.flag ?? "🇪🇺";
}

/** Best-effort country guess from an Accept-Language header, e.g. "sv-SE,sv;q=0.9". */
export function countryFromAcceptLanguage(header: string | null): string | null {
  if (!header) return null;
  const matches = header.match(/[a-zA-Z]{2}-([A-Z]{2})/g) ?? [];
  for (const m of matches) {
    const region = m.split("-")[1];
    if (isValidCountry(region)) return region;
  }
  // Fall back to mapping bare language codes to their most likely EU country
  const langMap: Record<string, string> = {
    sv: "SE", da: "DK", nb: "NO", nn: "NO", no: "NO", fi: "FI",
    nl: "NL", de: "DE", pl: "PL", fr: "FR", es: "ES", it: "IT",
    pt: "PT", el: "GR", cs: "CZ", hu: "HU", ro: "RO", bg: "BG",
    hr: "HR", sk: "SK", sl: "SI", et: "EE", lv: "LV", lt: "LT",
    ga: "IE", mt: "MT",
  };
  const firstLang = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return langMap[firstLang] ?? null;
}
