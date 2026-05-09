import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="w-full px-[clamp(24px,6vw,96px)] pb-10 pt-6"
      style={{ color: 'var(--theme-ink)' }}
    >
      <div className="mx-auto flex max-w-[960px] flex-col gap-2 md:flex-row md:items-center md:justify-between opacity-70">
        <p className="font-mono text-[12px] leading-[1.6] m-0">
          © 2026 John McGinn · Seattle, WA
        </p>
        <nav
          aria-label="Footer"
          className="font-mono text-[12px] leading-[1.6] flex items-center gap-x-5"
        >
          <Link
            href="/resume"
            className="border-b border-transparent hover:border-current transition-colors"
          >
            /resume
          </Link>
          <Link
            href="/logbook"
            className="border-b border-transparent hover:border-current transition-colors"
          >
            /logbook
          </Link>
        </nav>
      </div>
    </footer>
  );
}
