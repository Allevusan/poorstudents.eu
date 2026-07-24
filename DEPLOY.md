# Deploying poorstudents.eu to Vercel

From zero to a live deployment. You need accounts on
[Vercel](https://vercel.com), [Neon](https://neon.tech) and
[Resend](https://resend.com) — all have free tiers that are enough for v1.

## 1. Create the database (Neon)

1. In the Neon console, **Create project** → name it `poorstudents`, pick a
   region close to your users (e.g. Frankfurt).
2. On the project dashboard, open **Connection details** and copy the
   **direct (unpooled)** connection string — the host *without* `-pooler` in
   it. It looks like:

   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   Use the direct string: `prisma migrate deploy` runs during every build and
   doesn't work reliably through PgBouncer's transaction pooling. At v1
   traffic this is also fine for the app itself; if you later hit connection
   limits, add Neon's pooled string as `DATABASE_URL` and the direct one as a
   `directUrl` in `prisma/schema.prisma`.

## 2. Set up email (Resend)

1. In Resend, **Domains → Add domain**, add the domain you'll send from
   (e.g. `poorstudents.eu`) and create the DNS records it shows you. Wait for
   it to verify.
2. **API keys → Create API key** (Sending access is enough). Copy it — this
   is `RESEND_API_KEY`.
3. Your `EMAIL_FROM` must be on the verified domain, e.g.
   `PoorStudents <hello@poorstudents.eu>`.

## 3. Create the Vercel project

1. Push this repo to GitHub (already done if you're reading this there).
2. In Vercel, **Add New → Project**, import the repo. Framework preset:
   Next.js. Leave build settings alone — `npm run build` already runs
   `prisma migrate deploy && next build`, so the schema is migrated on every
   deploy, and `postinstall` generates the Prisma client.
3. Before the first deploy, add the environment variables below
   (**Settings → Environment Variables**, apply to Production — and Preview
   if you want working preview deploys):

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | the Neon direct connection string from step 1 |
   | `NEXTAUTH_URL` | the site's canonical URL, e.g. `https://poorstudents.eu` (use the `*.vercel.app` URL until the domain is attached) |
   | `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` |
   | `RESEND_API_KEY` | the key from step 2 |
   | `EMAIL_FROM` | e.g. `PoorStudents <hello@poorstudents.eu>` |
   | `ADMIN_EMAILS` | comma-separated admin emails; first one gets lead notifications |

   All six are required in production — the app fails at startup with a
   clear error naming any missing one.

4. **Deploy.** The first build applies the initial migration to the empty
   Neon database, so this just works.

## 4. Seed the production database (once)

The seed is idempotent (pure upserts), so it's safe to run more than once.
From your machine:

```bash
npm install
DATABASE_URL="postgresql://…the same Neon direct string…" npm run seed
```

This creates the ~19 placeholder merchants/deals and the university email
domain table. Delete or replace placeholder merchants from `/admin` as real
deals land.

## 5. After the first deploy

- Visit `/login`, sign in with an address from `ADMIN_EMAILS` (the magic
  link now arrives by email via Resend), then open `/admin`.
- If you attach a custom domain later: add it in Vercel, then update
  `NEXTAUTH_URL` to match and redeploy — magic-link URLs are built from it.

## Schema changes later

Edit `prisma/schema.prisma`, run `npm run db:migrate -- --name whatever`
locally to create a migration (this also applies it to your local database),
commit the generated folder under `prisma/migrations/`, and push — the next
Vercel build applies it to production automatically.
