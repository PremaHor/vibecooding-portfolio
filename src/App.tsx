import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { fixCzechTypography } from './utils/czechTypography';
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
  Cookie,
  Rocket
} from 'lucide-react';

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
}

// --- Constants ---
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
    fullDescription: "Redesign webu DDÚ Olomouc přináší novou vizuální identitu a přehlednější strukturu informací. Zařízení poskytuje diagnostickou, poradenskou a výchovně vzdělávací péči pro děti ve věku 3–18 let. Cílem bylo vytvořit web, který rodičům a pedagogům usnadní orientaci v nabízených službách a zároveň působí důvěryhodně a profesionálně. Společně jsme navrhli čistý layout, srozumitelnou navigaci a responzivní řešení pro všechny typy zařízení. Redesignem jsme dosáhli: moderního vzhledu místo zastaralého table layoutu, přehledné hierarchie informací (škola, SVP, jídelna), rychlého přístupu k často hledaným sekcím (Pro rodiče, Dokumenty, Kontakt), plné responzivity pro mobily a tablety, srozumitelné navigace s jasným odlišením sekcí, výrazně rychlejšího načítání díky lehkému HTML/CSS kódu, lepšího SEO a vyhledávatelnosti v Google, vyšší přístupnosti pro čtečky obrazovky a slabozraké a přehlednějšího uspořádání kontaktních údajů.",
    image: "/images/projects/ddu-olomouc.webp",
    tags: ["HTML", "CSS"],
    year: "2026",
    client: "DDÚ Olomouc",
    role: "Developer & Designer",
    websiteUrls: [
      { label: "dduolomouc.cz (původní)", url: "https://www.dduolomouc.cz/" },
      { label: "ddu-olomouc-web.vercel.app (návrh)", url: "https://ddu-olomouc-web.vercel.app/" },
    ],
    quote: "Spolupráce na redesignu byla příjemná – důraz na přehlednost a přístupnost pro rodiče i pedagogy se promítl do každého detailu.",
  },
  {
    id: 4,
    slug: "void-interface",
    title: "VOID INTERFACE",
    category: "UI/UX",
    description: "Minimalistický operační systém v prohlížeči pro kreativní kodéry.",
    fullDescription: "Void Interface je experiment v oblasti uživatelského rozhraní. Jde o kompletní pracovní prostředí běžící v prohlížeči, které se zaměřuje na eliminaci vyrušení. Každý prvek byl navržen s ohledem na 'flow state' vývojáře.",
    image: "https://picsum.photos/seed/void/1200/800",
    tags: ["TypeScript", "Canvas API", "Motion"],
    year: "2024",
    client: "Open Source Project",
    role: "UI Engineer"
  }
];

// --- Components ---

const Navbar = ({ theme, isProjectPage }: { theme: 'light' | 'dark', isProjectPage?: boolean }) => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = !isProjectPage ? (
    <>
      <a href="#work" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{t.nav.work}</a>
      <a href="#services" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{t.nav.services}</a>
      <a href="#pricing" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{t.nav.pricing}</a>
      <a href="#contact" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{t.nav.contact}</a>
    </>
  ) : (
    <Link to="/" onClick={closeMobileMenu} className={`hover:text-current transition-colors flex items-center gap-2 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>
      <ArrowLeft className="w-4 h-4" /> {t.nav.backHome}
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center transition-all duration-500 safe-area-inset-top ${
        scrolled ? 'bg-black/10 backdrop-blur-xl py-3' : 'bg-transparent'
      } ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
            theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-display text-xl sm:text-2xl">VIBECOODING</span>
        </Link>
        
        <div className={`hidden md:flex gap-6 lg:gap-8 text-xs font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
          theme === 'dark' ? 'text-white/70' : 'text-black/70'
        }`}>
          {navLinks}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <a 
            href="mailto:horakpremysl85@gmail.com"
            className={`hidden sm:inline-flex px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg ${
              theme === 'dark' 
                ? 'bg-white text-black hover:bg-[var(--color-vibe-orange)] hover:text-white' 
                : 'bg-black text-white hover:bg-[var(--color-vibe-orange)]'
            }`}
          >
            {t.nav.start}
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 -mr-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - compact bottom sheet */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: mobileMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-[var(--color-vibe-black)] border-t border-white/10 rounded-t-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-white safe-area-inset-bottom"
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" aria-hidden />
          <nav className="flex flex-col gap-1">
            {!isProjectPage ? (
              <>
                <a href="#work" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  {t.nav.work}
                </a>
                <a href="#services" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  {t.nav.services}
                </a>
                <a href="#pricing" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  {t.nav.pricing}
                </a>
                <a href="#contact" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  {t.nav.contact}
                </a>
              </>
            ) : (
              <Link to="/" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> {t.nav.backHome}
              </Link>
            )}
          </nav>
          <a 
            href="mailto:horakpremysl85@gmail.com"
            onClick={closeMobileMenu}
            className="mt-4 block py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-[0.15em] bg-[var(--color-vibe-orange)] text-black text-center hover:bg-[var(--color-vibe-orange)]/90 active:scale-[0.98] transition-all"
          >
            {t.nav.start}
          </a>
        </motion.div>
      </div>
    </>
  );
};

const Hero = () => {
  const { t, lang } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 15]);

  return (
    <section className="relative min-h-[100dvh] min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-24 sm:pt-28 pb-12 sm:pb-16 md:pb-20 overflow-hidden safe-area-inset">
      {/* Animated Background Blobs */}
      <motion.div 
        style={{ y: y1, rotate }}
        className="absolute top-1/4 -right-10 sm:-right-20 w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] bg-[var(--color-vibe-orange)] rounded-full blur-[100px] sm:blur-[120px] opacity-20 animate-pulse" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-1/4 -left-10 sm:-left-20 w-[40vw] sm:w-[30vw] h-[40vw] sm:h-[30vw] bg-blue-600 rounded-full blur-[100px] sm:blur-[120px] opacity-10" 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 border border-white/20 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold mb-8 sm:mb-12 text-white/70 bg-white/5 backdrop-blur-sm">
            {t.hero.available}
          </span>
        </motion.div>
        
        <h1 className="font-display text-[clamp(1.75rem,5vw,3rem)] sm:text-[clamp(2rem,6vw,3.5rem)] md:text-[clamp(2.25rem,5vw,4rem)] leading-[1.15] mb-6 sm:mb-8 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {lang === 'cs' ? fixCzechTypography(t.hero.h1) : t.hero.h1}
          </motion.span>
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl font-light text-white/90 mb-10 sm:mb-12 max-w-2xl leading-[1.6]"
        >
          {lang === 'cs' ? fixCzechTypography(t.hero.subheadline) : t.hero.subheadline}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 sm:mb-20"
        >
          <a 
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 active:scale-[0.98] transition-all shadow-lg"
          >
            {t.hero.ctaPrimary}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a 
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap gap-5 sm:gap-10 items-center"
          >
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[var(--color-vibe-black)] bg-gray-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="" width={100} height={100} loading="lazy" decoding="async" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{t.hero.workedWith}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center md:justify-end mt-12 md:mt-0"
          >
            <button 
              onClick={() => {
                const el = document.getElementById('work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative group cursor-pointer border-none bg-transparent p-0 outline-none"
              aria-label="Scroll to work"
            >
              <div className="absolute inset-0 bg-[var(--color-vibe-orange)] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <ArrowRight className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 rotate-90 transition-transform duration-700 group-hover:scale-110 group-hover:text-[var(--color-vibe-orange)]" />
                </motion.div>
                <div className="absolute inset-3 sm:inset-4 border border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-[var(--color-vibe-orange)] text-black font-bold text-[9px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                {t.hero.explore}
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WorkSection = () => {
  return (
    <section id="work" className="relative bg-white text-black py-20 sm:py-28 md:py-36 lg:py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-20 md:gap-24 lg:gap-32">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ProjectCard({ project, index }: { project: Project, index: number }) {
  const { t } = useLanguage();
  const tr = t.projects[project.slug as keyof typeof t.projects];
  const category = tr?.category ?? project.category;
  
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link to={`/project/${project.slug}`} className="block relative">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] mb-6 sm:mb-8 bg-gray-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-700">
          <img 
            src={project.image} 
            alt={project.title}
            width={1200}
            height={800}
            loading={index < 2 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            decoding="async"
            className="w-full h-full object-cover rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.08]"
            referrerPolicy="no-referrer"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="overflow-hidden mb-4">
              <motion.div 
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                className="text-white text-xs font-bold uppercase tracking-[0.5em]"
              >
                {t.work.viewCaseStudy}
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
              {category}
            </span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase leading-[1.05] group-hover:translate-x-2 transition-transform duration-300">
            {project.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] px-3 py-1.5 border border-black/10 rounded-full font-mono uppercase tracking-[0.15em] bg-white group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
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
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 sm:py-28 md:py-36 lg:py-48 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
      <div id="pricing" className="absolute top-0 left-0 -translate-y-24" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase mb-16 sm:mb-20 md:mb-24 leading-[1.08] text-white"
        >
          {t.services.title}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_CARDS.map(({ icon: Icon, key }, idx) => {
            const isExpanded = expandedId === idx;
            return (
              <motion.article
                key={key}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex flex-col border rounded-2xl lg:rounded-[1.75rem] overflow-hidden cursor-pointer select-none transition-colors ${
                  isExpanded 
                    ? 'border-[var(--color-vibe-orange)]/50 bg-white/[0.06]' 
                    : 'border-white/10 hover:bg-white/[0.03] hover:border-white/20'
                }`}
                onClick={() => setExpandedId(isExpanded ? null : idx)}
              >
                <div className="p-6 sm:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 text-white/50"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl uppercase mt-4 text-white/95">
                    {t.services[`${key}Title`]}
                  </h3>
                  <p className="text-sm text-white/70 mt-2 leading-[1.5]">
                    {lang === 'cs' ? fixCzechTypography(t.services[`${key}Subtitle`]) : t.services[`${key}Subtitle`]}
                  </p>
                  <p className="text-[var(--color-vibe-orange)] font-bold text-lg sm:text-xl mt-4">
                    {t.services[`${key}Price`]}
                  </p>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-white/10">
                        <p className="text-white/80 text-sm sm:text-base leading-[1.7] mb-4">
                          {lang === 'cs' ? fixCzechTypography(t.services[`${key}Detail`]) : t.services[`${key}Detail`]}
                        </p>
                        {key === 'card2' && (
                          <p className="text-white/70 text-sm leading-[1.6] mb-6">
                            {lang === 'cs' ? fixCzechTypography(t.services.card2Bonus) : t.services.card2Bonus}
                          </p>
                        )}
                        <a
                          href="#contact"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-[0.2em] bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 transition-all w-fit"
                        >
                          {t.services[`${key}Cta`]}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  const { t, lang } = useLanguage();
  return (
    <section id="cta" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-black)] text-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase mb-6 sm:mb-8 leading-[1.12]"
        >
          {t.cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-white/80 mb-12 sm:mb-16 leading-[1.7]"
        >
          {lang === 'cs' ? fixCzechTypography(t.cta.text) : t.cta.text}
        </motion.p>
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 transition-all"
        >
          {t.contact.writeMessage}
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { t, lang } = useLanguage();
  return (
  <section id="contact" className="py-24 sm:py-32 md:py-40 lg:py-52 px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-vibe-orange)] text-black relative overflow-hidden">
    {/* Decorative Elements */}
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/5 to-transparent" />
    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
    
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase leading-[1.08] mb-8 sm:mb-10">
          {t.contact.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-light mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
          {lang === 'cs' ? fixCzechTypography(t.contact.intro) : t.contact.intro}
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 sm:gap-12 mb-20 sm:mb-24 md:mb-32">
        <motion.a 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          href="mailto:horakpremysl85@gmail.com" 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold border-b-4 border-black pb-3 hover:text-white hover:border-white transition-all duration-500 break-all text-center"
        >
          horakpremysl85@gmail.com
        </motion.a>
        
        <div className="hidden md:block w-3 h-3 bg-black rounded-full animate-pulse shrink-0" />
        
        <motion.a 
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          href="mailto:horakpremysl85@gmail.com"
          className="bg-black text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-full text-sm sm:text-base md:text-lg font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-black transition-all duration-500 text-center"
        >
          {t.contact.writeMessage}
        </motion.a>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16 border-t border-black/20 pt-12 sm:pt-16">
        {[
          { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/p%C5%99emysl-hor%C3%A1k-0590a5326' },
          { name: 'Behance', icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.268 14.584h-4.841c.314 1.813 2.142 2.021 3.272 1.233.194-.134.541-.503.541-.503l1.705 1.307s-.746 1.059-1.589 1.662c-1.356.971-3.674 1.409-5.49.615-2.845-1.245-2.976-4.413-2.134-6.62.981-2.575 4.477-3.179 6.726-1.511 2.212 1.638 2.036 5.271 1.81 6.317zm-1.691-1.896c.144-1.419-.851-2.423-2.104-2.403-1.272.019-2.24 1.022-2.433 2.403h4.537zm-18.677 4.712h-2.9v-10.2h5.5c2.35 0 3.1 1.25 3.1 2.35 0 1.1-.9 1.9-1.8 2.15 1.1.35 2.1 1.4 2.1 2.85 0 1.45-1.15 2.85-3.5 2.85h-2.5zm0-6h2.2c.8 0 1.2-.45 1.2-1.1 0-.65-.4-1.1-1.2-1.1h-2.2v2.2zm0 3.8h2.5c.85 0 1.4-.45 1.4-1.25 0-.8-.55-1.25-1.4-1.25h-2.5v2.5zm15.1-6.4h4.8v1.1h-4.8v-1.1z"/>
            </svg>
          ), url: 'https://www.behance.net/dobryux' },
          { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: 'https://github.com/PremaHor' },
          { name: 'X (Twitter)', icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293l13.314 17.411z"/>
            </svg>
          ), url: 'https://x.com/horakpremysl85' }
        ].map(social => (
          <motion.a 
            key={social.name}
            whileHover={{ y: -5, color: "#FFFFFF" }}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 sm:gap-3 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-[11px] transition-colors"
          >
            {social.icon} {social.name}
          </motion.a>
        ))}
      </div>
    </div>
  </section>
  );
};

const Footer = () => {
  const { t, lang } = useLanguage();
  return (
  <footer id="privacy" className="py-8 sm:py-12 px-4 sm:px-6 md:px-8 border-t border-white/10 text-center text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">
    {lang === 'cs' ? fixCzechTypography(t.footer.copyright) : t.footer.copyright}
  </footer>
  );
};

const COOKIE_CONSENT_KEY = 'vibecooding-cookie-consent';

const CookieBar = () => {
  const { t, lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true, timestamp: Date.now() }));
    setIsVisible(false);
  };

  const declineOptional = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false, timestamp: Date.now() }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6 safe-area-inset-bottom"
      >
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-[1.5rem] bg-[var(--color-vibe-black)]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
            <div className="flex gap-4 flex-1">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-vibe-orange)]/20 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-[var(--color-vibe-orange)]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg sm:text-xl mb-1">{t.cookie.title}</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  {lang === 'cs' ? fixCzechTypography(t.cookie.text) : t.cookie.text}{' '}
                  <a href="#privacy" className="text-[var(--color-vibe-orange)] hover:underline">{t.cookie.moreInfo}</a>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={declineOptional}
                className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                {t.cookie.essentialOnly}
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-[var(--color-vibe-orange)] text-white hover:bg-[var(--color-vibe-orange)]/90 transition-colors shadow-lg"
              >
                {t.cookie.acceptAll}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Pages ---

const HomePage = ({ navTheme }: { navTheme: 'light' | 'dark' }) => (
  <>
    <Navbar theme={navTheme} />
    <main>
      <Hero />
      <WorkSection />
      <ServicesPricingSection />
      <CtaSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const projectIndex = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[projectIndex];
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const tr = project ? t.projects[project.slug as keyof typeof t.projects] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <div>{t.project.notFound}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[var(--color-vibe-black)] text-white"
    >
      <Navbar theme="dark" isProjectPage />
      
      <main className="pt-24 sm:pt-28 md:pt-32 pb-0">
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
                {(tr?.category ?? project.category)} / {project.year}
              </motion.span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[1.08] mb-12 sm:mb-20"
            >
              {project.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[16/9] w-full rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white/5 shadow-2xl"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                width={1200}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </section>

        {/* Project Info */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 mb-24 sm:mb-32 md:mb-40">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20 sm:gap-28 md:gap-36">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase mb-10 sm:mb-14">{t.project.about}</h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] mb-10 sm:mb-16 font-light">
                {lang === 'cs' ? fixCzechTypography(tr?.fullDescription ?? project.fullDescription) : (tr?.fullDescription ?? project.fullDescription)}
              </p>
              
              <div className="grid grid-cols-2 gap-10 sm:gap-14 md:gap-20 border-t border-white/5 pt-14 sm:pt-20">
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">{t.project.client}</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{project.client}</p>
                </div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">{t.project.role}</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{project.role}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 sm:space-y-12">
               <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">{t.project.tech}</h4>
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
                   <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">{t.project.website}</h4>
                   <div className="flex flex-wrap gap-3">
                     {project.websiteUrls.map(({ label, url }) => (
                       <a
                         key={url}
                         href={url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-white/20 rounded-full text-sm font-mono text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all"
                       >
                         {label}
                         <ExternalLink className="w-3.5 h-3.5" />
                       </a>
                     ))}
                   </div>
                 </div>
               )}
               
               <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                    "{lang === 'cs' ? fixCzechTypography(tr?.quote ?? project.quote ?? t.project.defaultQuote) : (tr?.quote ?? project.quote ?? t.project.defaultQuote)}"
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* Next Project CTA */}
        <Link to={`/project/${nextProject.slug}`} className="group block relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-8 lg:px-12 bg-white text-black overflow-hidden">
           <div className="absolute inset-0 bg-[var(--color-vibe-orange)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
           
           <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6 text-black/60 group-hover:text-white transition-all">{t.project.nextProject}</span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[1.05] mb-10 sm:mb-14 group-hover:text-white transition-colors">
                {nextProject.title}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    let scrollTicking = false;
    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 80;
        const workSection = document.getElementById('work');
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
        } else if (workSection && scrollPos >= workSection.offsetTop) {
          currentTheme = 'light';
        } else {
          currentTheme = 'dark';
        }
        setNavTheme(currentTheme);
        scrollTicking = false;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-vibe-orange)] selection:text-black">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      <motion.div 
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[100] flex items-center justify-center bg-white text-black hidden md:flex"
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "#F27D26" : "#FFFFFF"
        }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 250, 
          mass: 0.5,
          backgroundColor: { duration: 0.3 }
        }}
      >
        <Code2 className="w-5 h-5" />
      </motion.div>
      
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
          </Routes>
        </motion.div>
      </AnimatePresence>

      <CookieBar />
    </div>
  );
}
