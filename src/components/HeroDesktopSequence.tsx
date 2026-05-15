/**
 * Desktop hero with 60-frame WebP scroll sequence painted on canvas.
 * Imported only on fine-pointer desktop from HeroScrollSequence.
 */
import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { HeroShell, VIGNETTE, frameUrl, FRAME_COUNT, LAST_FRAME_INDEX } from './HeroScrollSequenceShared';

const HERO_SEQUENCE_STAGES = [
  { frameStart: 0, frameEnd: 18, scrollWeight: 0.32 },
  { frameStart: 18, frameEnd: 40, scrollWeight: 0.36 },
  { frameStart: 40, frameEnd: LAST_FRAME_INDEX, scrollWeight: 0.32 },
] as const;
const SECTION_VH_FALLBACK = 520;
const WHEEL_DELTA_FOR_FULL_SEQUENCE = 5400;
const WHEEL_IMPULSE_SCALE = 1.05;
const WHEEL_FRICTION = 0.885;
const WHEEL_VELOCITY_EPS = 0.14;
const HERO_WHEEL_SCROLL_Y_LEAVE = 88;
const HERO_CANVAS_MAX_DPR = 2;

function canvasStyleWithOptionalVignette(useVignette: boolean): CSSProperties {
  return {
    willChange: 'contents',
    ...(useVignette ? { WebkitMaskImage: VIGNETTE, maskImage: VIGNETTE } : {}),
  };
}

function easeStage(t: number) {
  return t * t * (3 - 2 * t);
}

function progressToHeroTimeline(progress01: number) {
  const progress = Number.isFinite(progress01) ? Math.max(0, Math.min(1, progress01)) : 0;
  let cursor = 0;
  for (const stage of HERO_SEQUENCE_STAGES) {
    const stageEnd = cursor + stage.scrollWeight;
    if (progress <= stageEnd) {
      const local = Math.max(0, Math.min(1, (progress - cursor) / stage.scrollWeight));
      return stage.frameStart + easeStage(local) * (stage.frameEnd - stage.frameStart);
    }
    cursor = stageEnd;
  }
  return LAST_FRAME_INDEX;
}

function sizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, HERO_CANVAS_MAX_DPR);
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
}

function paintCoverImage(ctx: CanvasRenderingContext2D, cw: number, ch: number, img: HTMLImageElement) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
}

function paintBlendedTimeline(
  canvas: HTMLCanvasElement,
  images: Array<HTMLImageElement | undefined>,
  timelinePosition: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const maxIdx = LAST_FRAME_INDEX;
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
  if (!img0?.complete || img0.naturalWidth === 0) return;
  paintCoverImage(ctx, cw, ch, img0);
  if (fade > 0.001 && i1 > i0 && img1?.complete && img1.naturalWidth > 0) {
    ctx.globalAlpha = fade;
    paintCoverImage(ctx, cw, ch, img1);
    ctx.globalAlpha = 1;
  }
}

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
    if (canvas.clientWidth === 0) {
      requestAnimationFrame(() => {
        if (!canvasRef.current) return;
        sizeCanvas(canvasRef.current);
        paintBlendedTimeline(canvasRef.current, imagesRef.current, lastTimelineRef.current);
      });
      return;
    }
    sizeCanvas(canvas);
    paintBlendedTimeline(canvas, imagesRef.current, lastTimelineRef.current);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;
    let count = 0;

    const bump = () => {
      if (cancelled) return;
      count++;
      setLoadProgress(count / FRAME_COUNT);
      drawTimeline(lastTimelineRef.current);
      if (count === FRAME_COUNT) setLoaded(true);
    };

    const ricCompat = (cb: IdleRequestCallback, opts?: IdleRequestOptions): number => {
      const ric = window.requestIdleCallback;
      if (ric) return ric(cb, opts);
      return window.setTimeout(
        () => cb({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline),
        opts?.timeout ?? 1,
      ) as unknown as number;
    };

    for (let i = 0; i < FRAME_COUNT; i++) images[i] = new Image();

    let firstDone = false;
    const onFirstFrame = () => {
      if (cancelled || firstDone) return;
      firstDone = true;
      bump();
      ricCompat(() => !cancelled && loadNext(1), { timeout: 6000 });
    };

    const loadNext = (idx: number) => {
      if (cancelled || idx >= FRAME_COUNT) return;
      const img = images[idx];
      let settled = false;
      const advance = () => {
        if (cancelled || settled) return;
        settled = true;
        bump();
        ricCompat(() => !cancelled && loadNext(idx + 1), { timeout: 6000 });
      };
      img.onload = advance;
      img.onerror = advance;
      img.src = frameUrl(idx);
      if (img.complete && img.naturalWidth) advance();
    };

    const img0 = images[0];
    img0.onload = onFirstFrame;
    img0.onerror = onFirstFrame;
    img0.src = frameUrl(0);
    if (img0.complete && img0.naturalWidth) onFirstFrame();

    return () => {
      cancelled = true;
    };
  }, [drawTimeline]);

  const loadingLayers: ReactNode = (
    <>
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

function HeroPosterUnderCanvas({
  canvasRef,
  canvasStyle,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvasStyle: CSSProperties;
}) {
  return (
    <>
      <img
        src={frameUrl(0)}
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={canvasStyle} aria-hidden />
    </>
  );
}

function HeroDesktopWheelLock({ wheelHint, useVignette }: { wheelHint: string; useVignette: boolean }) {
  const { canvasRef, drawTimeline, loadingLayers } = useHeroSequenceCanvas();
  const posRef = useRef(0);
  const velRef = useRef(0);
  const rafLoopRef = useRef(0);
  const tickingRef = useRef(false);
  const drawTimelineRef = useRef(drawTimeline);
  drawTimelineRef.current = drawTimeline;

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
      drawTimelineRef.current(progressToHeroTimeline(p / full));
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
      <div className="relative overflow-hidden" style={{ height: '100dvh' }}>
        <HeroShell
          scrollHint={wheelHint}
          overlays={loadingLayers}
          canvas={
            <HeroPosterUnderCanvas
              canvasRef={canvasRef}
              canvasStyle={canvasStyleWithOptionalVignette(useVignette)}
            />
          }
        />
      </div>
    </section>
  );
}

function HeroDesktopScrollLinked({ scrollHint, useVignette }: { scrollHint: string | null; useVignette: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { canvasRef, drawTimeline, loadingLayers } = useHeroSequenceCanvas();

  const rafRef = useRef<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const stickyH = stickyRef.current?.offsetHeight ?? window.visualViewport?.height ?? window.innerHeight;
      const scrollDistance = Math.max(1, rect.height - stickyH);
      const progress01 = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      const tl = progressToHeroTimeline(progress01);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawTimeline(tl));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.visualViewport?.addEventListener('resize', handleScroll, { passive: true });
    window.visualViewport?.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.visualViewport?.removeEventListener('resize', handleScroll);
      window.visualViewport?.removeEventListener('scroll', handleScroll);
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
      <div
        ref={stickyRef}
        className="sticky top-0 overflow-hidden"
        style={{ height: '100dvh' }}
      >
        <HeroShell
          scrollHint={scrollHint}
          overlays={loadingLayers}
          canvas={
            <HeroPosterUnderCanvas
              canvasRef={canvasRef}
              canvasStyle={canvasStyleWithOptionalVignette(useVignette)}
            />
          }
        />
      </div>
    </section>
  );
}

export default function HeroDesktopSequence({
  coarsePointer,
  useVignette,
}: {
  coarsePointer: boolean;
  useVignette: boolean;
}) {
  const { t } = useLanguage();
  const wheelHint = t.hero.wheelScrollHint ?? '';
  return coarsePointer ? (
    <HeroDesktopScrollLinked scrollHint={null} useVignette={useVignette} />
  ) : (
    <HeroDesktopWheelLock wheelHint={wheelHint} useVignette={useVignette} />
  );
}
