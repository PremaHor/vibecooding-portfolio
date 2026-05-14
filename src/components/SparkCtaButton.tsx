import { type ButtonHTMLAttributes, type ReactNode } from 'react';

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
  const sizeClass =
    size === 'nav'
      ? 'spark-cta--nav min-h-[42px] px-6 lg:px-8 py-2.5 lg:py-3 text-[11px] lg:text-xs font-bold uppercase tracking-[0.22em]'
      : size === 'compact'
        ? 'spark-cta--compact min-h-[50px] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.15em]'
        : 'spark-cta--hero min-h-[56px] px-8 py-4 text-sm font-semibold tracking-normal sm:min-h-[60px] sm:px-10 sm:py-5 sm:text-base';

  const marqueeCopies = [0, 1, 2];

  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className={[
        'spark-cta max-w-full',
        sizeClass,
        fullWidth ? 'w-full justify-center' : '',
        disabled ? 'spark-cta--disabled opacity-55 pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="spark-cta-text">
        <span className="min-w-0 leading-snug">{children}</span>
        {iconAfter ? <span className="spark-cta-icon shrink-0">{iconAfter}</span> : null}
      </span>

      <span className="spark-cta-marquee" aria-hidden>
        <span className="spark-cta-marquee-track">
          {marqueeCopies.map((copy) => (
            <span className="spark-cta-marquee-item" key={copy}>
              <span>{children}</span>
              {iconAfter ? <span className="spark-cta-icon shrink-0">{iconAfter}</span> : null}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
