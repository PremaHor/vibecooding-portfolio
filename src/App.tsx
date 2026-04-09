import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation, useRouteMatch } from './router';
import { ArrowRight } from 'lucide-react';
import { fixCzechTypography, fixDashes } from './utils/czechTypography';
import { useLanguage } from './i18n/LanguageContext';
import { useGoToContactForm } from './hooks/useGoToContactForm';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const HomeSections = lazy(() => import('./components/HomeSections'));
const LazyProjectPage = lazy(() => import('./components/ProjectPage').then(m => ({ default: m.ProjectPage })));
const PrivacyPage = lazy(() => import('./components/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// --- Hero (zero motion dependency — CSS animations only) ---

const Hero = () => {
  const { t, lang } = useLanguage();
  const goToContactForm = useGoToContactForm();

  return (
    <section className="hero-section relative min-h-[100dvh] min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-nav-safe pb-16 sm:pb-20 md:pb-24 overflow-hidden backface-hidden">
      <div className="absolute top-1/4 -right-10 sm:-right-20 w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] bg-[var(--color-vibe-orange)] rounded-full blur-[80px] sm:blur-[120px] opacity-[0.12] backface-hidden will-change-transform" />
      <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-[40vw] sm:w-[30vw] h-[40vw] sm:h-[30vw] bg-blue-600 rounded-full blur-[80px] sm:blur-[120px] opacity-[0.08] backface-hidden will-change-transform" />

      <div className="hero-content relative z-10 max-w-4xl mx-auto w-full text-center">
        <p className="hero-eyebrow-type text-[var(--color-vibe-orange)] font-semibold tracking-wider uppercase text-sm mb-4">
          {lang === 'cs' ? fixCzechTypography(t.hero.eyebrow) : fixDashes(t.hero.eyebrow)}
        </p>
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] sm:text-[clamp(2.5rem,7vw,4.25rem)] md:text-[clamp(3rem,8vw,5rem)] font-bold leading-[1.1] mb-6 sm:mb-8">
          <span className="block bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-transparent hero-anim">
            {lang === 'cs' ? fixCzechTypography(t.hero.h1) : fixDashes(t.hero.h1)}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-normal text-gray-400 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed text-center hero-anim hero-anim-d1">
          {lang === 'cs' ? fixCzechTypography(t.hero.subheadline) : fixDashes(t.hero.subheadline)}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 hero-anim hero-anim-d2">
          <button
            type="button"
            onClick={goToContactForm}
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 hover:shadow-[0_0_30px_rgba(242,125,38,0.4)] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-300 shadow-lg min-w-[180px] sm:min-w-0 cursor-pointer"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.ctaPrimary) : fixDashes(t.hero.ctaPrimary)}
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold border-2 border-white/25 text-white/90 hover:bg-white/5 hover:border-white/40 transition-[background-color,border-color] duration-300 min-w-[180px] sm:min-w-0"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.ctaSecondary) : fixDashes(t.hero.ctaSecondary)}
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Pages ---

const HomePage = ({ navTheme }: { navTheme: 'light' | 'dark' }) => (
  <>
    <Navbar theme={navTheme} />
    <main id="main-content" role="main">
      <Hero />
      <Suspense fallback={<div className="min-h-[min(70vh,32rem)]" aria-hidden />}>
        <HomeSections />
      </Suspense>
    </main>
    <Footer />
  </>
);

// --- App ---

export default function App() {
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();
  const match = useRouteMatch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const lenisRef = useRef<{ destroy: () => void } | null>(null);
  const lenisFrameCancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) return;

    const initLenis = () => {
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        });
        lenisRef.current = lenis;
        let rafId = 0;
        const onFrame = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(onFrame);
        };
        rafId = requestAnimationFrame(onFrame);
        lenisFrameCancelRef.current = () => {
          cancelAnimationFrame(rafId);
        };
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initLenis);
    } else {
      setTimeout(initLenis, 200);
    }

    let scrollTicking = false;
    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 80;
        const processSection = document.getElementById('process');
        const workSection = document.getElementById('work');
        const aboutSection = document.getElementById('about');
        const servicesSection = document.getElementById('services');
        const contactSection = document.getElementById('contact');
        const ctaSection = document.getElementById('cta');
        let currentTheme: 'light' | 'dark' = 'dark';
        if (contactSection && scrollPos >= contactSection.offsetTop) {
          currentTheme = 'light';
        } else if (ctaSection && scrollPos >= ctaSection.offsetTop) {
          currentTheme = 'dark';
        } else if (servicesSection && scrollPos >= servicesSection.offsetTop) {
          currentTheme = 'dark';
        } else if (aboutSection && scrollPos >= aboutSection.offsetTop) {
          currentTheme = 'dark';
        } else if (workSection && scrollPos >= workSection.offsetTop) {
          currentTheme = 'light';
        } else if (processSection && scrollPos >= processSection.offsetTop) {
          currentTheme = 'light';
        } else {
          currentTheme = 'dark';
        }
        setNavTheme(currentTheme);
        scrollTicking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenisFrameCancelRef.current?.();
      lenisFrameCancelRef.current = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-vibe-orange)] selection:text-black backface-hidden">
      <div className="noise-overlay" />
      <div key={location.pathname} className="page-fade-in">
        {match.name === 'home' && <HomePage navTheme={navTheme} />}
        {match.name === 'project' && (
          <Suspense fallback={null}>
            <LazyProjectPage />
          </Suspense>
        )}
        {match.name === 'privacy' && (
          <Suspense fallback={null}>
            <PrivacyPage />
          </Suspense>
        )}
        {match.name === 'notfound' && (
          <Suspense fallback={null}>
            <NotFoundPage />
          </Suspense>
        )}
      </div>
      <CookieConsentBanner />
    </div>
  );
}
