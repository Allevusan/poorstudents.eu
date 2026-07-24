"use client";

import Link from "next/link";
import { useState } from "react";

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "revealed"; code: string | null; url: string }
  | { state: "outOfCodes" }
  | { state: "error"; message: string };

export default function RedeemPanel({
  dealId,
  redemptionType,
  requiresAccount,
  loggedIn,
  merchantName,
}: {
  dealId: string;
  redemptionType: "STATIC_CODE" | "UNIQUE_CODE" | "LINK_ONLY";
  requiresAccount: boolean;
  loggedIn: boolean;
  merchantName: string;
}) {
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [copied, setCopied] = useState(false);

  const needsSignup = (requiresAccount || redemptionType === "UNIQUE_CODE") && !loggedIn;

  if (needsSignup) {
    return (
      <Link href={`/login?from=/tools`} className="btn-primary w-full sm:w-auto">
        🔓 Sign up free to unlock
      </Link>
    );
  }

  async function reveal() {
    setResult({ state: "loading" });
    try {
      const res = await fetch(`/api/deals/${dealId}/redeem`, { method: "POST" });
      const data = await res.json();
      if (data.outOfCodes) {
        setResult({ state: "outOfCodes" });
      } else if (data.requiresAccount) {
        window.location.href = "/login";
      } else if (res.ok) {
        setResult({ state: "revealed", code: data.code ?? null, url: data.url });
      } else {
        setResult({ state: "error", message: data.error ?? "Something went wrong" });
      }
    } catch {
      setResult({ state: "error", message: "Something went wrong. Try again?" });
    }
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the code is on screen anyway
    }
  }

  if (result.state === "outOfCodes") {
    return (
      <div className="rounded-chunky border-2 border-dashed border-ink/20 bg-washdeep/60 px-5 py-4 font-bold text-ink/70">
        😔 Temporarily out of codes — check back soon, we&apos;re getting more.
      </div>
    );
  }

  if (result.state === "revealed") {
    return (
      <div className="flex flex-col gap-3">
        {result.code && (
          <div className="flex items-stretch gap-2">
            <div className="flex-1 select-all rounded-chunky border-2 border-dashed border-accent bg-accent-soft px-4 py-3 text-center font-mono text-lg font-bold tracking-wider">
              {result.code}
            </div>
            <button onClick={() => copy(result.code!)} className="btn-secondary shrink-0 px-4">
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        )}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full sm:w-auto"
        >
          Go to {merchantName} →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={reveal}
        disabled={result.state === "loading"}
        className="btn-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {result.state === "loading"
          ? "One sec…"
          : redemptionType === "LINK_ONLY"
            ? "Get the deal →"
            : "Reveal code"}
      </button>
      {result.state === "error" && (
        <p className="text-sm font-bold text-red-600">{result.message}</p>
      )}
    </div>
  );
}
