import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';
import { useIsMobile } from '../hooks/useIsMobile';
import { CONTACT_EMAIL, PROJECTS, getImageSrcSet, type Project } from '../shared/data';
import {
  Code2, Zap, Globe, ArrowRight, ArrowLeft, Rocket, ShieldCheck, Brain,
  ClipboardCheck, Palette, Lightbulb, PenTool, Layers, Server, Cpu, Target,
  Send, CheckCircle, AlertCircle, ChevronDown,
} from 'lucide-react';

const LazyReCAPTCHA = lazy(() => import('react-google-recaptcha'));

// --- Process (Bento Grid) ---

const BENTO_STEPS = [
  { icon: Lightbulb, key: 'step1' as const },
  { icon: PenTool,   key: 'step2' as const },
  { icon: Layers,    key: 'step3' as const },
  { icon: Code2,     key: 'step4' as const },
  { icon: Server,    key: 'step5' as const },
];

const BentoCard = ({ children, className = '', delay = 0, dark = false }: { children: React.ReactNode; className?: string; delay?: number; dark?: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay }}
    className={`group relative rounded-2xl border p-6 sm:p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] ${
      dark
        ? 'bg-slate-800 text-white border-slate-600/25'
        : 'bg-white text-black border-black/[0.06]'
    } ${className}`}
  >
    {children}
  </motion.article>
);

const ProcessSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const tx = (v: string) => lang === 'cs' ? fixCzechTypography(v) : fixDashes(v);

  return (
    <section id="process" className="relative bg-slate-50 text-black py-20 sm:py-28 md:py-36 lg:py-48" aria-labelledby="process-heading">
      <h2 id="process-heading" className="sr-only">{tx(t.process.title)}</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 sm:mb-20 text-center"
        >
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.08] mb-4">
            {tx(t.process.title)}
          </h3>
          <p className="text-lg sm:text-xl text-black/70 max-w-2xl mx-auto">
            {tx(t.process.subtitle)}
            <br />
            {tx(t.process.subtitle2)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1 — Stack & Tooling (wide) */}
          <BentoCard className="md:col-span-2 lg:col-span-2" dark delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-display text-sm sm:text-base uppercase tracking-wide">{tx(t.process.stackTitle)}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.process.stackTags.map((tag) => (
                <span key={tag} className="inline-block px-3.5 py-2 rounded-full text-xs font-semibold bg-white/[0.08] text-white/90 border border-white/[0.12] hover:bg-[var(--color-vibe-orange)]/20 hover:text-[var(--color-vibe-orange)] hover:border-[var(--color-vibe-orange)]/30 transition-colors duration-200">
                  {tag}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Card 2 — Pochopení problému (dominant, tall) */}
          <BentoCard className="md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col bg-gradient-to-br from-[var(--color-vibe-orange)]/[0.04] to-transparent" delay={0.06}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-5 shrink-0">
              <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h4 className="font-display text-lg sm:text-xl lg:text-2xl uppercase leading-[1.1] text-black mb-3">
              {tx(t.process.step1Title)}
            </h4>
            <p className="text-base sm:text-lg text-black/70 leading-[1.65] flex-1">
              {tx(t.process.step1Text)}
            </p>
          </BentoCard>

          {/* Card 3 — UI/UX Design */}
          <BentoCard delay={0.12}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-4 shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm sm:text-base uppercase text-black mb-2">{tx(t.process.step2Title)}</h4>
            <p className="text-sm text-black/70 leading-[1.6]">{tx(t.process.step2Text)}</p>
          </BentoCard>

          {/* Card 4 — Validace */}
          <BentoCard delay={0.18}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-4 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm sm:text-base uppercase text-black mb-2">{tx(t.process.step3Title)}</h4>
            <p className="text-sm text-black/70 leading-[1.6]">{tx(t.process.step3Text)}</p>
          </BentoCard>

          {/* Card 5 — Vývoj s AI */}
          <BentoCard delay={0.24}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-4 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm sm:text-base uppercase text-black mb-2">{tx(t.process.step4Title)}</h4>
            <p className="text-sm text-black/70 leading-[1.6]">{tx(t.process.step4Text)}</p>
          </BentoCard>

          {/* Card 6 — Produkce */}
          <BentoCard delay={0.30}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-4 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm sm:text-base uppercase text-black mb-2">{tx(t.process.step5Title)}</h4>
            <p className="text-sm text-black/70 leading-[1.6]">{tx(t.process.step5Text)}</p>
          </BentoCard>

          {/* Card 7 — AI & Automatizace */}
          <BentoCard className="md:col-span-1 lg:col-span-2" delay={0.36}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-4 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-display text-sm sm:text-base uppercase text-black mb-2">{tx(t.process.aiTitle)}</h4>
            <p className="text-sm sm:text-base text-black/70 leading-[1.6]">{tx(t.process.aiText)}</p>
          </BentoCard>

          {/* Card 8 — Můj cíl (full-width bottom) */}
          <BentoCard className="md:col-span-2 lg:col-span-4" dark delay={0.42}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-base sm:text-lg uppercase mb-1">{tx(t.process.goalTitle)}</h4>
                <p className="text-sm sm:text-base text-white/70 leading-[1.6]">{tx(t.process.goalText)}</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" aria-hidden />
    </section>
  );
};

// --- Work ---

function ProjectCard({ project, index, isMobile }: { project: Project; index: number; isMobile: boolean }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const tr = t.projects[project.slug as keyof typeof t.projects];
  const category = tr?.category ?? project.category;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link to={`/project/${project.slug}`} className="block relative">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] mb-6 sm:mb-8 bg-gray-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 backface-hidden">
          <img
            src={project.image}
            srcSet={getImageSrcSet(project.image)}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={lang === 'cs' ? `${fixCzechTypography(project.title)}, ${fixCzechTypography(category)}, ${project.year}` : `${fixDashes(project.title)}, ${fixDashes(category)}, ${project.year}`}
            width={1200}
            height={800}
            loading={index === 0 && !isMobile ? 'eager' : 'lazy'}
            fetchPriority={index === 0 && !isMobile ? 'high' : undefined}
            decoding="async"
            className="w-full h-full object-cover rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.08] backface-hidden"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center ios-backdrop-blur backface-hidden">
            <div className="overflow-hidden mb-4">
              <motion.div
                initial={{ y: '100%' }}
                whileHover={{ y: 0 }}
                className="text-white text-xs font-bold uppercase tracking-[0.5em]"
              >
                {lang === 'cs' ? fixCzechTypography(t.work.viewCaseStudy) : fixDashes(t.work.viewCaseStudy)}
              </motion.div>
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)">
              <ArrowRight className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-[var(--color-vibe-orange)]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-vibe-orange)]">
              {lang === 'cs' ? fixCzechTypography(category) : fixDashes(category)}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase leading-[1.05] group-hover:translate-x-2 transition-transform duration-300">
            {lang === 'cs' ? fixCzechTypography(project.title) : fixDashes(project.title)}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] px-3 py-1.5 border border-black/10 rounded-full font-mono uppercase tracking-[0.15em] bg-white group-hover:bg-black group-hover:text-white group-hover:border-black transition-[background-color,color,border-color] duration-300">
                {tag}
              </span>
            ))}
            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest ml-auto">{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

const WorkSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const isMobile = useIsMobile();
  return (
    <section id="work" className="relative bg-white text-black py-20 sm:py-28 md:py-36 lg:py-48" aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">{lang === 'cs' ? fixCzechTypography(t.nav.work) : fixDashes(t.nav.work)}</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-black/50">
            03 • {lang === 'cs' ? fixCzechTypography(t.nav.work) : fixDashes(t.nav.work)}
          </span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-20 md:gap-24 lg:gap-32">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} isMobile={isMobile} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" aria-hidden />
    </section>
  );
};

// --- About ---

const AboutSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <section id="about" className="relative py-24 sm:py-32 md:py-40 lg:py-48 overflow-hidden backface-hidden">
      <div className="absolute inset-0 bg-[var(--color-vibe-black)] backface-hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(242,125,38,0.06),transparent_50%)] backface-hidden" aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-10 sm:space-y-12"
          >
            <div className="aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <img
                src="/images/projects/FOTKA.webp"
                srcSet={getImageSrcSet('/images/projects/FOTKA.webp')}
                sizes="(max-width: 1024px) 100vw, 45vw"
                alt="Přemysl Horák"
                width={500}
                height={625}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">
                {lang === 'cs' ? fixCzechTypography(t.about.valuesTitle) : fixDashes(t.about.valuesTitle)}
              </h3>
              {[t.about.value1, t.about.value2, t.about.value3].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0, margin: '0px 0px -60px 0px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--color-vibe-orange)]/20 hover:bg-white/[0.05] transition-[border-color,background-color] duration-300 backface-hidden"
                >
                  <span className="shrink-0 w-1 h-1 mt-2 rounded-full bg-[var(--color-vibe-orange)]" />
                  <span className="text-sm sm:text-base text-white/85 leading-[1.6] font-light">
                    {lang === 'cs' ? fixCzechTypography(value) : fixDashes(value)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-[1.08] text-white">
              {lang === 'cs' ? fixCzechTypography(t.about.title) : fixDashes(t.about.title)}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/95 leading-[1.4]">
              {lang === 'cs' ? fixCzechTypography(t.about.subtitle) : fixDashes(t.about.subtitle)}
            </p>
            <p className="text-base sm:text-lg text-white/75 leading-[1.75] font-light">
              {lang === 'cs' ? fixCzechTypography(t.about.p1) : fixDashes(t.about.p1)}
            </p>
            <p className="text-base sm:text-lg text-white/75 leading-[1.75] font-light">
              {lang === 'cs' ? fixCzechTypography(t.about.p2) : fixDashes(t.about.p2)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Services ---

const SERVICES_CARDS = [
  { icon: Zap, key: 'card1' as const },
  { icon: Globe, key: 'card2' as const },
  { icon: Rocket, key: 'card3' as const },
];

const ServicesPricingSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <section id="services" className="py-20 sm:py-28 md:py-36 lg:py-48 px-3 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden backface-hidden">
      <div id="pricing" className="absolute top-0 left-0 -translate-y-24" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-white/[0.02] to-transparent pointer-events-none backface-hidden" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-[clamp(1.5rem,6vw,1.875rem)] sm:text-4xl md:text-5xl lg:text-6xl uppercase mb-16 sm:mb-20 md:mb-24 leading-[1.12] text-white"
        >
          {lang === 'cs' ? fixCzechTypography(t.services.title) : fixDashes(t.services.title)}
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {SERVICES_CARDS.map(({ icon: Icon, key }, idx) => {
            const bullets = t.services[`${key}Bullets` as keyof typeof t.services] as unknown as string[];
            return (
              <motion.article
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col border border-white/10 rounded-2xl lg:rounded-[1.75rem] overflow-hidden hover:border-white/20 hover:bg-white/[0.03] transition-colors"
              >
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl uppercase mt-4 text-white/95">
                    {lang === 'cs' ? fixCzechTypography(t.services[`${key}Title`]) : fixDashes(t.services[`${key}Title`])}
                  </h3>
                  <p className="text-sm text-white/70 mt-2 leading-[1.5]">
                    {lang === 'cs' ? fixCzechTypography(t.services[`${key}Subtitle`]) : fixDashes(t.services[`${key}Subtitle`])}
                  </p>
                  {t.services[`${key}Price` as keyof typeof t.services] && (
                    <p className="text-[var(--color-vibe-orange)] font-bold text-lg sm:text-xl mt-4">
                      {lang === 'cs' ? fixCzechTypography(t.services[`${key}Price`]) : fixDashes(t.services[`${key}Price`])}
                    </p>
                  )}
                  <ul className="mt-6 space-y-3 flex-1">
                    {bullets?.map((bullet, i) => (
                      <li key={i} className="text-white/80 text-sm sm:text-base leading-[1.6] flex gap-3">
                        <span className="text-[var(--color-vibe-orange)] shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
                        {lang === 'cs' ? fixCzechTypography(bullet) : fixDashes(bullet)}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
        <motion.a
          href={CONTACT_EMAIL}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 sm:p-8 rounded-2xl border-2 border-[var(--color-vibe-orange)]/40 bg-[var(--color-vibe-orange)]/5 hover:border-[var(--color-vibe-orange)]/60 hover:bg-[var(--color-vibe-orange)]/10 transition-[border-color,background-color] duration-300 group"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-vibe-orange)]/20 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0">
            <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg sm:text-xl uppercase text-white mb-1">
              {lang === 'cs' ? fixCzechTypography(t.services.auditTitle) : fixDashes(t.services.auditTitle)}
            </h3>
            <p className="text-sm sm:text-base text-white/75 leading-[1.6]">
              {lang === 'cs' ? fixCzechTypography(t.services.auditSubtitle) : fixDashes(t.services.auditSubtitle)}
            </p>
          </div>
          <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.15em] bg-[var(--color-vibe-orange)] text-black group-hover:bg-[var(--color-vibe-orange)]/90 transition-colors shrink-0 min-h-[44px]">
            {lang === 'cs' ? fixCzechTypography(t.services.auditCta) : fixDashes(t.services.auditCta)}
            <ArrowRight className="w-4 h-4" />
          </span>
        </motion.a>
      </div>
    </section>
  );
};

// --- CTA ---

const CtaSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <section id="cta" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-black)] text-white relative overflow-hidden backface-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase mb-6 sm:mb-8 leading-[1.12]"
        >
          {lang === 'cs' ? fixCzechTypography(t.cta.title) : fixDashes(t.cta.title)}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-white/80 mb-12 sm:mb-16 leading-[1.7]"
        >
          {lang === 'cs' ? fixCzechTypography(t.cta.text) : fixDashes(t.cta.text)}
        </motion.p>
        <motion.a
          href={CONTACT_EMAIL}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 hover:shadow-[0_0_30px_rgba(242,125,38,0.4)] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-300"
        >
          {lang === 'cs' ? fixCzechTypography(t.contact.writeMessage) : fixDashes(t.contact.writeMessage)}
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
};

// --- Competitive Advantage ---

const COMPETITIVE_CARDS = [
  { icon: Palette, key: 'card4' as const },
  { icon: Brain, key: 'card2' as const },
  { icon: ShieldCheck, key: 'card3' as const },
  { icon: Zap, key: 'card1' as const },
];

const CompetitiveAdvantageSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <section id="competitive-advantage" className="relative py-20 sm:py-28 md:py-36 lg:py-48 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden backface-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-vibe-black)] via-[#0a0a0a] to-[var(--color-vibe-black)] backface-hidden" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,var(--color-vibe-orange)/8_0%,transparent_70%)] pointer-events-none backface-hidden" />
      <div className="absolute inset-0 border border-white/5 rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-12 pointer-events-none backface-hidden" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.12] mb-6 sm:mb-8 text-white">
            {lang === 'cs' ? fixCzechTypography(t.competitiveAdvantage.title) : fixDashes(t.competitiveAdvantage.title)}
          </h2>
          {t.competitiveAdvantage.subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-vibe-orange)] mb-6 leading-[1.4]">
              {lang === 'cs' ? fixCzechTypography(t.competitiveAdvantage.subtitle) : fixDashes(t.competitiveAdvantage.subtitle)}
            </p>
          )}
          <p className="text-base sm:text-lg text-white/85 leading-[1.7] mb-16 sm:mb-20">
            {lang === 'cs' ? fixCzechTypography(t.competitiveAdvantage.paragraph) : fixDashes(t.competitiveAdvantage.paragraph)}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {COMPETITIVE_CARDS.map(({ icon: Icon, key }, idx) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[var(--color-vibe-orange)]/30 hover:bg-white/[0.05] transition-[border-color,background-color] duration-500 flex flex-col backface-hidden"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--color-vibe-orange)]/20 flex items-center justify-center text-[var(--color-vibe-orange)] mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-display text-lg sm:text-xl uppercase text-white mb-3">
                {lang === 'cs' ? fixCzechTypography(t.competitiveAdvantage[`${key}Title`]) : fixDashes(t.competitiveAdvantage[`${key}Title`])}
              </h3>
              <p className="text-sm sm:text-base text-white/75 leading-[1.6]">
                {lang === 'cs' ? fixCzechTypography(t.competitiveAdvantage[`${key}Text`]) : fixDashes(t.competitiveAdvantage[`${key}Text`])}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- FAQ ---

const FAQSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [openId, setOpenId] = useState<number | null>(null);

  const items = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-black)]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase leading-[1.12] text-white mb-4">
            {lang === 'cs' ? fixCzechTypography(t.faq.title) : fixDashes(t.faq.title)}
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            {lang === 'cs' ? fixCzechTypography(t.faq.subtitle) : fixDashes(t.faq.subtitle)}
          </p>
        </motion.div>
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openId === idx;
            return (
              <motion.div
                key={idx}
                layout
                className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02] hover:border-white/20 transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left min-h-[44px] sm:min-h-0"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className="font-display text-sm sm:text-base uppercase text-white/95 pr-4">
                    {lang === 'cs' ? fixCzechTypography(item.q) : fixDashes(item.q)}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-vibe-orange)]"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <p className="text-white/80 text-sm sm:text-base leading-[1.7]">
                          {lang === 'cs' ? fixCzechTypography(item.a) : fixDashes(item.a)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Contact ---

const FORMSPREE_URL = 'https://formspree.io/f/mjkebwwp';
const RECAPTCHA_SITE_KEY = '6LdmmJEsAAAAAJuJYP_R6yhyFrOGTsKF1A8ml6ZF';

const ContactSection = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<any>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const handleFocusIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, select')) return;
      setTimeout(() => {
        const rect = target.getBoundingClientRect();
        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const navHeight = remPx * 7;
        if (rect.top < navHeight) {
          window.scrollBy({ top: rect.top - navHeight, behavior: 'smooth' });
        }
      }, 350);
    };
    form.addEventListener('focusin', handleFocusIn);
    return () => form.removeEventListener('focusin', handleFocusIn);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recaptchaToken) { setFormStatus('error'); return; }
    setFormStatus('sending');
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('g-recaptcha-response', recaptchaToken);
      const res = await fetch(FORMSPREE_URL, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (res.ok) {
        setFormStatus('success');
        formRef.current?.reset();
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
  };

  const f = t.contact.form;

  return (
    <section id="contact" className="py-24 sm:py-32 md:py-40 lg:py-52 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-orange)] text-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/5 to-transparent" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase leading-[1.08] mb-8 sm:mb-10">
            {lang === 'cs' ? fixCzechTypography(t.contact.title) : fixDashes(t.contact.title)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-light mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
            {lang === 'cs' ? fixCzechTypography(t.contact.intro) : fixDashes(t.contact.intro)}
          </p>
        </motion.div>
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.6 }}>
            {formStatus === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="bg-black/[0.06] backdrop-blur-sm rounded-2xl p-8 sm:p-10 md:p-12 shadow-sm border border-black/10 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-black" /></div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-black">{lang === 'cs' ? fixCzechTypography(f.thankYouTitle) : fixDashes(f.thankYouTitle)}</h3>
                <p className="text-base sm:text-lg text-black/70 max-w-md leading-relaxed">{lang === 'cs' ? fixCzechTypography(f.thankYouText) : fixDashes(f.thankYouText)}</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setFormStatus('idle'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-2 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-black transition-colors duration-300">
                  <ArrowLeft className="w-4 h-4" />{lang === 'cs' ? fixCzechTypography(f.backToSite) : fixDashes(f.backToSite)}
                </motion.button>
              </motion.div>
            ) : (
              <form ref={formRef} action={FORMSPREE_URL} method="POST" onSubmit={handleSubmit} className="bg-black/[0.06] backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-black/10 space-y-5">
                <input type="hidden" name="_subject" value={lang === 'cs' ? 'Nová zpráva z webu vibecooding.cz' : 'New message from vibecooding.cz'} />
                <div>
                  <label htmlFor="full-name" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.name}</label>
                  <input type="text" id="full-name" name="full-name" placeholder={f.namePlaceholder} className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.email} *</label>
                  <input type="email" id="email" name="email" required placeholder={f.emailPlaceholder} className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.subject}</label>
                  <input type="text" id="subject" name="subject" placeholder={f.subjectPlaceholder} className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.message} *</label>
                  <textarea id="message" name="message" required rows={5} placeholder={f.messagePlaceholder} className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200 resize-y min-h-[120px]" />
                </div>
                <div className="flex justify-center">
                  <Suspense fallback={<div className="h-[78px]" />}>
                    <LazyReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} hl={lang} theme="light" onChange={(token: string | null) => setRecaptchaToken(token)} onExpired={() => setRecaptchaToken(null)} />
                  </Suspense>
                </div>
                <motion.button type="submit" disabled={formStatus === 'sending' || !recaptchaToken} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 bg-black text-white px-8 py-4.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                  {formStatus === 'sending' ? <>{f.sending}</> : <><Send className="w-4 h-4" /> {f.submit}</>}
                </motion.button>
                {formStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm font-medium text-red-900 bg-red-100/80 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />{lang === 'cs' ? fixCzechTypography(f.error) : fixDashes(f.error)}
                  </motion.div>
                )}
                <p className="text-[11px] text-black/50 text-center pt-1">{lang === 'cs' ? fixCzechTypography(f.gdpr) : fixDashes(f.gdpr)}</p>
              </form>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-10 sm:mt-12 text-center">
            <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={CONTACT_EMAIL} className="text-lg sm:text-xl md:text-2xl font-bold border-b-4 border-black pb-2 hover:text-white hover:border-white transition-colors duration-300 break-words" aria-label={lang === 'cs' ? 'Napsat e-mail na horakpremysl85@gmail.com' : 'Send email to horakpremysl85@gmail.com'}>
              horakpremysl85@gmail.com
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Exported composite ---

export default function HomeSections() {
  return (
    <>
      <ProcessSection />
      <WorkSection />
      <AboutSection />
      <ServicesPricingSection />
      <CtaSection />
      <CompetitiveAdvantageSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
