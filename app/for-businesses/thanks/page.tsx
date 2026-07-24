import Link from "next/link";

export default function LeadThanksPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>🤝</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Got it!</h1>
      <p className="mt-3 font-medium text-ink/60">
        Thanks for reaching out — we&apos;ll be in touch within a couple of days to talk details.
      </p>
      <Link href="/" className="btn-secondary mt-8">
        ← Back to the site
      </Link>
    </div>
  );
}
