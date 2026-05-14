import { useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useGoToContactForm } from '../hooks/useGoToContactForm';
import { HeroAccentTypewriter } from './HeroAccentTypewriter';

const FRAME_COUNT = 60;
/** Coarse-pointer devices: sticky height; usable scroll span = FALLBACK − 100vh */
const SECTION_VH_FALLBACK = 520;
/** Kumulativní síla kolečka (+ dolů − nahoru): celá virtuální dráha mezi frame 0 a posledním */
const WHEEL_DELTA_FOR_FULL_SEQUENCE = 5400;
/** Impulz z wheel deltaY (stejné jednotky jako dráha výše) */
const WHEEL_IMPULSE_SCALE = 1.05;
/** Tření na snímek (čím blíž 1, tím déle „dojíždí“) */
const WHEEL_FRICTION = 0.885;
/** Pod touto rychlostí animaci zastavíme */
const WHEEL_VELOCITY_EPS = 0.14;
/** Nad touto hodnotou scrollY už nekrotíme kolečko (uživatel jde po stránce) */
const HERO_WHEEL_SCROLL_Y_LEAVE = 88;

const VIGNETTE =
  'radial-gradient(ellipse 62% 68% at 50% 50%, black 0%, black 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 70%, transparent 88%)';

function frameUrl(i: number): string {
  return `/hero-frames/frame_${String(i + 1).padStart(3, '0')}.webp`;
}

function sizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

function paintCoverImage(ctx: CanvasRenderingContext2D, cw: number, ch: number, img: HTMLImageElement) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
}

function paintFrame(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !img.complete || !img.naturalWidth) return;
  const { width: cw, height: ch } = canvas;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, cw, ch);
  paintCoverImage(ctx, cw, ch, img);
}

/** Crossfade dvou sousedních framů podle dílčí pozice na ose od 0 … FRAME_COUNT − 1. */
function paintBlendedTimeline(
  canvas: HTMLCanvasElement,
  images: Array<HTMLImageElement | undefined>,
  timelinePosition: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const maxIdx = FRAME_COUNT - 1;
  const clampedPos = Number.isFinite(timelinePosition)
    ? Math.max(0, Math.min(maxIdx, timelinePosition))
    : 0;

  const i0 = Math.floor(clampedPos);
  const i1 = Math.min(maxIdx, i0 + 1);
  const fade = clampedPos - i0;

  const img0 = images[i0];
  const img1 = images[i1];
  const { width: cw, height: ch } = canvas;
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, cw, ch);

  if (!img0?.complete || img0.naturalWidth === 0) {
    return;
  }

  paintCoverImage(ctx, cw, ch, img0);

  if (fade > 0.001 && i1 > i0 && img1?.complete && img1.naturalWidth > 0) {
    ctx.globalAlpha = fade;
    paintCoverImage(ctx, cw, ch, img1);
    ctx.globalAlpha = 1;
  }
}

type HeroShellProps = {
  scrollHint?: string | null;
  canvas: ReactNode;
  overlays?: ReactNode;
};

function HeroShell({ scrollHint, canvas, overlays }: HeroShellProps) {
  const { t, lang } = useLanguage();
  const goToContactForm = useGoToContactForm();
  const leadText = useMemo(
    () => (lang === 'cs' ? fixCzechTypography(t.hero.subheadlineLead) : fixDashes(t.hero.subheadlineLead)),
    [lang, t.hero.subheadlineLead],
  );

  const hintTranslated =
    scrollHint && (lang === 'cs' ? fixCzechTypography(scrollHint) : fixDashes(scrollHint));

  return (
    <>
      {canvas}

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.2) 30%, transparent 50%)',
        }}
      />

      <div className="absolute inset-0 z-[2] flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-nav-safe pb-16 sm:pb-20 md:pb-24">
        <div className="hero-content max-w-4xl mx-auto w-full text-center">
          <h1 className="font-display text-[clamp(1.65rem,4.2vw,2.75rem)] sm:text-[clamp(1.85rem,4.5vw,3.25rem)] md:text-[clamp(2rem,4.8vw,3.75rem)] font-bold leading-[1.15] mb-6 sm:mb-8 text-balance">
            <span className="hero-h1-tagline block bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-transparent hero-anim hero-anim-d1">
              {lang === 'cs' ? fixCzechTypography(t.hero.h1) : fixDashes(t.hero.h1)}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-normal text-gray-300 max-w-2xl mx-auto leading-relaxed text-center hero-anim hero-anim-d2 text-balance min-h-[4.5rem] sm:min-h-[5rem] mb-10 sm:mb-12">
            <HeroAccentTypewriter text={leadText} startDelayMs={900} charIntervalMs={48} caretClassName="bg-gray-300" />
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 hero-anim hero-anim-d2">
            <button
              type="button"
              onClick={goToContactForm}
              className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 hover:shadow-[0_0_30px_rgba(242,125,38,0.4)] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-300 shadow-lg cursor-pointer"
            >
              {lang === 'cs' ? fixCzechTypography(t.hero.ctaPrimary) : fixDashes(t.hero.ctaPrimary)}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold border-2 border-white/25 text-white/90 hover:bg-white/5 hover:border-white/40 transition-[background-color,border-color] duration-300"
            >
              {lang === 'cs' ? fixCzechTypography(t.hero.ctaSecondary) : fixDashes(t.hero.ctaSecondary)}
            </a>
          </div>
        </div>
      </div>

      {overlays ?? null}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex max-w-[20rem] flex-col items-center gap-2 px-4 text-center opacity-65 pointer-events-none">
        {hintTranslated ? (
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/75 leading-snug">
            {hintTranslated}
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{lang === 'cs' ? 'Scrolluj' : 'Scroll'}</span>
        )}
        <ChevronDown className="w-4 h-4 shrink-0 text-white/70 animate-bounce" />
      </div>
    </>
  );
}

// ─── Mobile (static frame) ───────────────────────────────────────────────

function HeroMobile() {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      sizeCanvas(canvas);
      paintFrame(canvas, img);
    };
    img.src = frameUrl(0);

    const resize = () => {
      sizeCanvas(canvas);
      if (img.complete && img.naturalWidth) paintFrame(canvas, img);
    };
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  const ariaLabel = lang === 'cs' ? 'Úvod' : 'Hero';

  return (
    <section className="relative h-screen overflow-hidden" aria-label={ariaLabel}>
      <HeroShell
        canvas={
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE, willChange: 'contents' }}
            aria-hidden
          />
        }
      />
    </section>
  );
}

// ─── Reduced-motion desktop ────────────────────────────────────────────────

function HeroDesktopReducedMotion() {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      sizeCanvas(canvas);
      paintFrame(canvas, img);
    };
    img.src = frameUrl(0);

    const resize = () => {
      sizeCanvas(canvas);
      if (img.complete && img.naturalWidth) paintFrame(canvas, img);
    };
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  const ariaLabel = lang === 'cs' ? 'Úvod' : 'Hero';

  return (
    <section className="relative max-h-none min-h-screen shrink-0 overflow-hidden" aria-label={ariaLabel}>
      <HeroShell
        canvas={
          <canvas
            ref={canvasRef}
            className="absolute inset-0 min-h-[100dvh]"
            style={{ WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE, willChange: 'contents' }}
            aria-hidden
          />
        }
      />
    </section>
  );
}

/** Předběžné načtení framů + vykreslení s plynulým crossfade mezi sousedními snímky */
function useHeroSequenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const lastTimelineRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawTimeline = useCallback((timelinePosition: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    lastTimelineRef.current = timelinePosition;
    paintBlendedTimeline(canvas, imagesRef.current, timelinePosition);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sizeCanvas(canvas);
    paintBlendedTimeline(canvas, imagesRef.current, lastTimelineRef.current);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;
    let count = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      images[i] = img;
      const idx = i;
      img.onload = () => {
        count++;
        setLoadProgress(count / FRAME_COUNT);
        drawTimeline(lastTimelineRef.current);
        if (count === FRAME_COUNT) setLoaded(true);
      };
      img.onerror = () => {
        count++;
        if (count === FRAME_COUNT) setLoaded(true);
      };

      if (i === 0) {
        img.src = frameUrl(i);
      } else {
        const load = () => {
          img.src = frameUrl(idx);
        };
        if ('requestIdleCallback' in window) {
          (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(load);
        } else {
          window.setTimeout(load, idx * 8);
        }
      }
    }
  }, [drawTimeline]);

  const loadingLayers = (
    <>
      {!loaded && loadProgress === 0 ? <div className="absolute inset-0 z-[30] bg-[var(--color-vibe-black)]" /> : null}
      {!loaded && loadProgress > 0 ? (
        <div className="absolute top-0 left-0 right-0 z-[30] h-0.5 bg-white/10">
          <div
            className="h-full bg-[var(--color-vibe-orange)] transition-all duration-150"
            style={{ width: `${loadProgress * 100}%` }}
          />
        </div>
      ) : null}
    </>
  );

  return { canvasRef, drawTimeline, loadingLayers };
}

// ─── Desktop: kolečko (fine pointer) — dokument se nehybne dokud nedoběhne sekce framů ─

function HeroDesktopWheelLock({ wheelHint }: { wheelHint: string }) {
  const { canvasRef, drawTimeline, loadingLayers } = useHeroSequenceCanvas();
  const posRef = useRef(0);
  const velRef = useRef(0);
  const rafLoopRef = useRef(0);
  const tickingRef = useRef(false);
  const drawTimelineRef = useRef(drawTimeline);
  drawTimelineRef.current = drawTimeline;

  const maxIdx = FRAME_COUNT - 1;

  useEffect(() => {
    const full = WHEEL_DELTA_FOR_FULL_SEQUENCE;
    const FULL_EPS = 1e-3;

    const stopLoop = () => {
      if (rafLoopRef.current) {
        cancelAnimationFrame(rafLoopRef.current);
        rafLoopRef.current = 0;
      }
      tickingRef.current = false;
    };

    const tick = () => {
      let p = posRef.current;
      let v = velRef.current;

      p += v;
      p = Math.max(0, Math.min(full, p));
      if (p <= 0) v = Math.max(0, v);
      if (p >= full) v = Math.min(0, v);

      v *= WHEEL_FRICTION;
      if (Math.abs(v) < WHEEL_VELOCITY_EPS) v = 0;

      posRef.current = p;
      velRef.current = v;

      drawTimelineRef.current((p / full) * maxIdx);

      if (v !== 0) {
        rafLoopRef.current = requestAnimationFrame(tick);
      } else {
        tickingRef.current = false;
        rafLoopRef.current = 0;
      }
    };

    const ensureLoop = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafLoopRef.current = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > HERO_WHEEL_SCROLL_Y_LEAVE) return;
      if (!e.deltaY) return;

      const p = posRef.current;
      const scrollingDown = e.deltaY > 0;
      const wasAtEnd = p >= full - FULL_EPS;

      if (wasAtEnd && scrollingDown && Math.abs(velRef.current) < 0.25) {
        posRef.current = full;
        velRef.current = 0;
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= 120;

      velRef.current += dy * WHEEL_IMPULSE_SCALE;
      ensureLoop();
    };

    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    drawTimelineRef.current(0);

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      stopLoop();
    };
  }, []);

  return (
    <section className="relative shrink-0" aria-label="Hero">
      <div className="relative h-[min(100dvh,100svh,100vh)] min-h-[100vh] overflow-hidden">
        <HeroShell
          scrollHint={wheelHint}
          overlays={loadingLayers}
          canvas={
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE, willChange: 'contents' }}
              aria-hidden
            />
          }
        />
      </div>
    </section>
  );
}

// ─── Desktop coarse pointer: sticky sekce (dotykové tablety…) ─────────────────

function HeroDesktopScrollLinked({ scrollHint }: { scrollHint: string | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { canvasRef, drawTimeline, loadingLayers } = useHeroSequenceCanvas();

  const rafRef = useRef<number>(0);
  const maxIdx = FRAME_COUNT - 1;

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress01 = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / scrollDistance));
      const tl = progress01 * maxIdx;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawTimeline(tl));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawTimeline]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${SECTION_VH_FALLBACK}vh` }}
      className="relative"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-[min(100dvh,100svh,100vh)] min-h-screen overflow-hidden">
        <HeroShell
          scrollHint={scrollHint}
          overlays={loadingLayers}
          canvas={
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{ WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE, willChange: 'contents' }}
              aria-hidden
            />
          }
        />
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────

export function HeroScrollSequence() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [coarsePointer, setCoarsePointer] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false,
  );
  const prefersReducedMotion = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    [],
  );

  const { t } = useLanguage();

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

  if (isMobile) {
    return <HeroMobile />;
  }

  if (prefersReducedMotion) {
    return <HeroDesktopReducedMotion />;
  }

  const wheelHint = t.hero.wheelScrollHint ?? '';

  return coarsePointer ? <HeroDesktopScrollLinked scrollHint={null} /> : <HeroDesktopWheelLock wheelHint={wheelHint} />;
}
