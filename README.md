# poorstudents.eu

A pan-EU discount platform for the digital tools students actually use — study
software, AI assistants, note tools, dev tooling. Free for students, forever.
Merchants pay; there is no student-facing paywall.

Digital-only is the whole point: one merchant deal serves every EU country at
once, and merchants can discount deeply because their marginal cost is near
zero.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Postgres via Prisma
- Auth.js (next-auth) email magic links — no passwords
- Deploys to Vercel; all secrets in environment variables

## Getting started

1. **Install dependencies** (also generates the Prisma client):

   ```bash
   npm install
   ```

2. **Configure environment.** Copy the example and fill in your values:

   ```bash
   cp .env.example .env
   ```

   You need a running Postgres and a `DATABASE_URL` pointing at it. Everything
   else has a sensible dev default — in particular, if `EMAIL_SERVER` is not
   set, magic sign-in links are **printed to the server console** instead of
   being emailed, so you can sign in locally with no SMTP account.

3. **Create the schema and seed data** (~19 placeholder merchants/deals and
   real university email domains for SE, DK, NO, FI, NL, DE, PL):

   ```bash
   npm run db:setup
   ```

4. **Run it:**

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000.

### Signing in locally

Enter any email on `/login`, then look at the terminal running `next dev` —
the magic link is printed there. Open it and you're signed in. Use an email
on a seeded university domain (e.g. `you@kth.se`) to see `isAcademicEmail`
get set; any other domain is counted in the Unknown Domains admin view.

### Admin

Set `ADMIN_EMAILS` in `.env` to a comma-separated allowlist, sign in with one
of those addresses, and open `/admin`. From there you can manage merchants,
deals (including pasting a newline-separated coupon-code pool for
`UNIQUE_CODE` deals), institutions, unknown domains and merchant leads, and
see the share of users with university emails, broken down by country.

## How access works

- Soft verification only: on signup the email domain is checked against the
  `Institution` table. A match sets `isAcademicEmail = true`; a miss logs the
  domain to `UnknownDomain`. **Nobody is ever blocked either way.**
- `canAccess()` in `lib/access.ts` is the single server-side gate. Codes and
  redemption URLs are never part of any page payload; the only way they leave
  the server is `POST /api/deals/[id]/redeem`, which checks access first and
  logs a `Redemption`.
- Deals are filtered by the viewer's country (account setting, header
  selector, or browser locale) against each deal's `availableCountries` at
  query time — a Sweden-only deal never reaches a browser in Portugal.
- `UNIQUE_CODE` deals assign codes from a pool atomically
  (`FOR UPDATE SKIP LOCKED`), never reassign them, and show "temporarily out
  of codes" when the pool runs dry.

## Deploying

Set the same environment variables from `.env.example` in Vercel (with a real
`EMAIL_SERVER` this time), point `DATABASE_URL` at a hosted Postgres, and run
`npx prisma db push && npx prisma db seed` against it once.

See [ROADMAP.md](./ROADMAP.md) for what is deliberately not in v1.
