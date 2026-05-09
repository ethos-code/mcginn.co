import Link from 'next/link';
import type { LogEntry } from '@/lib/content';

interface LogbookProps {
  entries: LogEntry[];
}

export function Logbook({ entries }: LogbookProps) {
  return (
    <main className="w-full px-[clamp(24px,6vw,96px)] pt-[10vh] pb-[14vh] min-h-screen">
      <div className="mx-auto max-w-[760px]">
        <header className="mb-16">
          <h1
            className="font-display text-ink"
            style={{
              fontSize: 'clamp(48px, 7vw, 64px)',
              letterSpacing: '-0.018em',
              lineHeight: 1.05,
            }}
          >
            Logbook.
          </h1>
          <p className="mt-6 max-w-[52ch] font-sans text-ink/85 text-[18px] leading-[1.55]">
            Notes from the work. Essays on AI experience design, agentic
            systems, and what comes after the screen.
          </p>
        </header>

        <ul className="border-t border-hairline list-none p-0 m-0">
          {entries.map((entry, i) => (
            <li key={entry.slug} className="border-b border-hairline">
              <LogbookRow entry={entry} index={i + 1} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function LogbookRow({ entry, index }: { entry: LogEntry; index: number }) {
  const indexLabel = String(index).padStart(2, '0');

  const inner = (
    <>
      <p className="font-mono text-muted text-[12px] leading-[1.6] tracking-[0.04em] m-0 md:pt-[0.45em]">
        {entry.year || indexLabel}
      </p>
      <div className="max-w-[58ch] flex flex-col gap-3">
        <h2
          className="font-sans text-ink m-0 leading-[1.3]"
          style={{ fontSize: '21px', letterSpacing: '-0.005em' }}
        >
          {entry.title}
        </h2>
        {entry.description && (
          <p className="font-sans text-ink/75 text-[15px] md:text-[16px] leading-[1.6] m-0">
            {entry.description}
          </p>
        )}
        {entry.locked && (
          <p
            aria-label="Draft — not yet published"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/50 m-0"
          >
            <LockIcon />
            <span>Draft</span>
          </p>
        )}
      </div>
    </>
  );

  if (entry.locked) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-2 md:gap-8 py-10">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/logbook/${entry.slug}`}
      className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-2 md:gap-8 py-10 group hover:bg-ink/[0.015] transition-colors"
    >
      {inner}
    </Link>
  );
}

function LockIcon() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 11 13"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="0.75"
        y="5.75"
        width="9.5"
        height="6.5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M2.75 5.75V3.5C2.75 1.98 3.98 0.75 5.5 0.75C7.02 0.75 8.25 1.98 8.25 3.5V5.75"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
