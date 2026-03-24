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
}

export function getImageSrcSet(imagePath: string): string {
  const base = imagePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${imagePath} 1200w`;
}

export const CONTACT_EMAIL = 'mailto:horakpremysl85@gmail.com';

export const PROJECTS: Project[] = [
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
