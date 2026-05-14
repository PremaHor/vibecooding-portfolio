import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation, useRouteMatch } from './router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { HeroScrollSequence } from './components/HeroScrollSequence';

const HomeSections = lazy(() => import('./components/HomeSections'));
const LazyProjectPage = lazy(() => import('./components/ProjectPage').then(m => ({ default: m.ProjectPage })));
const PrivacyPage = lazy(() => import('./components/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// --- Pages ---

const HomePage = ({ navTheme }: { navTheme: 'light' | 'dark' }) => (
  <>
    <Navbar theme={navTheme} />
    <main id="main-content" role="main">
      <HeroScrollSequence />
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
