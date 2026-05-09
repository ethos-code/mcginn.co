'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme, DEFAULT_THEME } from './ThemeProvider';

const BLOCK_CHARS = '█▓▒░';
const FRAME_INTERVAL_MS = 32;
const SETTLE_BASE_MS = 90;
const SETTLE_STAGGER_MS = 26;
const INTRO_HOLD_MS = 8000;
const THESIS = DEFAULT_THEME.statement;

interface CharCell {
  char: string;
  settled: boolean;
}

function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function pickGlitchChar() {
  return BLOCK_CHARS[Math.floor(Math.random() * BLOCK_CHARS.length)];
}

export function Statement() {
  const { active } = useTheme();
  const [introActive, setIntroActive] = useState(true);
  const [cells, setCells] = useState<CharCell[]>([]);
  const cellsRef = useRef<CharCell[]>([]);

  // Hold the thesis statement for INTRO_HOLD_MS, then sync with active.statement.
  useEffect(() => {
    const t = setTimeout(() => setIntroActive(false), INTRO_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  const target = introActive ? THESIS : active.statement;

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    if (reducedMotion()) {
      const settled: CharCell[] = target.split('').map((c) => ({ char: c, settled: true }));
      cellsRef.current = settled;
      setCells(settled);
      return;
    }

    const start = performance.now();
    const oldCells = cellsRef.current;
    const oldText = oldCells.map((c) => c.char).join('');
    const len = Math.max(target.length, oldText.length);
    let lastFrame = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      if (now - lastFrame < FRAME_INTERVAL_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;

      const elapsed = now - start;
      const next: CharCell[] = [];
      let allSettled = true;

      for (let i = 0; i < len; i++) {
        const settleAt = SETTLE_BASE_MS + i * SETTLE_STAGGER_MS;
        const targetChar = i < target.length ? target[i] : '';

        // Preserve target spaces; they read better than glitched whitespace.
        if (targetChar === ' ') {
          next.push({ char: ' ', settled: true });
          continue;
        }

        if (elapsed >= settleAt) {
          if (targetChar) next.push({ char: targetChar, settled: true });
          // else: position past target.length once settled — drop it.
        } else {
          allSettled = false;
          next.push({ char: pickGlitchChar(), settled: false });
        }
      }

      cellsRef.current = next;
      setCells(next);

      if (!allSettled) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <aside
      aria-live="polite"
      aria-label="Working statement"
      className="pointer-events-none hidden md:block fixed top-[clamp(20px,3.5vw,40px)] right-[clamp(20px,4vw,48px)] z-30"
    >
      <p
        className="font-mono text-right text-[11px] md:text-[12px] leading-[1.4] tracking-[-0.005em] m-0 whitespace-nowrap"
        style={{ color: 'var(--theme-ink)' }}
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            style={{
              opacity: cell.settled ? 1 : 0.45,
              transition: 'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {cell.char}
          </span>
        ))}
        <span
          aria-hidden="true"
          className="inline-block align-text-bottom ml-[1px] w-[0.5ch] animate-[blink_900ms_steps(1)_infinite]"
          style={{ height: '1em', backgroundColor: 'var(--theme-ink)' }}
        />
      </p>
    </aside>
  );
}
