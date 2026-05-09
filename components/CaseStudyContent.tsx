'use client';

import type { WorkEntry } from '@/lib/content';
import { FountainArtwork } from './FountainArtwork';

interface CaseStudyContentProps {
  entry: WorkEntry;
}

export function CaseStudyContent({ entry }: CaseStudyContentProps) {
  const isFountain = entry.slug === 'fountain';
  const hasClients = !!entry.clients && entry.clients.length > 0;
  const hasBody = !!entry.body?.trim();

  // Use frontmatter-defined metrics when present, otherwise show defaults.
  const metrics = entry.metrics?.length
    ? entry.metrics
    : [
        { label: 'Status', value: entry.status === 'open' ? 'Open' : 'NDA' },
        { label: 'Year', value: entry.year || '—' },
        { label: 'Role', value: entry.role || '—' },
        { label: 'Company', value: entry.client || '—' },
      ];

  // Build chapter list deterministically so the index numbering stays correct.
  const chapters: Array<{
    id: string;
    label: string;
    render: () => React.ReactNode;
    wide?: boolean;
    /** When true, chapter width auto-sizes to its multi-column content. */
    story?: boolean;
  }> = [];

  chapters.push({
    id: 'cover',
    label: 'Cover',
    render: () => (
      <div className="flex flex-col justify-center h-full max-w-[680px]">
        <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
          Case study · {String(entry.order ?? 0).padStart(2, '0')}
        </p>
        <h2
          className="mt-5 font-display m-0 leading-[1.02] tracking-[-0.022em]"
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
        >
          {entry.title}
        </h2>
        {entry.description && (
          <p className="mt-8 font-sans max-w-[44ch] text-[18px] md:text-[20px] leading-[1.5] opacity-90 m-0">
            {entry.description}
          </p>
        )}
        <p className="mt-12 font-mono text-[12px] uppercase tracking-[0.06em] opacity-50 m-0 flex items-center gap-3">
          <span>scroll</span>
          <span aria-hidden="true">→</span>
        </p>
      </div>
    ),
  });

  const isCustomStats = !!entry.metrics?.length;

  chapters.push({
    id: 'metrics',
    label: 'At a glance',
    wide: true,
    render: () => (
      <div className="flex flex-col justify-center h-full">
        <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
          At a glance
        </p>
        <div className="mt-12 grid grid-cols-2 gap-x-16 gap-y-14 max-w-[920px]">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-3 min-w-0">
              <span
                className="font-display tracking-[-0.014em] leading-[1.1]"
                style={{
                  fontSize: 'clamp(24px, 2.6vw, 36px)',
                  textWrap: 'balance' as React.CSSProperties['textWrap'],
                }}
              >
                {m.value}
              </span>
              <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.06em] opacity-60">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  });

  if (hasClients) {
    chapters.push({
      id: 'clients',
      label: 'Clients',
      wide: true,
      render: () => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
            Selected clients
          </p>
          <h3
            className="mt-3 font-display m-0 leading-[1.05] tracking-[-0.018em]"
            style={{ fontSize: 'clamp(24px, 2.4vw, 32px)' }}
          >
            Across two decades of work.
          </h3>
          <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-3 list-none p-0 m-0 max-w-[1200px]">
            {entry.clients!.map((c) => (
              <li
                key={c}
                className="font-display text-[18px] md:text-[20px] tracking-[-0.012em] m-0 opacity-90"
              >
                {c}
              </li>
            ))}
            <li className="font-mono text-[14px] tracking-[0.02em] opacity-50 self-center">
              + more
            </li>
          </ul>
        </div>
      ),
    });
  } else {
    chapters.push({
      id: 'ui',
      label: 'UI',
      wide: true,
      render: () => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
            UI artifacts
          </p>
          {isFountain ? (
            <div className="mt-6 w-[80vw] h-[64vh]">
              <FountainArtwork interactive />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-3 gap-6 w-[80vw] max-w-[1200px]">
              <Placeholder ratio="aspect-[3/4]" />
              <Placeholder ratio="aspect-[3/4]" />
              <Placeholder ratio="aspect-[3/4]" />
            </div>
          )}
        </div>
      ),
    });
  }

  if (hasBody) {
    chapters.push({
      id: 'story',
      label: 'Story',
      story: true,
      render: () => (
        <div className="flex flex-col h-full pt-[clamp(72px,10vh,128px)] pb-[clamp(48px,8vh,96px)]">
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
            Story
          </p>
          <div
            className="case-study-prose mt-10 flex-1 min-h-0"
            style={{
              columnWidth: '34ch',
              columnGap: '4em',
              columnFill: 'auto',
              columnRuleStyle: 'solid',
              columnRuleWidth: '1px',
              columnRuleColor: 'color-mix(in oklab, currentColor 12%, transparent)',
            }}
            dangerouslySetInnerHTML={{ __html: entry.bodyHtml ?? '' }}
          />
        </div>
      ),
    });
  }

  chapters.push({
    id: 'end',
    label: 'End',
    render: () => (
      <div className="flex flex-col justify-center h-full max-w-[520px]">
        <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
          End
        </p>
        <h3
          className="mt-5 font-display m-0 leading-[1.05] tracking-[-0.018em]"
          style={{ fontSize: 'clamp(28px, 3.6vw, 44px)' }}
        >
          {entry.title}
        </h3>
        <p className="mt-6 font-sans text-[16px] leading-[1.55] opacity-85">
          For NDA conversations and more on this work,{' '}
          <a
            href={`mailto:j@mcginn.co?subject=${encodeURIComponent(entry.title)}`}
            className="border-b border-current/40 hover:border-current"
            style={{ borderColor: 'currentColor' }}
          >
            get in touch
          </a>
          .
        </p>
        {entry.publicReference && (
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.04em] opacity-60 m-0">
            Public reference:{' '}
            <a
              href={entry.publicReference}
              target="_blank"
              rel="noopener"
              className="border-b border-current/40 hover:border-current"
              style={{ borderColor: 'currentColor' }}
            >
              {entry.publicReference.replace(/^https?:\/\//, '').replace(/\/$/, '')}{' '}
              ↗
            </a>
          </p>
        )}
      </div>
    ),
  });

  return (
    <div className="flex h-full">
      {chapters.map((c, i) => (
        <Chapter
          key={c.id}
          index={i + 1}
          label={c.label}
          wide={c.wide}
          story={c.story}
        >
          {c.render()}
        </Chapter>
      ))}
    </div>
  );
}

function Chapter({
  index,
  label,
  wide = false,
  story = false,
  children,
}: {
  index: number;
  label: string;
  wide?: boolean;
  story?: boolean;
  children: React.ReactNode;
}) {
  // story chapters auto-size width to fit their multi-column content;
  // wide chapters reserve extra horizontal space for grids/UI;
  // default chapters are exactly one viewport wide.
  const widthClass = story
    ? 'w-auto min-w-[80vw]'
    : wide
    ? 'w-[110vw] md:w-[120vw]'
    : 'w-[100vw]';

  return (
    <section
      aria-label={`Chapter ${index} — ${label}`}
      className={`relative shrink-0 h-full px-[clamp(32px,5vw,80px)] ${widthClass} border-r border-current/10`}
      style={{ borderColor: 'currentColor' }}
    >
      <span
        aria-hidden="true"
        className="absolute top-[clamp(16px,3vw,32px)] left-[clamp(32px,5vw,80px)] font-mono text-[12px] uppercase tracking-[0.06em] opacity-40"
      >
        {String(index).padStart(2, '0')} / {label}
      </span>
      {children}
    </section>
  );
}

function Placeholder({ ratio }: { ratio: string }) {
  return (
    <div
      className={`${ratio} w-full border border-current/30 relative`}
      style={{ borderColor: 'currentColor' }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.06em] opacity-40">
        UI · TBD
      </span>
    </div>
  );
}
