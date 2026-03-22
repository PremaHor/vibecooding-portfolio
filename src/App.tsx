import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, frame, cancelFrame } from 'motion/react';
import { fixCzechTypography, fixDashes } from './utils/czechTypography';
import { useLanguage } from './i18n/LanguageContext';
import { 
  Code2, 
  Zap, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Linkedin, 
  Github,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Rocket,
  ShieldCheck,
  Brain,
  ClipboardCheck,
  Palette,
  Lightbulb,
  PenTool,
  Layers,
  Server,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const LazyReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const PrivacyPage = lazy(() => import('./components/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// --- Types ---
interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  year: string;
  client: string;
  role: string;
  websiteUrls?: { label: string; url: string }[];
  quote?: string;
  galleryImages?: { src: string; alt: string }[];
}

// --- Helpers ---
function getImageSrcSet(imagePath: string): string {
  const base = imagePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const ext = imagePath.match(/\.(webp|jpg|jpeg|png)$/i)?.[1] ?? 'webp';
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${imagePath} 1200w`;
}

// --- Constants ---
const CONTACT_EMAIL = 'mailto:horakpremysl85@gmail.com';

const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "risklight",
    title: "RiskLight",
    category: "PWA",
    description: "Bezpečnostní a organizační PWA pro terénní sociální pracovníky. Evidence klientů, rizika, SOS tlačítko, časovač návštěv a týmový chat v jedné aplikaci.",
    fullDescription: "RiskLight spojuje ochranu života s přehlednou evidencí. Sociální pracovníci v terénu mají v mobilu nejen evidenci klientů a rizik, ale i nouzové SOS, chytrý časovač návštěvy a týmovou spolupráci v reálném čase. Aplikace běží na Supabase a byla vyvinuta ve spolupráci s lidmi z praxe. Cíl: jistota pro terénní tým, klid pro vedení.",
    image: "/images/projects/5.webp",
    tags: ["React", "TypeScript", "Supabase", "Tailwind", "Vite"],
    year: "2025",
    client: "RiskLight",
    role: "Lead Developer & Designer",
    websiteUrls: [
      { label: "risklight.cz", url: "https://risklight.cz" },
      { label: "risklight.app", url: "https://risklight.app" },
    ],
  },
  {
    id: 2,
    slug: "adcalc",
    title: "AdCalc",
    category: "Prototyp",
    description: "Prototyp kalkulačky pro kalkulace reklamní výroby. Rychlé cenové nabídky, materiály a výrobní náklady na jednom místě.",
    fullDescription: "AdCalc je funkční prototyp nástroje pro kalkulace v reklamní výrobě. Umožňuje sestavovat cenové nabídky podle materiálů, formátů a výrobních technologií. Cíl: zrychlit přípravu nabídek a sjednotit kalkulační procesy v reklamní agentuře.",
    image: "/images/projects/AdCalc.webp",
    tags: ["React", "TypeScript", "Tailwind"],
    year: "2025",
    client: "Rekly",
    role: "Lead Developer",
    websiteUrls: [
      { label: "rekly.vercel.app", url: "https://rekly.vercel.app/" },
    ],
    quote: "Tento projekt byl výzvou především v zadání všech materiálů od dodavatelů tak, aby kalkulace fungovaly spolehlivě a přesně. Výsledek přinesl přehledný systém, který zrychluje přípravu nabídek.",
  },
  {
    id: 3,
    slug: "ddu-olomouc",
    title: "DDÚ Olomouc",
    category: "Redesign webu",
    description: "Kompletní redesign webu Dětského diagnostického ústavu v Olomouci. Moderní, přehledný a přístupný web pro instituci pečující o děti a mládež.",
    fullDescription: "Redesign webu DDÚ Olomouc přináší novou vizuální identitu a přehlednější strukturu informací.",
    image: "/images/projects/ddu-olomouc.webp",
    tags: ["HTML", "CSS"],
    year: "2026",
    client: "DDÚ Olomouc",
    role: "Developer & Designer",
    websiteUrls: [
      { label: "dduolomouc.cz (původní)", url: "https://www.dduolomouc.cz/" },
      { label: "ddu-olomouc-web.vercel.app (návrh)", url: "https://ddu-olomouc-web.vercel.app/" },
    ],
    quote: "Spolupráce na redesignu byla příjemná, důraz na přehlednost a přístupnost pro rodiče i pedagogy se promítl do každého detailu.",
  },
  {
    id: 4,
    slug: "decision-balance",
    title: "Decision Balance",
    category: "Koncept",
    description: "Mobilní aplikace pro strukturované rozhodování. Vážení možností, porovnávání kritérií a vizualizace výsledků. Pomáhá vybrat správnou volbu.",
    fullDescription: "Decision Balance je koncept mobilní aplikace pro podporu rozhodování. Uživatelé definují možnosti a kritéria, ohodnotí je a aplikace vizualizuje, která volba nejlépe odpovídá jejich prioritám. Koncept vyvinut v React Native pro ověření nápadu a UX.",
    image: "/images/projects/backround.webp",
    tags: ["React Native", "TypeScript", "AI integrace"],
    year: "2026",
    client: "Vlastní projekt",
    role: "Developer & Designer",
    quote: "Koncept vznikl jako ověření nápadu. React Native umožnil rychle prototypovat nativní mobilní zážitek.",
    galleryImages: [
      { src: "/images/projects/DB1.webp", alt: "Decision Balance, DB1" },
      { src: "/images/projects/DB2.webp", alt: "Decision Balance, DB2" },
    ],
  }
];

// --- Components ---

const Navbar = ({ theme, isProjectPage }: { theme: 'light' | 'dark', isProjectPage?: boolean }) => {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);

  const mobileNavItems = [
    { href: '#work',       label: lang === 'cs' ? fixCzechTypography(t.nav.work)     : fixDashes(t.nav.work) },
    { href: '#process',    label: lang === 'cs' ? fixCzechTypography(t.nav.process)  : fixDashes(t.nav.process) },
    { href: '#about',      label: lang === 'cs' ? fixCzechTypography(t.nav.about)    : fixDashes(t.nav.about) },
    { href: '#services',   label: lang === 'cs' ? fixCzechTypography(t.nav.services) : fixDashes(t.nav.services) },
    { href: CONTACT_EMAIL, label: lang === 'cs' ? fixCzechTypography(t.nav.contact)  : fixDashes(t.nav.contact) },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        {lang === 'cs' ? 'Přeskočit na obsah' : 'Skip to content'}
      </a>

      {/* ── Desktop / top navbar ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center gap-2 transition-[background-color,padding,color] duration-500 safe-area-inset-top min-w-0 nav-ios-gpu ${
          scrolled ? 'bg-black/10 nav-blur-active py-3' : 'bg-transparent'
        } ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        aria-label={lang === 'cs' ? 'Hlavní navigace' : 'Main navigation'}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group min-w-0 shrink"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Vibecooding, úvodní stránka"
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
            theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-display text-xl sm:text-2xl truncate">VIBECOODING</span>
        </Link>

        {/* Desktop links */}
        <div className={`hidden md:flex gap-6 lg:gap-8 text-xs font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
          theme === 'dark' ? 'text-white/70' : 'text-black/70'
        }`}>
          {!isProjectPage ? (
            <>
              <a href="#work"     className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.work)     : fixDashes(t.nav.work)}</a>
              <a href="#process"  className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.process)  : fixDashes(t.nav.process)}</a>
              <a href="#about"    className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.about)    : fixDashes(t.nav.about)}</a>
              <a href="#services" className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.services) : fixDashes(t.nav.services)}</a>
            </>
          ) : (
            <Link to="/" className={`hover:text-current transition-colors flex items-center gap-2 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>
              <ArrowLeft className="w-4 h-4" /> {lang === 'cs' ? fixCzechTypography(t.nav.backHome) : fixDashes(t.nav.backHome)}
            </Link>
          )}
        </div>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={CONTACT_EMAIL}
            className={`nav-cta hidden sm:inline-flex px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-[var(--color-vibe-orange)] hover:text-white'
                : 'bg-black text-white hover:bg-[var(--color-vibe-orange)]'
            }`}
          >
            {lang === 'cs' ? fixCzechTypography(t.nav.start) : fixDashes(t.nav.start)}
          </a>

          {/* Hamburger — 3 lines morph to X via CSS */}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className={`md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] rounded-lg transition-colors -mr-1 ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
            aria-label={mobileMenuOpen
              ? (lang === 'cs' ? fixCzechTypography(t.nav.closeMenu) : fixDashes(t.nav.closeMenu))
              : (lang === 'cs' ? fixCzechTypography(t.nav.openMenu)  : fixDashes(t.nav.openMenu))}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-150 ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* ── Full-screen mobile menu overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'cs' ? 'Navigační menu' : 'Navigation menu'}
        className={`fixed inset-0 z-[100] md:hidden bg-[var(--color-vibe-black)] text-white
          transition-[opacity,visibility] duration-300 backface-hidden
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        {/*
          Layout: fixed inset-0 → absolute positioning, no h-full tricks needed.
          Use absolute positioned sections: header top, CTA bottom, nav fills the middle.
          This is the most reliable cross-browser layout — zero flexbox min-height bugs.
        */}

        {/* ── Header (top) ── */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 h-16 border-b border-white/[0.07] bg-[var(--color-vibe-black)]"
          style={{ top: 'env(safe-area-inset-top, 0px)' }}
        >
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2.5 group"
            aria-label="Vibecooding, úvodní stránka"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Code2 className="w-5 h-5 text-black" />
            </div>
            <span className="font-display text-xl text-white">VIBECOODING</span>
          </Link>
          <button
            onClick={close}
            className="w-11 h-11 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all shrink-0"
            aria-label={lang === 'cs' ? fixCzechTypography(t.nav.closeMenu) : fixDashes(t.nav.closeMenu)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* ── CTA (bottom) — rendered before nav in DOM so z-index stacking is correct ── */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-5 bg-[var(--color-vibe-black)]"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <a
            href={CONTACT_EMAIL}
            onClick={close}
            className="flex items-center justify-center gap-2.5 w-full min-h-[54px] rounded-2xl bg-[var(--color-vibe-orange)] text-black text-sm font-bold uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all duration-200"
          >
            {lang === 'cs' ? fixCzechTypography(t.nav.start) : fixDashes(t.nav.start)}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
        </div>

        {/* ── Nav items (middle — fills space between header and CTA) ── */}
        <nav
          aria-label={lang === 'cs' ? 'Hlavní navigace' : 'Main navigation'}
          className="absolute left-0 right-0 overflow-y-auto px-5"
          style={{
            top: 'calc(env(safe-area-inset-top, 0px) + 4rem)',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)',
          }}
        >
          {isProjectPage && (
            <div className="pt-6 pb-2">
              <Link
                to="/"
                onClick={close}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === 'cs' ? fixCzechTypography(t.nav.backHome) : fixDashes(t.nav.backHome)}
              </Link>
            </div>
          )}
          <ul className="flex flex-col py-4">
            {mobileNavItems.map((item, i) => (
              <li key={item.href} className="border-b border-white/[0.07] last:border-0">
                <a
                  href={item.href}
                  onClick={close}
                  className="group flex items-center gap-5 py-5 w-full active:opacity-60 transition-opacity duration-100"
                >
                  <span className="text-[11px] font-bold tabular-nums text-white/25 w-8 shrink-0 leading-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[1.7rem] leading-none text-white/85 group-hover:text-white transition-colors duration-200 flex-1">
                    {item.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[var(--color-vibe-orange)] group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

const MOBILE_BREAKPOINT = 768;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : true
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

const Hero = () => {
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollRange = isMobile ? [0, 400] : [0, 600];
  const y1 = useTransform(scrollY, scrollRange, isMobile ? [0, 80] : [0, 180]);
  const y2 = useTransform(scrollY, scrollRange, isMobile ? [0, -60] : [0, -140]);
  const rotate = useTransform(scrollY, scrollRange, isMobile ? [0, 6] : [0, 12]);

  const fadeIn = {
    initial: isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: (delay = 0) => isMobile ? { duration: 0 } : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  };

  const useStaticBlobs = prefersReducedMotion || isMobile;

  return (
    <section className="hero-section relative min-h-[100dvh] min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 pt-nav-safe pb-16 sm:pb-20 md:pb-24 overflow-hidden backface-hidden">
      {useStaticBlobs ? (
        <>
          <div className="absolute top-1/4 -right-10 sm:-right-20 w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] bg-[var(--color-vibe-orange)] rounded-full blur-[80px] sm:blur-[120px] opacity-[0.12] backface-hidden will-change-transform" />
          <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-[40vw] sm:w-[30vw] h-[40vw] sm:h-[30vw] bg-blue-600 rounded-full blur-[80px] sm:blur-[120px] opacity-[0.08] backface-hidden will-change-transform" />
        </>
      ) : (
        <>
          <motion.div
            style={{ y: y1, rotate, willChange: 'transform' }}
            className="absolute top-1/4 -right-10 sm:-right-20 w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] bg-[var(--color-vibe-orange)] rounded-full blur-[80px] sm:blur-[120px] opacity-[0.12] backface-hidden"
          />
          <motion.div
            style={{ y: y2, willChange: 'transform' }}
            className="absolute bottom-1/4 -left-10 sm:-left-20 w-[40vw] sm:w-[30vw] h-[40vw] sm:h-[30vw] bg-blue-600 rounded-full blur-[80px] sm:blur-[120px] opacity-[0.08] backface-hidden"
          />
        </>
      )}

      <div className="hero-content relative z-10 max-w-4xl mx-auto w-full text-center">
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] sm:text-[clamp(2.5rem,7vw,4.25rem)] md:text-[clamp(3rem,8vw,5rem)] font-bold leading-[1.1] mb-6 sm:mb-8">
          <motion.span
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition(0)}
            className="block bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-transparent"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.h1) : fixDashes(t.hero.h1)}
          </motion.span>
        </h1>

        <motion.p
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition(0.12)}
          className="text-base sm:text-lg md:text-xl font-normal text-slate-400 sm:text-slate-400 mb-10 sm:mb-12 max-w-2xl mx-auto leading-[1.65]"
        >
          {lang === 'cs' ? fixCzechTypography(t.hero.subheadline) : fixDashes(t.hero.subheadline)}
        </motion.p>

        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition(0.24)}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5"
        >
          <a
            href={CONTACT_EMAIL}
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 hover:shadow-[0_0_30px_rgba(242,125,38,0.4)] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-300 shadow-lg min-w-[180px] sm:min-w-0"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.ctaPrimary) : fixDashes(t.hero.ctaPrimary)}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold border-2 border-white/25 text-white/90 hover:bg-white/5 hover:border-white/40 transition-[background-color,border-color] duration-300 min-w-[180px] sm:min-w-0"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.ctaSecondary) : fixDashes(t.hero.ctaSecondary)}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const PROCESS_STEPS = [
  { icon: Lightbulb, key: 'step1' as const },
  { icon: PenTool, key: 'step2' as const },
  { icon: Layers, key: 'step3' as const },
  { icon: Code2, key: 'step4' as const },
  { icon: Server, key: 'step5' as const },
];

const ProcessSection = () => {
  const { t, lang } = useLanguage();
  return (
    <section id="process" className="relative bg-slate-50 text-black py-20 sm:py-28 md:py-36 lg:py-48" aria-labelledby="process-heading">
      <h2 id="process-heading" className="sr-only">{lang === 'cs' ? fixCzechTypography(t.process.title) : fixDashes(t.process.title)}</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 sm:mb-20 text-center"
        >
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.08] mb-4">
            {lang === 'cs' ? fixCzechTypography(t.process.title) : fixDashes(t.process.title)}
          </h3>
          <p className="text-lg sm:text-xl text-black/70 max-w-2xl mx-auto">
            {lang === 'cs' ? fixCzechTypography(t.process.subtitle) : fixDashes(t.process.subtitle)}
            <br />
            {lang === 'cs' ? fixCzechTypography(t.process.subtitle2) : fixDashes(t.process.subtitle2)}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 sm:gap-10 md:gap-6">
          {PROCESS_STEPS.map(({ icon: Icon, key }, idx) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-vibe-orange)]/15 flex items-center justify-center text-[var(--color-vibe-orange)] mb-5 shrink-0">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-display text-base sm:text-lg uppercase text-black mb-2">
                {lang === 'cs' ? fixCzechTypography(t.process[`${key}Title`]) : fixDashes(t.process[`${key}Title`])}
              </h4>
              <p className="text-sm sm:text-base text-black/70 leading-[1.6]">
                {lang === 'cs' ? fixCzechTypography(t.process[`${key}Text`]) : fixDashes(t.process[`${key}Text`])}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" aria-hidden />
    </section>
  );
};

const WorkSection = () => {
  const { t, lang } = useLanguage();
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
      {/* Oddělovač portfolia od sekce O mně */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" aria-hidden />
    </section>
  );
};

function ProjectCard({ project, index, isMobile }: { project: Project, index: number; isMobile: boolean }) {
  const { t, lang } = useLanguage();
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
            loading={index === 0 && !isMobile ? "eager" : "lazy"}
            fetchPriority={index === 0 && !isMobile ? "high" : undefined}
            decoding="async"
            className="w-full h-full object-cover rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.08] backface-hidden"
            referrerPolicy="no-referrer"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center ios-backdrop-blur backface-hidden">
            <div className="overflow-hidden mb-4">
              <motion.div 
                initial={{ y: "100%" }}
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

const SERVICES_CARDS = [
  { icon: Zap, key: 'card1' as const },
  { icon: Globe, key: 'card2' as const },
  { icon: Rocket, key: 'card3' as const },
];

const ServicesPricingSection = () => {
  const { t, lang } = useLanguage();

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {SERVICES_CARDS.map(({ icon: Icon, key }, idx) => {
            const bullets = t.services[`${key}Bullets` as keyof typeof t.services] as string[];
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

        {/* Rychlý audit zdarma - lead magnet */}
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

const AboutSection = () => {
  const { t, lang } = useLanguage();
  return (
    <section id="about" className="relative py-24 sm:py-32 md:py-40 lg:py-48 overflow-hidden backface-hidden">
      {/* Tmavé pozadí + jemný gradient - vizuální oddělení od portfolia */}
      <div className="absolute inset-0 bg-[var(--color-vibe-black)] backface-hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(242,125,38,0.06),transparent_50%)] backface-hidden" aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-start">
          {/* Levý sloupec: fotka + hodnoty */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-10 sm:space-y-12"
          >
            <div className="aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden ring-1 ring-white/10">
              <img
                src="/images/projects/FOTKA.webp"
                srcSet={getImageSrcSet("/images/projects/FOTKA.webp")}
                sizes="(max-width: 1024px) 100vw, 45vw"
                alt="Přemysl Horák"
                width={500}
                height={625}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Hodnoty jako karty */}
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

          {/* Pravý sloupec: text */}
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

const CtaSection = () => {
  const { t, lang } = useLanguage();
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

// --- Competitive Advantage + FAQ Block ---
const COMPETITIVE_CARDS = [
  { icon: Palette, key: 'card4' as const },   // Design i architektura
  { icon: Brain, key: 'card2' as const },     // Mozek místo rukou
  { icon: ShieldCheck, key: 'card3' as const }, // Čistý a bezchybný kód
  { icon: Zap, key: 'card1' as const },      // Bleskový start
];

const CompetitiveAdvantageSection = () => {
  const { t, lang } = useLanguage();
  return (
    <section id="competitive-advantage" className="relative py-20 sm:py-28 md:py-36 lg:py-48 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden backface-hidden">
      {/* Gradient background + glow */}
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

const FAQSection = () => {
  const { t, lang } = useLanguage();
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

const FORMSPREE_URL = 'https://formspree.io/f/mjkebwwp';
const RECAPTCHA_SITE_KEY = '6LdmmJEsAAAAAJuJYP_R6yhyFrOGTsKF1A8ml6ZF';

const ContactSection = () => {
  const { t, lang } = useLanguage();
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

    if (!recaptchaToken) {
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('g-recaptcha-response', recaptchaToken);

      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setFormStatus('success');
        formRef.current?.reset();
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const f = t.contact.form;

  return (
  <section id="contact" className="py-24 sm:py-32 md:py-40 lg:py-52 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-orange)] text-black relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/5 to-transparent" />
    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase leading-[1.08] mb-8 sm:mb-10">
          {lang === 'cs' ? fixCzechTypography(t.contact.title) : fixDashes(t.contact.title)}
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-light mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
          {lang === 'cs' ? fixCzechTypography(t.contact.intro) : fixDashes(t.contact.intro)}
        </p>
      </motion.div>

      {/* Form — centered */}
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-black/[0.06] backdrop-blur-sm rounded-2xl p-8 sm:p-10 md:p-12 shadow-sm border border-black/10 text-center flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-black">
                {lang === 'cs' ? fixCzechTypography(f.thankYouTitle) : fixDashes(f.thankYouTitle)}
              </h3>
              <p className="text-base sm:text-lg text-black/70 max-w-md leading-relaxed">
                {lang === 'cs' ? fixCzechTypography(f.thankYouText) : fixDashes(f.thankYouText)}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setFormStatus('idle');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-black transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === 'cs' ? fixCzechTypography(f.backToSite) : fixDashes(f.backToSite)}
              </motion.button>
            </motion.div>
          ) : (
          <form
            ref={formRef}
            action={FORMSPREE_URL}
            method="POST"
            onSubmit={handleSubmit}
            className="bg-black/[0.06] backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-black/10 space-y-5"
          >
            <input type="hidden" name="_subject" value={lang === 'cs' ? 'Nová zpráva z webu vibecooding.cz' : 'New message from vibecooding.cz'} />

            <div>
              <label htmlFor="full-name" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.name}</label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                placeholder={f.namePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.email} *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={f.emailPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.subject}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder={f.subjectPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold uppercase tracking-[0.15em] mb-2">{f.message} *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder={f.messagePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 focus:bg-white/80 transition-all duration-200 resize-y min-h-[120px]"
              />
            </div>

            <div className="flex justify-center">
              <Suspense fallback={<div className="h-[78px]" />}>
                <LazyReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  hl={lang}
                  theme="light"
                  onChange={(token: string | null) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </Suspense>
            </div>

            <motion.button
              type="submit"
              disabled={formStatus === 'sending' || !recaptchaToken}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-black text-white px-8 py-4.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formStatus === 'sending' ? (
                <>{f.sending}</>
              ) : (
                <><Send className="w-4 h-4" /> {f.submit}</>
              )}
            </motion.button>

            {formStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm font-medium text-red-900 bg-red-100/80 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {lang === 'cs' ? fixCzechTypography(f.error) : fixDashes(f.error)}
              </motion.div>
            )}

            <p className="text-[11px] text-black/50 text-center pt-1">
              {lang === 'cs' ? fixCzechTypography(f.gdpr) : fixDashes(f.gdpr)}
            </p>
          </form>
          )}
        </motion.div>

        {/* Email link — below form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={CONTACT_EMAIL}
            className="text-lg sm:text-xl md:text-2xl font-bold border-b-4 border-black pb-2 hover:text-white hover:border-white transition-colors duration-300 break-words"
            aria-label={lang === 'cs' ? 'Napsat e-mail na horakpremysl85@gmail.com' : 'Send email to horakpremysl85@gmail.com'}
          >
            horakpremysl85@gmail.com
          </motion.a>
        </motion.div>
      </div>
    </div>
  </section>
  );
};

const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, url: 'https://www.linkedin.com/in/p%C5%99emysl-hor%C3%A1k-0590a5326' },
  { name: 'Behance', icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.268 14.584h-4.841c.314 1.813 2.142 2.021 3.272 1.233.194-.134.541-.503.541-.503l1.705 1.307s-.746 1.059-1.589 1.662c-1.356.971-3.674 1.409-5.49.615-2.845-1.245-2.976-4.413-2.134-6.62.981-2.575 4.477-3.179 6.726-1.511 2.212 1.638 2.036 5.271 1.81 6.317zm-1.691-1.896c.144-1.419-.851-2.423-2.104-2.403-1.272.019-2.24 1.022-2.433 2.403h4.537zm-18.677 4.712h-2.9v-10.2h5.5c2.35 0 3.1 1.25 3.1 2.35 0 1.1-.9 1.9-1.8 2.15 1.1.35 2.1 1.4 2.1 2.85 0 1.45-1.15 2.85-3.5 2.85h-2.5zm0-6h2.2c.8 0 1.2-.45 1.2-1.1 0-.65-.4-1.1-1.2-1.1h-2.2v2.2zm0 3.8h2.5c.85 0 1.4-.45 1.4-1.25 0-.8-.55-1.25-1.4-1.25h-2.5v2.5zm15.1-6.4h4.8v1.1h-4.8v-1.1z"/>
    </svg>
  ), url: 'https://www.behance.net/dobryux' },
  { name: 'GitHub', icon: <Github className="w-4 h-4" />, url: 'https://github.com/PremaHor' },
  { name: 'X', icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293l13.314 17.411z"/>
    </svg>
  ), url: 'https://x.com/horakpremysl85' },
];

const Footer = () => {
  const { t, lang } = useLanguage();
  return (
  <footer className="py-10 sm:py-14 px-4 sm:px-6 md:px-8 border-t border-white/10 text-center">
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6">
      {SOCIAL_LINKS.map(social => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]"
          aria-label={`${social.name}, ${lang === 'cs' ? 'otevřít v novém okně' : 'open in new window'}`}
        >
          {social.icon} {social.name}
        </a>
      ))}
    </div>
    <Link to="/ochrana-soukromi" className="text-white/40 hover:text-white/80 transition-colors block mb-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
      {lang === 'cs' ? fixCzechTypography(t.footer.privacyLink) : fixDashes(t.footer.privacyLink)}
    </Link>
    <p className="text-white/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
      {lang === 'cs' ? fixCzechTypography(t.footer.copyright) : fixDashes(t.footer.copyright)}
    </p>
  </footer>
  );
};

// --- Project Structured Content (RiskLight, DDÚ, etc.) ---
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

const ProjectStructuredContent = ({ tr, lang }: { tr: { goalTitle: string; goal: string; solutionTitle: string; solution: string; benefitsTitle: string; benefits: string[] }; lang: 'cs' | 'en' }) => (
  <div className="space-y-8 sm:space-y-10 mb-10 sm:mb-16">
    <div>
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(tr.goalTitle) : fixDashes(tr.goalTitle)}</h3>
      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] font-light">
        {renderWithBold(tr.goal, lang)}
      </p>
    </div>
    <div>
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-bold text-white/50 mb-3 sm:mb-4">{lang === 'cs' ? fixCzechTypography(tr.solutionTitle) : fixDashes(tr.solutionTitle)}</h3>
      <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] font-light">
        {renderWithBold(tr.solution, lang)}
      </p>
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

// --- Pages ---

const HomePage = ({ navTheme }: { navTheme: 'light' | 'dark' }) => (
  <>
    <Navbar theme={navTheme} />
    <main id="main-content" role="main">
      <Hero />
      <ProcessSection />
      <WorkSection />
      <AboutSection />
      <ServicesPricingSection />
      <CtaSection />
      <CompetitiveAdvantageSection />
      <FAQSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const projectIndex = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[projectIndex];
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const tr = project ? t.projects[project.slug as keyof typeof t.projects] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setLightboxIndex(null);
      };
      window.addEventListener('keydown', onEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [lightboxIndex]);

  if (!project) return <div>{lang === 'cs' ? fixCzechTypography(t.project.notFound) : fixDashes(t.project.notFound)}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[var(--color-vibe-black)] text-white"
    >
      <Navbar theme="dark" isProjectPage />
      
      <main id="main-content" role="main" className="pt-nav-safe pb-0">
        {/* Project Hero */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 mb-20 sm:mb-24 md:mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden mb-8">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[var(--color-vibe-orange)] font-mono text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] block"
              >
                {lang === 'cs' ? fixCzechTypography(tr?.category ?? project.category) : fixDashes(tr?.category ?? project.category ?? '')} / {project.year}
              </motion.span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-[clamp(1.75rem,8vw,3rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[1.08] mb-12 sm:mb-20"
            >
              {lang === 'cs' ? fixCzechTypography(project.title) : fixDashes(project.title)}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[16/9] w-full rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white/5 shadow-2xl"
            >
              <img 
                src={project.image} 
                srcSet={getImageSrcSet(project.image)}
                sizes="(max-width: 768px) 100vw, 1200px"
                alt={lang === 'cs' ? fixCzechTypography(project.title) : fixDashes(project.title)} 
                width={1200}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {project.galleryImages && project.galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 sm:mt-16 md:mt-20"
              >
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {project.galleryImages.map((img, idx) => (
                    <motion.button
                      key={img.src}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setLightboxIndex(idx)}
                      className="overflow-hidden rounded-xl sm:rounded-2xl text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-vibe-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-vibe-black)]"
                      aria-label={lang === 'cs' ? `Zvětšit obrázek ${idx + 1}` : `Enlarge image ${idx + 1}`}
                    >
                      <img
                        src={img.src}
                        srcSet={getImageSrcSet(img.src)}
                        sizes={idx === 0 ? '(max-width: 768px) 100vw, 1200px' : '(max-width: 768px) 50vw, 600px'}
                        alt={img.alt}
                        width={1200}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {lightboxIndex !== null && project.galleryImages && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 safe-area-inset"
                  onClick={() => setLightboxIndex(null)}
                  role="dialog"
                  aria-modal="true"
                  aria-label={lang === 'cs' ? 'Zvětšený náhled obrázku' : 'Enlarged image view'}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={lang === 'cs' ? 'Zavřít' : 'Close'}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative max-w-full max-h-[90vh] w-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={project.galleryImages[lightboxIndex].src}
                      srcSet={getImageSrcSet(project.galleryImages[lightboxIndex].src)}
                      sizes="100vw"
                      alt={project.galleryImages[lightboxIndex].alt}
                      className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Project Info */}
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
                      <span key={tag} className="px-3 sm:px-5 py-1.5 sm:py-2 border border-white/10 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest bg-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>
               {project.websiteUrls && project.websiteUrls.length > 0 && (
                 <div>
                   <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">{lang === 'cs' ? fixCzechTypography(t.project.website) : fixDashes(t.project.website)}</h4>
                   <div className="flex flex-wrap gap-3">
                     {project.websiteUrls.map(({ label, url }) => (
                       <a
                         key={url}
                         href={url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 min-h-[44px] border border-white/20 rounded-full text-sm font-mono text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all break-words max-w-full"
                       >
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

        {/* Next Project CTA */}
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

export default function App() {
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const lenisRef = useRef<{ destroy: () => void } | null>(null);
  const lenisFrameCancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) {
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        });
        lenisRef.current = lenis;

        // Synchronizace s Motion frame loopem - eliminuje problikávání při scrollu
        const onFrame = (data: { timestamp?: number }) => {
          lenis.raf(data.timestamp ?? performance.now());
        };
        frame.update(onFrame, true);
        lenisFrameCancelRef.current = () => cancelFrame(onFrame);
      });
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
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage navTheme={navTheme} />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/ochrana-soukromi" element={<Suspense fallback={null}><PrivacyPage /></Suspense>} />
            <Route path="*" element={<Suspense fallback={null}><NotFoundPage /></Suspense>} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <CookieConsentBanner />
    </div>
  );
}
