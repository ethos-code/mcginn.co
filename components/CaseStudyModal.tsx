'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkEntry } from '@/lib/content';
import { PasswordGate } from './PasswordGate';
import { CaseStudyContent } from './CaseStudyContent';
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll';

interface CaseStudyModalProps {
  entry: WorkEntry;
  onClose: () => void;
}

export function CaseStudyModal({ entry, onClose }: CaseStudyModalProps) {
  const isLocked = entry.status === 'locked';
  const [unlocked, setUnlocked] = useState(!isLocked);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll + pause Lenis (so its wheel listeners don't intercept
  // events that the modal needs to handle as horizontal pans). ESC closes.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseSmoothScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      resumeSmoothScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Map vertical wheel → horizontal scroll inside the modal.
  useEffect(() => {
    if (!unlocked) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Vertical wheel → horizontal pan. The Story chapter uses CSS columns
      // that flow horizontally as part of the same scroll, so we always map.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [unlocked]);

  const bg = entry.bg ?? '#0A0908';
  const ink = entry.ink ?? '#FAFAF7';
  const accent = entry.accent ?? '#7A7672';

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${entry.title} — case study`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50"
        style={{
          backgroundColor: bg,
          color: ink,
          ['--cs-ink' as string]: ink,
          ['--cs-bg' as string]: bg,
          ['--cs-accent' as string]: accent,
        }}
      >
        {/* Close button — top right, fixed */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="fixed top-[clamp(16px,3vw,32px)] right-[clamp(16px,3vw,32px)] z-[60] w-11 h-11 flex items-center justify-center border border-current/30 hover:border-current transition-colors font-mono text-[18px]"
          style={{ borderColor: 'currentColor', color: 'currentColor' }}
        >
          <span aria-hidden="true">×</span>
        </button>

        {!unlocked && (
          <PasswordGate entry={entry} onUnlock={() => setUnlocked(true)} />
        )}

        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            ref={containerRef}
            className="absolute inset-0 overflow-x-auto overflow-y-hidden"
            style={{ scrollbarWidth: 'thin' }}
          >
            <CaseStudyContent entry={entry} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
