/**
 * Fail-fast environment validation. Imported by lib/prisma.ts, so it runs as
 * soon as any server code touches the database — i.e. at startup of the
 * first request. Skipped while `next build` collects page data, because the
 * build machine may legitimately lack runtime secrets.
 */

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const isProduction = process.env.NODE_ENV === "production";

// In dev, Resend/EMAIL_FROM may be absent (magic links fall back to the
// console) and NEXTAUTH_URL defaults to localhost via .env.
const REQUIRED = isProduction
  ? ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET", "RESEND_API_KEY", "EMAIL_FROM", "ADMIN_EMAILS"]
  : ["DATABASE_URL", "NEXTAUTH_SECRET"];

export function assertEnv() {
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? "s" : ""}: ` +
        `${missing.join(", ")}. See .env.example for what each one does.`
    );
  }
}

if (!isBuildPhase) {
  assertEnv();
}
