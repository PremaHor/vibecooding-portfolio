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
  void iconAfter;

  const sizeClass =
    size === 'nav'
      ? 'spark-cta--nav text-[11px] lg:text-xs font-bold uppercase tracking-[0.22em]'
      : size === 'compact'
        ? 'spark-cta--compact text-sm font-bold uppercase tracking-[0.15em]'
        : 'spark-cta--hero text-sm font-semibold tracking-normal sm:text-base';

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
      <span className="spark-cta-circle" aria-hidden>
        <span className="spark-cta-arrow" />
      </span>
      <span className="spark-cta-text">
        {children}
      </span>
    </button>
  );
}
