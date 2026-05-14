import { type ButtonHTMLAttributes, type ReactNode, useId } from 'react';

export type SparkCtaButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
  children: ReactNode;
  /** Např. šipka vpravo */
  iconAfter?: ReactNode;
  className?: string;
  /** hero ~ velké CTA (výchozí), compact ~ karty/sekce, nav ~ užší navbar */
  size?: 'hero' | 'compact' | 'nav';
  /** Na mobilu přes celou šířku */
  fullWidth?: boolean;
};

/**
 * Glow / gradient border efekt podle konceptu Uiverse (SelfMadeSystem),
 * zabalený v jednom skutečném `<button>` pro přístupnost.
 */
export function SparkCtaButton({
  children,
  iconAfter,
  className = '',
  size = 'hero',
  fullWidth,
  disabled,
  type = 'button',
  ...props
}: SparkCtaButtonProps) {
  const rid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fid = rid.length > 0 ? `sc-${rid}` : 'sc-filter';

  const f1 = `url(#${fid}-unopaq)`;
  const f2 = `url(#${fid}-unopaq2)`;
  const f3 = `url(#${fid}-unopaq3)`;

  const sizeFace =
    size === 'nav'
      ? 'spark-cta-face--nav px-6 lg:px-8 py-2.5 lg:py-3 text-[11px] lg:text-xs font-bold uppercase tracking-[0.22em]'
      : size === 'compact'
        ? 'spark-cta-face--compact px-5 py-3.5 text-sm font-bold uppercase tracking-[0.15em]'
        : 'spark-cta-face--hero px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-semibold tracking-normal';

  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className={[
        'spark-cta inline-flex max-w-full',
        disabled ? 'spark-cta--disabled opacity-55 pointer-events-none' : '',
        fullWidth ? 'spark-cta--full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg className="spark-cta-filters" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <filter id={`${fid}-unopaq`} width="300%" x="-100%" height="300%" y="-100%">
            <feColorMatrix
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 9 0
              "
            />
          </filter>
          <filter id={`${fid}-unopaq2`} width="300%" x="-100%" height="300%" y="-100%">
            <feColorMatrix
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 3 0
              "
            />
          </filter>
          <filter id={`${fid}-unopaq3`} width="300%" x="-100%" height="300%" y="-100%">
            <feColorMatrix
              values="
                1 0 0 0.2 0
                0 1 0 0.2 0
                0 0 1 0.2 0
                0 0 0 2 0
              "
            />
          </filter>
        </defs>
      </svg>

      <div className="spark-cta-slot">
        <div className={`spark-cta-shell relative inline-flex max-w-full ${fullWidth ? 'w-full justify-center' : ''}`}>
          <div className="spark-cta-spin spark-cta-spin-blur" style={{ filter: `blur(2em) ${f1}` }} aria-hidden />

          <div className="spark-cta-spin spark-cta-spin-intense" style={{ filter: `blur(0.25em) ${f2}` }} aria-hidden />

          <div
            className={`spark-cta-ring rounded-full bg-black/25 p-[3px] relative inline-flex max-w-full ${
              fullWidth ? 'w-full sm:w-auto' : ''
            }`}
          >
            <div
              className="spark-cta-spin spark-cta-spin-inside rounded-[inherit]"
              style={{ filter: `blur(2px) ${f3}` }}
              aria-hidden
            />

            <div
              className={`spark-cta-face relative z-[1] flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-[calc(9999px-3px)] bg-[#111215] text-center text-white ${
                sizeFace
              } ${fullWidth ? 'w-full' : ''}`}
            >
              <span className="min-w-0 leading-snug">{children}</span>
              {iconAfter ? <span className="spark-cta-icon shrink-0">{iconAfter}</span> : null}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
