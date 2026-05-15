/**
 * Hero entry point. Renders a lightweight static <img> hero on mobile / reduced
 * motion / first paint, and lazy-loads the canvas-based scroll sequence only
 * on desktops that benefit from it. Keeps the initial JS bundle small.
 */
import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { HeroShell, VIGNETTE, frameUrl } from './HeroScrollSequenceShared';

const HeroDesktopSequence = lazy(() => import('./HeroDesktopSequence'));

function StaticHeroFrame({
  ariaLabel,
  vignetteStyle,
  fetchpriority = 'high',
}: {
  ariaLabel: string;
  vignetteStyle?: CSSProperties;
  fetchpriority?: 'high' | 'low' | 'auto';
}) {
  return (
    <section className="relative shrink-0 overflow-hidden" style={{ height: '100dvh' }} aria-label={ariaLabel}>
      <HeroShell
        canvas={
          <img
            src={frameUrl(0)}
            alt=""
            width={1920}
            height={1080}
            decoding="async"
            fetchPriority={fetchpriority}
            className="absolute inset-0 h-full w-full object-cover"
            style={vignetteStyle}
            aria-hidden
          />
        }
      />
    </section>
  );
}

export function HeroScrollSequence() {
  const { lang } = useLanguage();
  const ariaLabel = lang === 'cs' ? 'Úvod' : 'Hero';

  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 768,
  );
  const [coarsePointer, setCoarsePointer] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false,
  );
  /** Viněta jen na „myšové" desktopu; tablet / dotyk / iPad bez ohledu na připojenou myš */
  const [heroCanvasVignette, setHeroCanvasVignette] = useState(() =>
    typeof window !== 'undefined'
      ? !window.matchMedia('(min-width: 768px) and ((hover: none) or (pointer: coarse))').matches
      : true,
  );
  const prefersReducedMotion = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const onChange = () => setCoarsePointer(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and ((hover: none) or (pointer: coarse))');
    const onChange = () => setHeroCanvasVignette(!mq.matches);
    mq.addEventListener('change', onChange);
    onChange();
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (isMobile) {
    return <StaticHeroFrame ariaLabel={ariaLabel} />;
  }

  if (prefersReducedMotion) {
    const vignetteStyle: CSSProperties = heroCanvasVignette
      ? { WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE }
      : {};
    return <StaticHeroFrame ariaLabel={ariaLabel} vignetteStyle={vignetteStyle} />;
  }

  return (
    <Suspense fallback={<StaticHeroFrame ariaLabel={ariaLabel} />}>
      <HeroDesktopSequence coarsePointer={coarsePointer} useVignette={heroCanvasVignette} />
    </Suspense>
  );
}
