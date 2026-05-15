/**
 * Shared hero primitives used by both the lightweight mobile root and the
 * lazy-loaded desktop canvas sequence chunk.
 */
import type { ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useGoToContactForm } from '../hooks/useGoToContactForm';
import { SparkCtaButton } from './SparkCtaButton';

export const FRAME_COUNT = 60;
export const LAST_FRAME_INDEX = FRAME_COUNT - 1;

export const VIGNETTE =
  'radial-gradient(ellipse 62% 68% at 50% 50%, black 0%, black 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 70%, transparent 88%)';

export function frameUrl(i: number): string {
  return `/hero-frames/frame_${String(i + 1).padStart(3, '0')}.webp`;
}

export type HeroStatementPart = {
  text: string;
  emphasis?: boolean;
};

type HeroShellProps = {
  scrollHint?: string | null;
  canvas: ReactNode;
  overlays?: ReactNode;
};

function formatHeroCopy(text: string, lang: 'cs' | 'en') {
  return lang === 'cs' ? fixCzechTypography(text) : fixDashes(text);
}

export function HeroShell({ scrollHint, canvas, overlays }: HeroShellProps) {
  const { t, lang } = useLanguage();
  const goToContactForm = useGoToContactForm();
  const statementLines = t.hero.subheadlineStatement as HeroStatementPart[][];

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

          <p
            className="hero-statement mx-auto mb-10 sm:mb-12 max-w-[46rem] rounded-[1.75rem] border border-white/10 bg-black/25 px-5 py-5 text-center text-[clamp(1.05rem,2.2vw,1.65rem)] font-medium leading-[1.35] text-white/88 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-7 sm:py-6 md:leading-[1.32]"
          >
            <span className="sr-only">{formatHeroCopy(t.hero.subheadlineLead, lang)}</span>
            {statementLines.map((line, lineIndex) => (
              <span
                key={lineIndex}
                className="hero-statement-line block"
                style={{ animationDelay: `${780 + lineIndex * 135}ms` }}
                aria-hidden
              >
                {line.map((part, partIndex) => (
                  <span
                    key={partIndex}
                    className={
                      part.emphasis
                        ? 'font-semibold text-white underline decoration-white/25 decoration-2 underline-offset-[0.18em]'
                        : ''
                    }
                  >
                    {formatHeroCopy(part.text, lang)}
                  </span>
                ))}
              </span>
            ))}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 hero-anim hero-anim-d2">
            <SparkCtaButton
              type="button"
              onClick={goToContactForm}
              size="hero"
              iconAfter={<ArrowRight className="w-4 h-4" aria-hidden />}
            >
              {lang === 'cs' ? fixCzechTypography(t.hero.ctaPrimary) : fixDashes(t.hero.ctaPrimary)}
            </SparkCtaButton>
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
