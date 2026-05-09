'use client';

import { useState } from 'react';
import type { WorkEntry } from '@/lib/content';
import { WorkSection } from './WorkSection';
import { FountainArtwork } from './FountainArtwork';
import { CaseStudyModal } from './CaseStudyModal';
import { HistorySection } from './HistorySection';

interface WorkSectionsProps {
  entries: WorkEntry[];
}

export function WorkSections({ entries }: WorkSectionsProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openEntry = entries.find((e) => e.slug === openSlug) ?? null;

  return (
    <>
      {entries.map((entry, i) => {
        if (entry.slug === 'history') {
          return <HistorySection key={entry.slug} entry={entry} />;
        }
        return (
          <WorkSection
            key={entry.slug}
            entry={entry}
            index={i}
            total={entries.length}
            artwork={
              entry.slug === 'fountain' ? (
                <FountainArtwork bleed onOpen={() => setOpenSlug(entry.slug)} />
              ) : undefined
            }
            onOpen={() => setOpenSlug(entry.slug)}
          />
        );
      })}
      {openEntry && (
        <CaseStudyModal entry={openEntry} onClose={() => setOpenSlug(null)} />
      )}
    </>
  );
}
