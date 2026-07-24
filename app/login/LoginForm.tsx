"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await signIn("email", {
      email: email.trim().toLowerCase(),
      redirect: false,
      callbackUrl: "/tools",
    });
    setLoading(false);
    if (res?.error) {
      setError("Couldn't send the link. Try again in a moment.");
    } else {
      window.location.href = "/login/check-email";
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">
          Your email
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="you@university.eu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Sending…" : "Send me the link"}
      </button>
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      <p className="text-center text-xs text-ink/50">
        A university email is nice, but any email works. We never block anyone.
      </p>
    </form>
  );
}
