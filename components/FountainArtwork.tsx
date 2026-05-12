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
  /**
   * External destination for taps on the pen. Renders an invisible
   * overlay anchor (opens in a new tab). Matches the text CTA target.
   */
  href?: string;
  /**
   * Fallback to an invisible overlay button that fires onOpen when the
   * entry doesn't have an external href.
   */
  onOpen?: () => void;
}

export function FountainArtwork({
  interactive = false,
  href,
  onOpen,
}: FountainArtworkProps) {
  return (
    <figure className="relative w-full h-full overflow-visible m-0">
      <div
        className="absolute inset-0"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <Suspense fallback={null}>
          <Spline scene={SCENE_URL} />
        </Suspense>
      </div>

      {!interactive && href && (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          aria-label="Visit thefountain.ai"
          className="absolute inset-0 z-10 cursor-pointer bg-transparent outline-offset-8"
        />
      )}
      {!interactive && !href && onOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open Fountain in 3D"
          className="absolute inset-0 z-10 cursor-pointer bg-transparent border-0 outline-offset-8"
        />
      )}
      <figcaption className="sr-only">
        Fountain — a concept by John McGinn for ambient AI hardware.
      </figcaption>
    </figure>
  );
}
