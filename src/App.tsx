import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { fixCzechTypography } from './utils/czechTypography';
import { 
  Code2, 
  Zap, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Linkedin, 
  Github,
  Terminal,
  ArrowLeft,
  ChevronRight,
  Menu,
  X,
  Cookie,
  Rocket,
  Palette,
  Settings
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
    slug: "cyber-garden",
    title: "CYBER GARDEN",
    category: "E-commerce",
    description: "Experimentální obchod s digitálními aktivy využívající brutalistní design.",
    fullDescription: "Cyber Garden boří konvence tradičního e-commerce. Místo čistých bílých ploch jsme zvolili syrový, brutalistní přístup, který rezonuje s komunitou digitálních umělců. Celý systém je postaven na headless architektuře pro maximální rychlost a flexibilitu.",
    image: "https://picsum.photos/seed/garden/1200/800",
    tags: ["Next.js", "Tailwind", "Stripe"],
    year: "2023",
    client: "Digital Bloom",
    role: "Fullstack Architect"
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

const SERVICES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Webové stránky a prezentace",
    description: "Moderní weby, které ukážou vaši hodnotu a podpoří prodej. Přehledně, rychle, účinně."
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Landing pages",
    description: "Stránky, které konvertují. Pro kampaně, validaci nápadu nebo konkrétní nabídku."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Prototypy a MVP",
    description: "Funkční model produktu dřív, než investujete velké peníze. Ověřte trh rychle."
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "UI/UX návrh",
    description: "Rozhraní, které zákazníci pochopí na první pohled. Funkční a přehledné."
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Automatizace procesů",
    description: "Propojíme nástroje, zautomatizujeme rutinu. Méně práce, více času na to důležité."
  }
];

// --- Components ---

const Navbar = ({ theme, isProjectPage }: { theme: 'light' | 'dark', isProjectPage?: boolean }) => {
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
      <a href="#work" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>Práce</a>
      <a href="#services" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>Služby</a>
      <a href="#contact" onClick={closeMobileMenu} className={`hover:text-current transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>Kontakt</a>
    </>
  ) : (
    <Link to="/" onClick={closeMobileMenu} className={`hover:text-current transition-colors flex items-center gap-2 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>
      <ArrowLeft className="w-4 h-4" /> Zpět domů
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
            Začněme
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 -mr-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
            aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
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
                  Práce
                </a>
                <a href="#services" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  Služby
                </a>
                <a href="#contact" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors">
                  Kontakt
                </a>
              </>
            ) : (
              <Link to="/" onClick={closeMobileMenu} className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide text-white/90 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Zpět domů
              </Link>
            )}
          </nav>
          <a 
            href="mailto:horakpremysl85@gmail.com"
            onClick={closeMobileMenu}
            className="mt-4 block py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-[0.15em] bg-[var(--color-vibe-orange)] text-black text-center hover:bg-[var(--color-vibe-orange)]/90 active:scale-[0.98] transition-all"
          >
            Začněme
          </a>
        </motion.div>
      </div>
    </>
  );
};

const Hero = () => {
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
            Dostupný pro nové projekty 2026
          </span>
        </motion.div>
        
        <h1 className="font-display text-[12vw] sm:text-[11vw] md:text-[10vw] lg:text-[8rem] leading-[1.08] uppercase mb-6 sm:mb-8">
          <div className="text-reveal">
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              Kóduji
            </motion.span>
          </div>
          <div className="text-reveal">
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-[var(--color-vibe-orange)]"
            >
              S Vibem.
            </motion.span>
          </div>
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-bold text-white/95 mb-10 sm:mb-16 md:mb-20 max-w-xl">
          {fixCzechTypography("Landing page do 7 dnů. MVP do 14 dnů.")}
        </p>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-8 sm:space-y-10"
          >
            <p className="text-sm sm:text-base md:text-lg font-light text-white/80 max-w-lg leading-[1.7]">
              {fixCzechTypography("Stavím weby a aplikace, které prodávají. Jasně ukážou vaši hodnotu a přivedou zákazníky. Žádná zbytečná složitost, jen výsledek.")}
            </p>
            <div className="flex flex-wrap gap-5 sm:gap-10 items-center">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[var(--color-vibe-black)] bg-gray-800 overflow-hidden">
                       <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="Client" width={100} height={100} loading="lazy" decoding="async" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
               </div>
               <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Spolupracovali se mnou</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
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
                
                {/* Circular Text (Simulated) */}
                <div className="absolute inset-3 sm:inset-4 border border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-[var(--color-vibe-orange)] text-black font-bold text-[9px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                Explore
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WorkSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Lehčí spring pro plynulejší odezvu při scrollu
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });
  
  // Map scroll to horizontal movement - postupné zobrazení všech 4 projektů
  const x = useTransform(
    smoothProgress, 
    [0, 0.2, 0.4, 0.6, 0.85, 1], 
    ["0%", "-35%", "-70%", "-105%", "-140%", "-140%"]
  );
  
  return (
    <section id="work" ref={targetRef} className="relative h-[500vh] sm:h-[600vh] md:h-[800vh] bg-white text-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 px-0">
        {/* Horizontal Scroll Track */}
        <motion.div 
          style={{ x, opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0]) }} 
          className="flex gap-[20vw] sm:gap-[22vw] md:gap-[25vw] px-[8vw] sm:px-[10vw] md:px-[12vw] items-center relative z-10 will-change-transform"
        >
          {PROJECTS.map((project, idx) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={idx} 
              scrollYProgress={smoothProgress}
            />
          ))}
          
          {/* Large spacer at the end */}
          <div className="shrink-0 w-[30vw] sm:w-[35vw] md:w-[40vw] h-16 sm:h-20 flex items-center">
             <div className="w-full h-px bg-black/10 relative">
                <div className="absolute right-0 -top-4 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-black/50">End of Gallery</div>
             </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 w-52 sm:w-72 h-1 bg-black/5 rounded-full overflow-hidden px-4">
          <motion.div 
            style={{ scaleX: smoothProgress, originX: 0 }}
            className="h-full bg-[var(--color-vibe-orange)]"
          />
          <div className="absolute -bottom-5 sm:-bottom-6 left-0 right-0 flex justify-between text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-black/50">
            <span>Start</span>
            <span className="hidden sm:inline">Scroll to Explore</span>
            <span className="sm:hidden">Scroll</span>
            <span>Finish</span>
          </div>
        </div>
      </div>
    </section>
  );
};

function ProjectCard({ project, index, scrollYProgress, onHoverChange }: { project: Project, index: number, scrollYProgress: any, onHoverChange?: (hovered: boolean) => void, key?: React.Key }) {
  const cardRef = useRef(null);
  
  // Jemný parallax pro obrázek - redukovaný pro plynulejší scroll
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -30 : 30]);
  
  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className="group shrink-0 w-[85vw] min-w-[280px] sm:w-[75vw] md:w-[600px] lg:w-[700px] relative"
    >
      <Link to={`/project/${project.slug}`} className="block relative">
        <div className="relative aspect-[16/10] md:aspect-[1.2/1] overflow-hidden rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] mb-10 sm:mb-14 bg-gray-50 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-700">
          <motion.img 
            style={{ y: yParallax, scale: 1.2 }}
            src={project.image} 
            alt={project.title}
            width={1200}
            height={800}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            decoding="async"
            className="w-full h-full object-cover rounded-2xl sm:rounded-[1.75rem] md:rounded-[2rem] transition-transform duration-1000 group-hover:scale-[1.25]"
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
                View Case Study
              </motion.div>
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)">
              <ArrowRight className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-10">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-[var(--color-vibe-orange)]" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-vibe-orange)]">
                {project.category}
              </span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.05] mb-5 sm:mb-6 group-hover:translate-x-2 md:group-hover:translate-x-4 transition-transform duration-500">
              {project.title}
            </h3>
            
            <div className="flex gap-2 flex-wrap">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] px-4 py-2 border border-black/10 rounded-full font-mono uppercase tracking-[0.15em] bg-white group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block text-right">
             <div className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-1">Timeline</div>
             <div className="text-2xl font-display">{project.year}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const ServicesSection = () => (
  <section id="services" className="py-20 sm:py-28 md:py-36 lg:py-48 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-white/[0.02] to-transparent pointer-events-none" />
    
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 sm:gap-28 lg:gap-36 items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase mb-10 sm:mb-16 leading-[1.08]">
            Co Vám<br/><span className="text-white/30 italic">Nabízím</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-12 sm:mb-16 max-w-lg font-light leading-[1.7]">
            {fixCzechTypography("Weby, landing pages, MVP i automatizace. Konkrétní řešení, které vám pomůže růst. Bez zbytečného balastu.")}
          </p>
          <div className="grid gap-5 sm:gap-6">
            {SERVICES.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group flex gap-4 sm:gap-6 md:gap-8 p-5 sm:p-6 md:p-8 border border-white/10 rounded-2xl hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-[var(--color-vibe-orange)] shrink-0 group-hover:bg-[var(--color-vibe-orange)] group-hover:text-black transition-all duration-500">
                  {service.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-white/95">{service.title}</h4>
                  <p className="text-white/75 text-sm sm:text-base leading-[1.6] group-hover:text-white/90 transition-colors">{fixCzechTypography(service.description)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Jak pracuji */}
          <div className="mt-16 sm:mt-20 lg:mt-28">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase mb-6 sm:mb-10 text-white/95">Jak pracuji</h3>
            <ul className="space-y-4 text-white/80 font-light leading-[1.7]">
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)] shrink-0">•</span> {fixCzechTypography("Výsledek před složitostí. Vždy.")}</li>
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)] shrink-0">•</span> {fixCzechTypography("Řešení šitá na míru vašemu rozpočtu.")}</li>
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)] shrink-0">•</span> {fixCzechTypography("Moderní nástroje, rychlá realizace.")}</li>
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)] shrink-0">•</span> {fixCzechTypography("Jasná komunikace. Žádný technický žargon.")}</li>
            </ul>
          </div>

          {/* Pro koho */}
          <div className="mt-12 sm:mt-16 lg:mt-24">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase mb-6 sm:mb-10 text-white/95">Pro koho</h3>
            <p className="text-white/80 font-light leading-[1.7] mb-4">{fixCzechTypography("Spolupracuji s těmi, kdo:")}</p>
            <ul className="space-y-3 text-white/85">
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)]">•</span> {fixCzechTypography("chtějí rychle spustit projekt")}</li>
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)]">•</span> {fixCzechTypography("potřebují zjednodušit to, co už mají")}</li>
              <li className="flex gap-3"><span className="text-[var(--color-vibe-orange)]">•</span> {fixCzechTypography("hledají flexibilitu místo velké agentury")}</li>
            </ul>
          </div>
        </div>
        
        <div className="relative hidden md:block">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="sticky top-28 lg:top-36 aspect-[4/5] rounded-2xl lg:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-vibe-orange)]/10 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <div className="items-center gap-4 mb-8 lg:mb-12 flex">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50" />
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <Terminal className="w-12 h-12 sm:w-16 sm:h-16 mb-8 lg:mb-12 text-[var(--color-vibe-orange)]" />
              <div className="font-mono text-sm sm:text-base lg:text-lg space-y-4 text-white/60">
                <p className="text-[var(--color-vibe-orange)]/80">$ vibecooding --init</p>
                <p className="animate-pulse">Initializing creative flow...</p>
                <p>Optimizing for performance...</p>
                <p>Injecting visual soul...</p>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                   <p className="text-green-400">System: Ready to build.</p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 border-t border-white/5 pt-10 lg:pt-14">
              <div className="text-[8vw] lg:text-[9vw] font-display opacity-5 select-none leading-none">FLOW</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mt-4">VibeCooding Engine v2.6</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = () => (
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
          Pojďme to probrat
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-light mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
          {fixCzechTypography("Máte nápad? Konkrétní potřebu? Napište. Společně najdeme cestu, jak ji proměnit v realitu.")}
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
          Napsat zprávu
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

const Footer = () => (
  <footer id="privacy" className="py-8 sm:py-12 px-4 sm:px-6 md:px-8 border-t border-white/10 text-center text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">
    {fixCzechTypography("© 2026 VIBECOODING - VYTVOŘENO S VÁŠNÍ PRO KÓD")}
  </footer>
);

const COOKIE_CONSENT_KEY = 'vibecooding-cookie-consent';

const CookieBar = () => {
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
                <h3 className="font-display font-bold text-white text-lg sm:text-xl mb-1">Soubory cookies</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  {fixCzechTypography("Používáme cookies pro zajištění funkčnosti webu a lepší uživatelskou zkušenost.")}{' '}
                  <a href="#privacy" className="text-[var(--color-vibe-orange)] hover:underline">Více informací</a>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={declineOptional}
                className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Jen nutné
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-[var(--color-vibe-orange)] text-white hover:bg-[var(--color-vibe-orange)]/90 transition-colors shadow-lg"
              >
                Přijmout vše
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
      <ServicesSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const projectIndex = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[projectIndex];
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <div>Project not found</div>;

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
                {project.category} / {project.year}
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase mb-10 sm:mb-14">O projektu</h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 leading-[1.7] mb-10 sm:mb-16 font-light">
                {fixCzechTypography(project.fullDescription)}
              </p>
              
              <div className="grid grid-cols-2 gap-10 sm:gap-14 md:gap-20 border-t border-white/5 pt-14 sm:pt-20">
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">Klient</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{project.client}</p>
                </div>
                <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-3 sm:mb-4">Role</h4>
                  <p className="text-lg sm:text-xl md:text-2xl font-display uppercase">{project.role}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 sm:space-y-12">
               <div>
                  <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">Technologie</h4>
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
                   <h4 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-bold text-white/50 mb-4 sm:mb-6">Web projektu</h4>
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
                    "{fixCzechTypography(project.quote ?? "Tento projekt byl výzvou v oblasti výkonu a vizuální věrnosti. Výsledek předčil očekávání klienta.")}"
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* Next Project CTA */}
        <Link to={`/project/${nextProject.slug}`} className="group block relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-8 lg:px-12 bg-white text-black overflow-hidden">
           <div className="absolute inset-0 bg-[var(--color-vibe-orange)] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
           
           <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6 text-black/60 group-hover:text-white transition-all">Další Projekt</span>
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

        let currentTheme: 'light' | 'dark' = 'dark';
        if (contactSection && scrollPos >= contactSection.offsetTop) {
          currentTheme = 'light';
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
