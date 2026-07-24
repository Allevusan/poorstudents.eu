import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink/5 bg-washdeep/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold">
          poor<span className="text-accent">students</span>.eu — every tool you actually need, cheaper.
        </p>
        <nav className="flex flex-wrap gap-4 font-bold">
          <Link href="/tools" className="transition hover:text-ink">Browse tools</Link>
          <Link href="/#how-it-works" className="transition hover:text-ink">How it works</Link>
          <Link href="/for-businesses" className="transition hover:text-ink">For businesses</Link>
        </nav>
      </div>
    </footer>
  );
}
