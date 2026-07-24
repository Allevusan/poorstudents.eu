"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EU_COUNTRIES, countryFlag } from "@/lib/countries";

export default function CountrySelector({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [, startTransition] = useTransition();

  async function onChange(country: string) {
    setValue(country);
    await fetch("/api/country", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2 text-base" aria-hidden>
        {countryFlag(value)}
      </span>
      <span className="sr-only">Your country</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-chunky border-2 border-ink/10 bg-white py-1.5 pl-8 pr-6 text-sm font-bold text-ink/80 outline-none transition hover:border-ink/25 focus:border-accent"
      >
        {EU_COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-xs text-ink/40" aria-hidden>
        ▾
      </span>
    </label>
  );
}
