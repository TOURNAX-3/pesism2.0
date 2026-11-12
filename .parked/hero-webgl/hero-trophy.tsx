'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const HeroTrophyScene = dynamic(() => import('./hero-trophy-scene').then(m => m.HeroTrophyScene), { ssr: false });

/**
 * Flat trophy.png renders first (and stays the only thing shown with JS off or
 * prefers-reduced-motion set) — the WebGL scene progressively enhances it once
 * mounted, replacing it with a scroll-orbiting 3D version of the same image.
 */
export function HeroTrophy() {
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setCanvasReady(true);
  }, []);

  return (
    <div className="hero__trophy">
      <Image
        src="/hero/trophy.png"
        alt=""
        width={914}
        height={1583}
        priority
        sizes="(min-width: 1020px) 300px, 70vw"
        className={canvasReady ? 'hero__trophy-fallback is-hidden' : 'hero__trophy-fallback'}
      />
      {canvasReady && <HeroTrophyScene />}
    </div>
  );
}
