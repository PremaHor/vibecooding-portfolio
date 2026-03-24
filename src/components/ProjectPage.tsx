import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';
import { PROJECTS, getImageSrcSet } from '../shared/data';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const renderWithBold = (text: string, lang: 'cs' | 'en'): React.ReactNode => {
  const lines = text.split('\n');
  const processedLines = lang === 'cs' ? lines.map((l) => fixCzechTypography(l)) : lines.map((l) => fixDashes(l));
  return processedLines.flatMap((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const content = parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={`${lineIdx}-${i}`} className="font-semibold text-white/95">{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
    return lineIdx === 0 ? content : [<br key={`br-${lineIdx}`} />, ...content];
  });
};

const ProjectStructuredContent = ({ tr, lang }: { tr: { goalTitle: string; goal: string; solutionTitle: string; solution: string; benefitsTitle: string; benefits: readonly string[] }; lang: 'cs' | 'en' }) => (
  <div className="space-y-8 sm:space-y-10 mb-10 sm:mb-16">
    <div>
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(tr.goalTitle) : fixDashes(tr.goalTitle)}</h3>
      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] font-light">{renderWithBold(tr.goal, lang)}</p>
    </div>
    <div>
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(tr.solutionTitle) : fixDashes(tr.solutionTitle)}</h3>
      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] font-light">{renderWithBold(tr.solution, lang)}</p>
    </div>
    <div>
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(tr.benefitsTitle) : fixDashes(tr.benefitsTitle)}</h3>
      <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-white/80 leading-[1.6] font-light list-disc list-inside marker:text-[var(--color-vibe-orange)]">
        {tr.benefits.map((item, i) => (
          <li key={i}>{renderWithBold(item, lang)}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const ProjectPage = () => {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const projectIndex = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[projectIndex];
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const tr = project ? t.projects[project.slug as keyof typeof t.projects] : null;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxIndex(null); };
      window.addEventListener('keydown', onEscape);
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onEscape); };
    } else { document.body.style.overflow = ''; }
  }, [lightboxIndex]);

  if (!project) return <div>{lang === 'cs' ? fixCzechTypography(t.project.notFound) : fixDashes(t.project.notFound)}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="min-h-screen bg-[var(--color-vibe-black)] text-white">
      <Navbar theme="dark" isProjectPage />
      <main id="main-content" role="main" className="pt-nav-safe pb-0">
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 mb-20 sm:mb-24 md:mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden mb-8">
              <motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[var(--color-vibe-orange)] font-mono text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] block">
                {lang === 'cs' ? fixCzechTypography(tr?.category ?? project.category) : fixDashes(tr?.category ?? project.category ?? '')} / {project.year}
              </motion.span>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="font-display text-[clamp(1.75rem,8vw,3rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[1.08] mb-12 sm:mb-20">
              {lang === 'cs' ? fixCzechTypography(project.title) : fixDashes(project.title)}
            </motion.h1>
            <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="aspect-[16/9] w-full rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white/5 shadow-2xl">
              <img src={project.image} srcSet={getImageSrcSet(project.image)} sizes="(max-width: 768px) 100vw, 1200px" alt={lang === 'cs' ? fixCzechTypography(project.title) : fixDashes(project.title)} width={1200} height={800} fetchPriority="high" decoding="async" className="w-full h-full object-cover rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem]" referrerPolicy="no-referrer" />
            </motion.div>

            {project.galleryImages && project.galleryImages.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="mt-12 sm:mt-16 md:mt-20">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {project.galleryImages.map((img, idx) => (
                    <motion.button key={img.src} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }} onClick={() => setLightboxIndex(idx)} className="overflow-hidden rounded-xl sm:rounded-2xl text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-vibe-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-vibe-black)]" aria-label={lang === 'cs' ? `Zvětšit obrázek ${idx + 1}` : `Enlarge image ${idx + 1}`}>
                      <img src={img.src} srcSet={getImageSrcSet(img.src)} sizes={idx === 0 ? '(max-width: 768px) 100vw, 1200px' : '(max-width: 768px) 50vw, 600px'} alt={img.alt} width={1200} height={800} loading="lazy" decoding="async" className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {lightboxIndex !== null && project.galleryImages && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 safe-area-inset" onClick={() => setLightboxIndex(null)} role="dialog" aria-modal="true" aria-label={lang === 'cs' ? 'Zvětšený náhled obrázku' : 'Enlarged image view'}>
                  <button type="button" onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={lang === 'cs' ? 'Zavřít' : 'Close'}>
                    <X className="w-6 h-6" />
                  </button>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.25 }} className="relative max-w-full max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <img src={project.galleryImages[lightboxIndex].src} srcSet={getImageSrcSet(project.galleryImages[lightboxIndex].src)} sizes="100vw" alt={project.galleryImages[lightboxIndex].alt} className="max-w-full max-h-[90vh] w-auto h-auto object-contain" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="px-4 sm:px-6 md:px-8 lg:px-12 mb-24 sm:mb-32 md:mb-40">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20 sm:gap-28 md:gap-36">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase mb-10 sm:mb-14">{lang === 'cs' ? fixCzechTypography(t.project.about) : fixDashes(t.project.about)}</h2>
              {tr && 'structured' in tr && tr.structured ? (
                <ProjectStructuredContent tr={tr.structured} lang={lang} />
              ) : (
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] mb-10 sm:mb-16 font-light">
                  {lang === 'cs' ? fixCzechTypography(tr?.fullDescription ?? project.fullDescription) : fixDashes(tr?.fullDescription ?? project.fullDescription ?? '')}
                </p>
              )}
              <div className="grid grid-cols-2 gap-10 sm:gap-14 md:gap-20 border-t border-white/5 pt-14 sm:pt-20">
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(t.project.client) : fixDashes(t.project.client)}</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{lang === 'cs' ? fixCzechTypography(project.client) : fixDashes(project.client)}</p>
                </div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(t.project.role) : fixDashes(t.project.role)}</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{lang === 'cs' ? fixCzechTypography(project.role) : fixDashes(project.role)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-8 sm:space-y-12">
              <div>
                <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">{lang === 'cs' ? fixCzechTypography(t.project.tech) : fixDashes(t.project.tech)}</h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 sm:px-5 py-1.5 sm:py-2 border border-white/10 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest bg-white/5">{tag}</span>
                  ))}
                </div>
              </div>
              {project.websiteUrls && project.websiteUrls.length > 0 && (
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">{lang === 'cs' ? fixCzechTypography(t.project.website) : fixDashes(t.project.website)}</h4>
                  <div className="flex flex-wrap gap-3">
                    {project.websiteUrls.map(({ label, url }) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 min-h-[44px] border border-white/20 rounded-full text-sm font-mono text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all break-words max-w-full">
                        <span className="break-all">{label}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10">
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                  "{lang === 'cs' ? fixCzechTypography(tr?.quote ?? project.quote ?? t.project.defaultQuote) : fixDashes(tr?.quote ?? project.quote ?? t.project.defaultQuote ?? '')}"
                </p>
              </div>
            </div>
          </div>
        </section>

        <Link to={`/project/${nextProject.slug}`} className="group block relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-8 lg:px-12 bg-white text-black overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-vibe-orange)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6 text-black/60 group-hover:text-white transition-all">{lang === 'cs' ? fixCzechTypography(t.project.nextProject) : fixDashes(t.project.nextProject)}</span>
            <h2 className="font-display text-[clamp(1.75rem,8vw,3rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[1.05] mb-10 sm:mb-14 group-hover:text-white transition-colors">
              {lang === 'cs' ? fixCzechTypography(nextProject.title) : fixDashes(nextProject.title)}
            </h2>
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-black/10 flex items-center justify-center group-hover:border-white/20 group-hover:scale-110 transition-all duration-500">
              <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 group-hover:text-white transition-colors" />
            </div>
          </div>
        </Link>
      </main>
      <Footer />
    </motion.div>
  );
};
