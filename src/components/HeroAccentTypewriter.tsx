import { useState, useEffect } from 'react';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type HeroAccentTypewriterProps = {
  text: string;
  /** Zpoždění po mountu (synchronizace s hero fade-in). */
  startDelayMs?: number;
  /** Mezera mezi znaky. */
  charIntervalMs?: number;
  /** Tailwind / vlastní třídy pro kurzor (výchozí oranžová akcent). */
  caretClassName?: string;
};

export function HeroAccentTypewriter({
  text,
  startDelayMs = 640,
  charIntervalMs = 44,
  caretClassName = 'bg-[var(--color-vibe-orange)]',
}: HeroAccentTypewriterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(() => (reducedMotion ? text.length : 0));

  useEffect(() => {
    if (reducedMotion) {
      setShown(text.length);
      return;
    }

    setShown(0);
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      let i = 0;
      intervalId = window.setInterval(() => {
        i += 1;
        setShown(Math.min(i, text.length));
        if (i >= text.length && intervalId !== undefined) {
          window.clearInterval(intervalId);
          intervalId = undefined;
        }
      }, charIntervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [text, reducedMotion, startDelayMs, charIntervalMs]);

  const done = shown >= text.length;
  const visible = text.slice(0, shown);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {visible}
        {!done && (
          <span
            className={`hero-typewriter-caret ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-px align-middle ${caretClassName}`}
            aria-hidden
          />
        )}
      </span>
    </>
  );
}
