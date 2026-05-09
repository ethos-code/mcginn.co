'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-full w-full" />,
});

const SCENE_URL = 'https://prod.spline.design/ACP80S192fjY66ON/scene.splinecode';

interface FountainArtworkProps {
  /** When true, allow user input (used inside the case study modal). */
  interactive?: boolean;
  /** When true, scale up + bleed slightly outside the column (used on the section card). */
  bleed?: boolean;
  /**
   * When set, render an invisible overlay button on top of the pen that opens
   * the case study on click. Match thefountain.ai's pattern: Spline is visible
   * and animating but not directly interactive.
   */
  onOpen?: () => void;
}

export function FountainArtwork({
  interactive = false,
  bleed = false,
  onOpen,
}: FountainArtworkProps) {
  return (
    <figure className="relative w-full overflow-visible">
      <div
        className={
          bleed
            ? // Mobile: contained within the column. Desktop+: scale up and
              // bleed past the right column edge for the floating-pen effect.
              'relative w-full h-[48vh] md:w-[124%] md:h-[78vh] md:-mr-[24%] md:-my-[6vh]'
            : 'relative w-full h-[58vh] md:h-[70vh]'
        }
      >
        {/*
          The Spline scene continues to auto-animate but never receives
          pointer/wheel events — clicks land on the overlay button below,
          and wheel events bubble up to the page so vertical scroll works.
        */}
        <div
          className="absolute inset-0"
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        >
          <Suspense fallback={null}>
            <Spline scene={SCENE_URL} />
          </Suspense>
        </div>

        {onOpen && !interactive && (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open Fountain in 3D"
            className="absolute inset-0 z-10 cursor-pointer bg-transparent border-0 outline-offset-8"
          />
        )}
      </div>
      <figcaption className="sr-only">
        Fountain — a concept by John McGinn for ambient AI hardware.
      </figcaption>
    </figure>
  );
}
