import { useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useGoToContactForm } from '../hooks/useGoToContactForm';
import { HeroAccentTypewriter } from './HeroAccentTypewriter';

const FRAME_COUNT = 60;
/** Coarse-pointer devices: sticky height; usable scroll span = FALLBACK − 100vh */
const SECTION_VH_FALLBACK = 520;
/** Kumulativní síla kolečka (deltaY px) dokud poběží pouze měnění framů bez posunu stránky */
const WHEEL_DELTA_FOR_FULL_SEQUENCE = 5400;

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

function paintFrame(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !img.complete || !img.naturalWidth) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const { width: cw, height: ch } = canvas;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
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

/** Předběžné načtení framů, canvas resize, drawFrame */
function useHeroSequenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexShown = useRef<number>(-1);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;
    if (frameIndexShown.current === index) return;
    frameIndexShown.current = index;
    paintFrame(canvas, img);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sizeCanvas(canvas);
    const f = frameIndexShown.current;
    if (f >= 0) {
      frameIndexShown.current = -1;
      drawFrame(f);
    }
  }, [drawFrame]);

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
        if (idx === 0) drawFrame(0);
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
  }, [drawFrame]);

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

  return { canvasRef, drawFrame, loadingLayers };
}

// ─── Desktop: kolečko (fine pointer) — dokument se nehybne dokud nedoběhne sekce framů ─

function HeroDesktopWheelLock({ wheelHint }: { wheelHint: string }) {
  const { canvasRef, drawFrame, loadingLayers } = useHeroSequenceCanvas();
  const accumRef = useRef(0);
  const drawRef = useRef(drawFrame);
  drawRef.current = drawFrame;

  const [sequenceDone, setSequenceDone] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!sequenceDone) return;
    accumRef.current = WHEEL_DELTA_FOR_FULL_SEQUENCE;
    drawFrame(FRAME_COUNT - 1);
  }, [sequenceDone, drawFrame]);

  useEffect(() => {
    if (sequenceDone) return undefined;

    const full = WHEEL_DELTA_FOR_FULL_SEQUENCE;

    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > 64) return;
      if (!e.deltaY) return;

      e.preventDefault();
      e.stopPropagation();

      accumRef.current = Math.min(full, Math.max(0, accumRef.current + e.deltaY));
      const p = accumRef.current / full;
      const idx = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT));
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawRef.current(idx));

      if (accumRef.current >= full - 1e-6) {
        accumRef.current = full;
        setSequenceDone(true);
      }
    };

    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      cancelAnimationFrame(rafRef.current);
    };
  }, [sequenceDone]);

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
  const { canvasRef, drawFrame, loadingLayers } = useHeroSequenceCanvas();

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / scrollDistance));
      const idx = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(idx));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

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
