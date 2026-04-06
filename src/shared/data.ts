export interface Project {
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
  /** YouTube video ID (embed), e.g. MC0M3jmvmBE from youtu.be/... */
  youtubeVideoId?: string;
}

export function getImageSrcSet(imagePath: string): string {
  const base = imagePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${imagePath} 1200w`;
}

export { CONTACT_EMAIL } from './constants';

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "risklight",
    title: "RiskLight",
    category: "PWA",
    description: "Modulární mobil-first aplikace pro sledování rizik, správu klientů a týmovou spolupráci v reálném čase. End-to-end vývoj od výzkumu po nasazení.",
    fullDescription: "RiskLight je modulární a škálovatelná aplikace pro organizace pracující s lidmi a jejich stavem, prioritami nebo riziky v čase. Navrhl a vyvinul jsem ji kompletně sám — od terénního výzkumu přes UX/UI design až po finální vývoj v Reactu a Supabase.",
    image: "/images/projects/5.webp",
    tags: ["React", "TypeScript", "Supabase", "Tailwind", "Figma"],
    year: "2025",
    client: "Vlastní projekt",
    role: "End-to-End (UX, UI, Dev, Produkt)",
    websiteUrls: [
      { label: "risklight.cz", url: "https://risklight.cz" },
      { label: "risklight.app", url: "https://risklight.app" },
    ],
    youtubeVideoId: "MC0M3jmvmBE",
  },
  {
    id: 2,
    slug: "kviz-pwa",
    title: "Kvíz PWA",
    category: "PWA",
    description:
      "Česká progresivní webová aplikace pro generování kvízů z konfigurace. Otázky připravuje LLM na serveru; klient je lehký průvodce a přehrávač.",
    fullDescription:
      "Kvíz PWA spojuje průvodce nastavením, strukturované generování přes Gemini a PWA nasazení na Vercel.",
    image: "/images/projects/kviz.webp",
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "PWA",
      "Zustand",
      "Gemini API",
      "Vercel",
      "Edtech",
    ],
    year: "2026",
    client: "Vlastní projekt",
    role: "Fullstack (UI + API)",
  },
  {
    id: 3,
    slug: "adcalc",
    title: "AdCalc",
    category: "PWA MVP Prototyp",
    description: "Interaktivní kalkulátor pro reklamní výrobu. Převádí složitou matematickou logiku do kódu s validací vstupů a přepočtem ceny v reálném čase.",
    fullDescription: "AdCalc je funkční prototyp nástroje pro kalkulace v reklamní výrobě.",
    image: "/images/projects/addcalc.webp",
    tags: ["React", "TypeScript", "Tailwind"],
    year: "2025",
    client: "Rekly",
    role: "Lead Developer & Designer",
    websiteUrls: [
      { label: "rekly.vercel.app", url: "https://rekly.vercel.app/" },
    ],
  },
  {
    id: 4,
    slug: "ddu-olomouc",
    title: "DDÚ Olomouc",
    category: "Redesign webu",
    description: "Kompletní redesign webu Dětského diagnostického ústavu v Olomouci. Moderní, přehledný a přístupný web pro instituci pečující o děti a mládež.",
    fullDescription: "Redesign webu DDÚ Olomouc přináší novou vizuální identitu a přehlednější strukturu informací.",
    image: "/images/projects/ddu-olomouc.webp",
    tags: ["HTML", "CSS", "Responsive Design", "WCAG"],
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
    id: 5,
    slug: "decision-balance",
    title: "Decision Balance",
    category: "Koncept",
    description: "Mobilní aplikace pro strukturované rozhodování s unikátním Fantasy/RPG designem. Matematický model vážení kritérií v herním balení.",
    fullDescription: "Decision Balance je koncept mobilní aplikace pro podporu rozhodování.",
    image: "/images/projects/backround.webp",
    tags: ["React Native", "TypeScript", "Custom Fantasy UI"],
    year: "2026",
    client: "Vlastní koncept",
    role: "Kreativní UX/UI & Developer",
    galleryImages: [
      { src: "/images/projects/DB1.webp", alt: "Decision Balance, DB1" },
      { src: "/images/projects/DB2.webp", alt: "Decision Balance, DB2" },
    ],
  }
];
