import Link from 'next/link';

interface FooterProps {
  /** Pin to the bottom of the viewport so the nav stays in reach while
      scrolling — currently used on the homepage. */
  sticky?: boolean;
}

export function Footer({ sticky = false }: FooterProps) {
  const wrapperClass = sticky
    ? 'fixed inset-x-0 bottom-0 z-30 w-full px-[clamp(20px,4vw,48px)] pt-3 pointer-events-none'
    : 'w-full px-[clamp(20px,4vw,48px)] pb-10 pt-6';

  const wrapperStyle = sticky
    ? {
        color: 'var(--theme-ink)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }
    : { color: 'var(--theme-ink)' };

  return (
    <footer className={wrapperClass} style={wrapperStyle}>
      <div
        className={`flex flex-col gap-2 md:flex-row md:items-center md:justify-between opacity-70 ${sticky ? 'pointer-events-auto' : ''}`}
      >
        <p className="font-mono text-[12px] leading-[1.6] m-0">
          © 2026 John McGinn · Charleston, SC
        </p>
        <nav
          aria-label="Footer"
          className="font-mono text-[12px] leading-[1.6] flex items-center gap-x-5"
        >
          <a
            href="mailto:j@mcginn.co"
            className="border-b border-transparent hover:border-current transition-colors"
          >
            j@mcginn.co
          </a>
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
