export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  /** Listing / work grid thumbnail */
  image: string;
  /** Actual width in px of `image` (last srcset width); omit for 1200 */
  imageWidth?: number;
  /** Actual height in px of `image` (img dimensions hint); omit for 800 */
  imageHeight?: number;
  /** Work grid only: override image path (e.g. full screenshot with `thumbObjectFit: 'contain'`) */
  thumbImage?: string;
  thumbImageWidth?: number;
  thumbImageHeight?: number;
  /** Work grid `img` object-fit; default `cover` */
  thumbObjectFit?: 'cover' | 'contain';
  /**
   * When false, listing/detail/next-project images use only `src` (no `-640`/`-960` in srcset).
   * Use when the main file is replaced often so the browser never picks stale responsive derivatives.
   */
  useResponsiveImageVariants?: boolean;
  /** Optional full-width hero on project detail (e.g. full-page screenshot) */
  detailImage?: string;
  /** Intrinsic pixel size of `detailImage` (for layout / CLS); optional */
  detailImageWidth?: number;
  detailImageHeight?: number;
  tags: string[];
  year: string;
  client: string;
  role: string;
  quote?: string;
  galleryImages?: { src: string; alt: string }[];
  /** YouTube video ID (embed), e.g. MC0M3jmvmBE from youtu.be/... */
  youtubeVideoId?: string;
  notionCaseStudyUrl?: string;
  /** Keys map to `t.project.websiteLinkLabels` */
  websiteUrls?: {
    labelKey: 'risklightLanding' | 'risklightPwa' | 'dduOriginalWeb' | 'dduRedesignPreview' | 'arborisDemo';
    url: string;
  }[];
}

export function getImageSrcSet(imagePath: string, intrinsicWidth?: number): string {
  const pathOnly = imagePath.split('?')[0];
  const base = pathOnly.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const w = intrinsicWidth ?? 1200;
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${imagePath} ${w}w`;
}

export function getProjectImageSrcSet(
  project: Pick<Project, 'useResponsiveImageVariants'>,
  imagePath: string,
  intrinsicWidth?: number,
): string | undefined {
  if (project.useResponsiveImageVariants === false) return undefined;
  return getImageSrcSet(imagePath, intrinsicWidth);
}

export { CONTACT_EMAIL } from './constants';

/** Bump po výměně `arboris.webp` / přegenerování `arboris-card.webp` (cache prohlížeče/CDN). */
const ARBORIS_ASSET_V = '6';
const ARBORIS_IMAGE = `/images/projects/arboris.webp?v=${ARBORIS_ASSET_V}`;
/** Hero výřez (~40 % výšky) jen pro náhled v mřížce a „další projekt“. */
const ARBORIS_CARD_IMAGE = `/images/projects/arboris-card.webp?v=${ARBORIS_ASSET_V}`;

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "risklight",
    title: "RiskLight",
    category: "PWA",
    description: "Modulární mobil-first aplikace pro sledování rizik, správu klientů a týmovou spolupráci v reálném čase. End-to-end vývoj od výzkumu po nasazení.",
    fullDescription: "RiskLight je modulární a škálovatelná aplikace pro organizace pracující s lidmi a jejich stavem, prioritami nebo riziky v čase. Navrhl a vyvinul jsem ji kompletně sám, od terénního výzkumu přes UX/UI design až po finální vývoj v Reactu a Supabase.",
    image: "/images/projects/5.webp",
    tags: ["React", "TypeScript", "Supabase", "Tailwind", "Figma"],
    year: "2025",
    client: "Vlastní projekt",
    role: "End-to-End (UX, UI, Dev, Produkt)",
    youtubeVideoId: "MC0M3jmvmBE",
    notionCaseStudyUrl:
      "https://utopian-biology-d74.notion.site/Case-study-RiskLight-2eca0be69d5d803db31cdb1abcf06bad?pvs=143",
    websiteUrls: [
      { labelKey: 'risklightLanding', url: 'https://risklight.cz' },
      { labelKey: 'risklightPwa', url: 'https://risklight.app' },
    ],
  },
  {
    id: 2,
    slug: "adcalc",
    title: "AdCalc",
    category: "Interní nástroj",
    description:
      "Interní nástroj pro REKLY: kalkulace z ceníku, sdílené zakázky podle fáze, adresář s prioritami pro návratnost klientů, archiv hotových a PDF připravené k odeslání, jedna data pro celý tým.",
    fullDescription:
      "AdCalc pokrývá životní cyklus zakázky od nezávazné nabídky po výrobu, sdílený ceník ve Firebase, adresář napojený na zakázky a tisknutelné PDF bez interních řádků.",
    image: "/images/projects/addcalc.webp",
    tags: ["React 19", "TypeScript", "Vite", "Tailwind", "Motion", "Firebase", "jsPDF"],
    year: "2026",
    client: "REKLY",
    role: "Produktová logika, UI/UX, frontend, Firebase, PDF",
    youtubeVideoId: "nuMND8cJNhE",
  },
  {
    id: 3,
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
    youtubeVideoId: "v_upqf3a-zA",
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
    quote: "Spolupráce na redesignu byla příjemná, důraz na přehlednost a přístupnost pro rodiče i pedagogy se promítl do každého detailu.",
    websiteUrls: [
      { labelKey: 'dduOriginalWeb', url: 'https://www.dduolomouc.cz/' },
      { labelKey: 'dduRedesignPreview', url: 'https://ddu-olomouc-web.vercel.app/' },
    ],
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
  },
  {
    id: 6,
    slug: "arboris",
    title: "Arboris",
    category: "Ukázkový web",
    description:
      "Koncept jednostránkového webu pro prémiové dřevostavby: hero, hodnoty, galerie realizací, proces a kontaktní CTA. České rozhraní, responzivní layout s důrazem na čitelnost a přístupnost; značka Arboris je ukázková.",
    fullDescription:
      "Arboris propojuje prémiový vizuální úvod, sekci hodnot, galerii realizací, proces spolupráce a výzvu ke kontaktu na jedné stránce.",
    image: ARBORIS_CARD_IMAGE,
    imageWidth: 1440,
    imageHeight: 1766,
    detailImage: ARBORIS_IMAGE,
    detailImageWidth: 1440,
    detailImageHeight: 4414,
    useResponsiveImageVariants: false,
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Motion",
      "CSS Modules",
      "A11y",
      "Vercel",
    ],
    year: "2026",
    client: "Vlastní koncept",
    role: "UI, frontend, CZ copy",
    websiteUrls: [{ labelKey: "arborisDemo", url: "https://bez-nazvu.vercel.app/" }],
  },
];
