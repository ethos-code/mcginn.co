import type { LogEntry } from '@/lib/content';

interface LogbookEntryProps {
  entry: LogEntry;
  bodyHtml: string;
}

export function LogbookEntryRow({ entry, bodyHtml }: LogbookEntryProps) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-2 md:gap-8 py-9 border-b border-hairline last:border-b-0">
      <div className="font-mono text-muted text-[13px] leading-[1.6] md:pt-[0.45em]">
        {entry.year}
      </div>
      <div className="max-w-[60ch]">
        <h3
          className="font-sans text-ink m-0 leading-[1.35]"
          style={{ fontSize: '19px', letterSpacing: '-0.005em' }}
        >
          {entry.title}
        </h3>
        {entry.image && (
          <div className="mt-4 max-w-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image}
              alt={entry.imageAlt ?? entry.title}
              className="block w-full h-auto"
              loading="lazy"
            />
          </div>
        )}
        <div
          className="mt-3 font-sans text-ink/85 text-[16px] leading-[1.65] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:border-b [&_a]:border-ink/30 hover:[&_a]:border-ink"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </article>
  );
}
