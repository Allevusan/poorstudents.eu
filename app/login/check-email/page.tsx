import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check your email — poorstudents.eu",
};

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>📬</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Check your inbox</h1>
      <p className="mt-3 font-medium text-ink/60">
        We sent you a sign-in link. Click it and you&apos;re in — codes unlock instantly.
      </p>
      <p className="mt-6 text-xs text-ink/40">
        Nothing there? Give it a minute and check spam. The link is valid for 24 hours.
      </p>
    </div>
  );
}
