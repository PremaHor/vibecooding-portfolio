import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MousePointer2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';

export function NotFoundPage() {
  const { t, lang } = useLanguage();
  const tr = t.notFound;
  const fmt = (s: string) => (lang === 'cs' ? fixCzechTypography(s) : fixDashes(s));

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Horizontal guide line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-violet-400/50 hidden md:block" />
      {/* Vertical guide line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-violet-400/50 hidden md:block" />

      {/* Dimension label — top-left */}
      <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[10px] sm:text-xs font-mono text-violet-400/80 select-none">
        {tr.dimensions}
      </span>

      {/* Dimension label — bottom-right */}
      <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-[10px] sm:text-xs font-mono text-violet-400/80 select-none">
        X: 0  Y: NaN
      </span>

      {/* "Forgotten" cursor */}
      <motion.div
        className="absolute hidden md:block"
        style={{ top: '28%', left: '18%' }}
        animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MousePointer2 className="w-6 h-6 text-slate-400/60" />
        <span className="block mt-1 text-[9px] font-mono text-slate-400/50 whitespace-nowrap">
          {fmt(tr.cursorLabel)}
        </span>
      </motion.div>

      {/* Artboard card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Artboard label */}
        <div className="mb-2 ml-1 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-violet-400" />
          <span className="text-[11px] font-mono font-medium text-slate-500">
            {tr.artboardLabel}
          </span>
        </div>

        {/* The card — looks like a selected Figma frame */}
        <div className="relative bg-white rounded-lg shadow-sm border-2 border-blue-400 p-8 sm:p-10 md:p-12">
          {/* Selection handles */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-400 rounded-sm" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-400 rounded-sm" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-400 rounded-sm" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-400 rounded-sm" />

          {/* Title — slightly rotated for "draft" feel */}
          <motion.h1
            initial={{ rotate: -2 }}
            animate={{ rotate: [-2, -1.5, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6"
          >
            {tr.title}
          </motion.h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8 max-w-md">
            {fmt(tr.description)}
          </p>

          {/* Button — styled as a selected object with handles */}
          <div className="relative inline-block">
            <span className="absolute -top-1 -left-1 w-2 h-2 border border-blue-400 bg-white rounded-sm" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border border-blue-400 bg-white rounded-sm" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border border-blue-400 bg-white rounded-sm" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border border-blue-400 bg-white rounded-sm" />

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-[var(--color-vibe-orange)] hover:text-black active:scale-[0.97] transition-all duration-300 shadow-lg"
            >
              {fmt(tr.button)}
            </Link>
          </div>
        </div>

        {/* Bottom measurement line */}
        <div className="mt-3 flex items-center gap-2 ml-1">
          <div className="flex-1 h-px bg-slate-300" />
          <span className="text-[10px] font-mono text-slate-400 shrink-0">max-w: 32rem</span>
          <div className="flex-1 h-px bg-slate-300" />
        </div>
      </motion.div>
    </div>
  );
}
