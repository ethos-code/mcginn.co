import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadLogEntries, loadLogEntry, renderMarkdown } from '@/lib/content';

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = loadLogEntries()
    .filter((e) => !e.locked)
    .map((e) => ({ slug: e.slug }));
  // Static export requires at least one param; sentinel 404s at runtime.
  return entries.length > 0 ? entries : [{ slug: '__none' }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadLogEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.body?.split('\n').find((l) => l.trim())?.slice(0, 160),
    alternates: { canonical: `https://mcginn.co/logbook/${entry.slug}` },
    openGraph: {
      title: `${entry.title} · John McGinn`,
      url: `https://mcginn.co/logbook/${entry.slug}`,
    },
  };
}

export default async function LogbookEntryPage({ params }: Params) {
  const { slug } = await params;
  if (slug === '__none') notFound();
  const entry = loadLogEntry(slug);
  if (!entry || entry.locked) notFound();

  const html = await renderMarkdown(entry.body);

  return (
    <article className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Photo column — full bleed on desktop */}
      <div
        className="relative w-full md:w-1/2 h-[42vh] md:h-screen md:sticky md:top-0 md:self-start"
        aria-hidden={!entry.image}
      >
        {entry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt={entry.imageAlt ?? entry.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-ink/5 flex items-center justify-center">
            <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink/35">
              [ photo · forthcoming ]
            </span>
          </div>
        )}
      </div>

      {/* Content column */}
      <div className="relative w-full md:w-1/2 px-[clamp(24px,4vw,72px)] py-[clamp(48px,8vh,120px)] flex flex-col">
        <Link
          href="/logbook"
          aria-label="Back to logbook"
          className="inline-flex items-center gap-2 font-mono text-[13px] text-ink/65 hover:text-ink transition-colors w-fit"
        >
          <span aria-hidden="true">←</span>
          <span>logbook</span>
        </Link>

        <header className="mt-12 max-w-[58ch]">
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-ink/55 m-0">
            {entry.year}
          </p>
          <h1
            className="mt-4 font-display text-ink m-0 leading-[1.05] tracking-[-0.018em]"
            style={{ fontSize: 'clamp(32px, 4.4vw, 56px)' }}
          >
            {entry.title}
          </h1>
        </header>

        <div
          className="mt-12 max-w-[58ch] font-sans text-ink/90 text-[17px] leading-[1.65] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:border-b [&_a]:border-ink/30 hover:[&_a]:border-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-16 pt-6 border-t border-hairline max-w-[58ch]">
          <Link
            href="/logbook"
            className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.04em] uppercase text-ink/55 hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>back to logbook</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
