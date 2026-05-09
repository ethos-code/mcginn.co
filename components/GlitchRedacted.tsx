'use client';

import { useEffect, useState } from 'react';

const BLOCKS = '█▓▒░';

interface GlitchRedactedProps {
  /** Stable seed (e.g. slug) so SSR and CSR match on first render. */
  seed: string;
  lines?: number;
  className?: string;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Cell {
  char: string;
  opacity: number;
}

interface Line {
  /** Word lengths and inter-word gap counts; deterministic per seed/line. */
  pattern: number[]; // alternating: word, gap, word, gap, ... (gaps in space-count)
  cells: Cell[];
}

/** Build the structural pattern (word lengths + gap widths) once from seed. */
function buildLineLayouts(seed: string, lines: number): number[][] {
  const layouts: number[][] = [];
  for (let i = 0; i < lines; i++) {
    const r = mulberry32(hashSeed(`${seed}-${i}`));
    const pattern: number[] = [];
    const wordCount = 4 + Math.floor(r() * 4); // 4–7 words
    for (let w = 0; w < wordCount; w++) {
      pattern.push(2 + Math.floor(r() * 6)); // word: 2–7 blocks
      if (w < wordCount - 1) {
        pattern.push(1 + Math.floor(r() * 3)); // gap: 1–3 spaces
      }
    }
    layouts.push(pattern);
  }
  return layouts;
}

function fillCells(pattern: number[], rng: () => number): Cell[] {
  const cells: Cell[] = [];
  for (let p = 0; p < pattern.length; p++) {
    const len = pattern[p];
    const isWord = p % 2 === 0;
    for (let i = 0; i < len; i++) {
      if (isWord) {
        cells.push({
          char: BLOCKS[Math.floor(rng() * BLOCKS.length)],
          opacity: 0.32 + rng() * 0.42, // 0.32–0.74
        });
      } else {
        cells.push({ char: ' ', opacity: 1 });
      }
    }
  }
  return cells;
}

export function GlitchRedacted({
  seed,
  lines = 3,
  className = '',
}: GlitchRedactedProps) {
  const layouts = buildLineLayouts(seed, lines);

  // Deterministic initial state for SSR consistency.
  const initial: Line[] = layouts.map((pattern, i) => {
    const r = mulberry32(hashSeed(`${seed}-${i}-init`));
    return { pattern, cells: fillCells(pattern, r) };
  });

  const [state, setState] = useState<Line[]>(initial);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      setState((prev) =>
        prev.map((line) => ({
          pattern: line.pattern,
          cells: fillCells(line.pattern, Math.random),
        }))
      );
      // Jittery interval for an organic, non-mechanical feel.
      timeout = setTimeout(tick, 240 + Math.random() * 220);
    };

    timeout = setTimeout(tick, 320);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Description redacted — work available under mutual NDA."
      className={`flex flex-col gap-3 font-mono text-[15px] md:text-[17px] leading-[1.4] tracking-[0.04em] ${className}`}
    >
      {state.map((line, i) => (
        <div key={i} aria-hidden="true" className="whitespace-pre">
          {line.cells.map((cell, j) => (
            <span
              key={j}
              style={{
                opacity: cell.opacity,
                transition: 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                color: 'currentColor',
              }}
            >
              {cell.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
