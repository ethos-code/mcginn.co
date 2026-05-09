import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadWorkEntries, loadWorkEntry, renderMarkdown } from '@/lib/content';
import { Footer } from '@/components/Footer';

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = loadWorkEntries()
    .filter((e) => e.status === 'open' && (e.body?.trim().length ?? 0) > 0 && !e.external)
    .map((e) => ({ slug: e.slug }));
  // Static export requires at least one param; sentinel 404s at runtime.
  return entries.length > 0 ? entries : [{ slug: '__none' }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadWorkEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `https://mcginn.co/work/${entry.slug}` },
    openGraph: {
      title: `${entry.title} · John McGinn`,
      description: entry.description,
      url: `https://mcginn.co/work/${entry.slug}`,
    },
  };
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  if (slug === '__none') notFound();
  const entry = loadWorkEntry(slug);
  if (
    !entry ||
    entry.status !== 'open' ||
    entry.external ||
    !entry.body?.trim()
  ) {
    notFound();
  }
  const html = await renderMarkdown(entry.body);

  return (
    <main className="w-full px-[clamp(24px,6vw,96px)] pt-[18vh] pb-[10vh]">
      <article className="mx-auto max-w-[720px]">
        <p className="font-mono text-muted text-[13px] mb-3">{entry.year}</p>
        <h1
          className="font-display text-ink m-0"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.018em', lineHeight: 1.1 }}
        >
          {entry.title}
        </h1>
        {entry.description && (
          <p className="mt-6 max-w-[60ch] font-sans text-ink/85 text-[18px] md:text-[20px] leading-[1.55]">
            {entry.description}
          </p>
        )}
        <div
          className="mt-12 font-sans text-ink/90 text-[17px] leading-[1.65] max-w-[60ch] [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[24px] [&_h3]:font-display [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[19px] [&_p]:mb-4 [&_a]:border-b [&_a]:border-ink/30 hover:[&_a]:border-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_li]:mb-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="mt-16 font-mono text-[13px] text-muted">
          <Link href="/" className="border-b border-transparent hover:border-muted">
            ← back
          </Link>
        </p>
      </article>
      <Footer />
    </main>
  );
}
