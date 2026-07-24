# Roadmap

Things deliberately **not** in v1, in rough priority order. The v1 data model
was shaped so most of these bolt on without rebuilding anything.

## Verification (tightening the signal)

v1 measures student status (`isAcademicEmail`) but never blocks anyone. If
merchants start asking for harder guarantees:

- **Document upload + manual review queue** — student card / enrolment proof,
  reviewed in admin. Deliberately skipped in v1: heavy ops burden, kills the
  one-click signup.
- **Verification expiry** — academic status re-checked yearly (students
  graduate). Needs `verifiedAt`/`expiresAt` on the user.
- **Third-party verification vendors** (SheerID-style) as a per-merchant
  opt-in for deals that contractually require hard verification.
- **Per-deal audience targeting** — e.g. a deal only for `isAcademicEmail`
  users. The `canAccess()` helper is the single place to add this.

## Merchant side

- **Merchant self-serve dashboard** — stats, coupon pool top-up, deal editing.
  v1 keeps merchants as CRM rows (`MerchantLead`) and admin-managed records.
- **Affiliate/click tracking with payouts** — v1 logs `Redemption` rows, which
  is enough to invoice on, but there's no per-merchant reporting UI or
  attribution beyond that.
- **Reviews / ratings** of tools by students.

## Student side

- **Student paid tiers** — explicitly never for core access ("no student-facing
  paywall, ever"), but a premium tier for extras remains possible.
- **Referrals** — invite a coursemate, both get something.
- **Mobile app** — the site is mobile-first; an app only makes sense once
  retention warrants push notifications.
- **Saved/favourite deals and email alerts** for new deals in your country.

## Platform

- **Multi-language UI** — v1 is English-only, but all UI strings live in
  components (no hardcoded locale logic elsewhere) and country handling is
  already separate from language, so adding locales is additive.
- **Non-EU expansion** (UK, CH, EEA beyond NO) — country list is a single
  constant in `lib/countries.ts`.
- **Rate limiting** on the redeem endpoint and magic-link requests.
