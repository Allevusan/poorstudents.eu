import type { Metadata } from "next";
import { submitLead } from "./actions";

export const metadata: Metadata = {
  title: "For businesses — poorstudents.eu",
  description:
    "Reach students across all 27 EU countries with one listing. Digital products only, pay for results.",
};

const PITCH = [
  {
    emoji: "🇪🇺",
    title: "27 countries, one listing",
    text: "Your product is digital, so one deal works for every student from Lisbon to Helsinki. No local partners, no per-country negotiations, no 27 rebuilds.",
  },
  {
    emoji: "🎯",
    title: "Exactly your audience",
    text: "Students hunting for study software, AI tools and dev tooling — people choosing the products they'll pay full price for after graduation.",
  },
  {
    emoji: "📊",
    title: "Pay for results",
    text: "We track every code reveal and click-through, and we can tell you what share of our users signed up with a verified university email domain.",
  },
];

export default function ForBusinessesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Students across the EU.
          <br />
          <span className="text-accent">One listing.</span>
        </h1>
        <p className="mt-4 text-lg font-medium text-ink/70">
          poorstudents.eu puts your product in front of students in all 27 EU countries. Digital
          tools only — near-zero marginal cost for you, a deep discount for them, new lifelong
          customers for your funnel.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PITCH.map((item) => (
          <div key={item.title} className="card p-6">
            <p className="text-3xl" aria-hidden>{item.emoji}</p>
            <h2 className="mt-3 font-display text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-xl">
        <div className="card border-2 border-accent/20 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Get listed</h2>
          <p className="mt-1 text-sm text-ink/60">
            Tell us about your product and we&apos;ll get back to you within a couple of days.
          </p>
          <form action={submitLead} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="label">Company</label>
                <input id="companyName" name="companyName" required className="input" />
              </div>
              <div>
                <label htmlFor="contactName" className="label">Your name</label>
                <input id="contactName" name="contactName" required className="input" />
              </div>
              <div>
                <label htmlFor="email" className="label">Work email</label>
                <input id="email" name="email" type="email" required className="input" />
              </div>
              <div>
                <label htmlFor="website" className="label">Product website</label>
                <input id="website" name="website" type="url" required placeholder="https://" className="input" />
              </div>
            </div>
            <div>
              <label htmlFor="productDescription" className="label">
                What&apos;s the product, and what could you offer students?
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                rows={4}
                required
                className="input"
                placeholder="e.g. Note-taking app, thinking 50% off the Pro plan for students…"
              />
            </div>
            <button type="submit" className="btn-primary">
              Send it →
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-ink/50">
          Digital products only — that&apos;s the whole point. We don&apos;t list cafés, gyms or
          retail.
        </p>
      </div>
    </div>
  );
}
