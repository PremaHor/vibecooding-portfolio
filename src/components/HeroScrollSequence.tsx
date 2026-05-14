import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useGoToContactForm } from '../hooks/useGoToContactForm';
import { HeroAccentTypewriter } from './HeroAccentTypewriter';

const FRAME_COUNT = 60;
/** Total section height in vh — scroll distance = (SECTION_VH - 100)vh */
const SECTION_VH = 300;

function frameUrl(i: number): string {
  return `/hero-frames/frame_${String(i + 1).padStart(3, '0')}.webp`;
}

export function HeroScrollSequence() {
  const { t, lang } = useLanguage();
  const goToContactForm = useGoToContactForm();

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const leadText = useMemo(
    () => lang === 'cs' ? fixCzechTypography(t.hero.subheadlineLead) : fixDashes(t.hero.subheadlineLead),
    [lang, t.hero.subheadlineLead],
  );

  // --- Draw a single frame onto the canvas (cover-fit, HiDPI-aware) ---
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;
    if (currentFrameRef.current === index) return;
    currentFrameRef.current = index;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cover-fit using physical canvas pixels (DPR-scaled)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // --- Resize canvas to viewport (DPR-aware for Retina/HiDPI) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const f = currentFrameRef.current;
      if (f >= 0) {
        currentFrameRef.current = -1;
        drawFrame(f);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  // --- Preload all frames ---
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      images[i] = img;
      const idx = i;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (idx === 0) drawFrame(0);
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };

      // Stagger loading: first frame immediately, rest deferred
      if (i === 0) {
        img.src = frameUrl(i);
      } else {
        requestIdleCallback
          ? requestIdleCallback(() => { img.src = frameUrl(idx); })
          : setTimeout(() => { img.src = frameUrl(idx); }, i * 8);
      }
    }
  }, [drawFrame]);

  // --- Scroll → frame index ---
  useEffect(() => {
    if (prefersReducedMotion) {
      drawFrame(0);
      return;
    }

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollDistance = sectionHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollDistance));
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${SECTION_VH}vh` }}
      className="relative"
      aria-label={lang === 'cs' ? 'Úvod' : 'Hero'}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Canvas — scroll-driven frames, fades out at edges via mask */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            willChange: 'contents',
            WebkitMaskImage:
              'radial-gradient(ellipse 72% 80% at 50% 52%, black 20%, transparent 78%)',
            maskImage:
              'radial-gradient(ellipse 72% 80% at 50% 52%, black 20%, transparent 78%)',
          }}
          aria-hidden
        />

        {/* Subtle bottom gradient for text legibility */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(to top, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.1) 35%, transparent 65%)',
          }}
        />

        {/* Hero text */}
        <div className="absolute inset-0 z-[2] flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-nav-safe pb-16 sm:pb-20 md:pb-24">
          <div className="hero-content max-w-4xl mx-auto w-full text-center">
            <h1 className="font-display text-[clamp(1.65rem,4.2vw,2.75rem)] sm:text-[clamp(1.85rem,4.5vw,3.25rem)] md:text-[clamp(2rem,4.8vw,3.75rem)] font-bold leading-[1.15] mb-6 sm:mb-8 text-balance">
              <span className="hero-h1-tagline block bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-transparent hero-anim hero-anim-d1">
                {lang === 'cs' ? fixCzechTypography(t.hero.h1) : fixDashes(t.hero.h1)}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-normal text-gray-300 max-w-2xl mx-auto leading-relaxed text-center hero-anim hero-anim-d2 text-balance min-h-[4.5rem] sm:min-h-[5rem] mb-10 sm:mb-12">
              <HeroAccentTypewriter
                text={leadText}
                startDelayMs={900}
                charIntervalMs={48}
                caretClassName="bg-gray-300"
              />
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-1 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
            {lang === 'cs' ? 'Scrolluj' : 'Scroll'}
          </span>
          <ChevronDown className="w-4 h-4 text-white/70 animate-bounce" />
        </div>

        {/* Loading overlay — disappears once first frame is ready */}
        {!loaded && loadProgress === 0 && (
          <div className="absolute inset-0 z-[20] bg-[var(--color-vibe-black)]" />
        )}

        {/* Loading progress bar (thin, top) */}
        {!loaded && loadProgress > 0 && (
          <div className="absolute top-0 left-0 right-0 z-[20] h-0.5 bg-white/10">
            <div
              className="h-full bg-[var(--color-vibe-orange)] transition-all duration-150"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
