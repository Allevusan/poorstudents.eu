import Link from "next/link";
import CountrySelector from "@/components/CountrySelector";
import { getViewer } from "@/lib/viewer";

export default async function Header() {
  const { user, country } = await getViewer();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/5 bg-wash/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
          poor<span className="text-accent">students</span>.eu
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/tools"
            className="hidden text-sm font-bold text-ink/70 transition hover:text-ink sm:block"
          >
            Browse tools
          </Link>
          <Link
            href="/for-businesses"
            className="hidden text-sm font-bold text-ink/70 transition hover:text-ink md:block"
          >
            For businesses
          </Link>
          <CountrySelector current={country} />
          {user ? (
            <Link
              href="/account"
              className="rounded-chunky bg-accent-soft px-3 py-1.5 text-sm font-bold text-accent-dark transition hover:bg-accent hover:text-white"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-chunky bg-accent px-3 py-1.5 text-sm font-bold text-white transition hover:bg-accent-dark"
            >
              Sign up free
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
