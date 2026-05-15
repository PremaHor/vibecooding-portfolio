# Design system — premyslhorak.cz (Vibecoding portfolio)

Dokumentace vychází z implementace v `src/index.css` (`@theme`), `src/fonts-mono.css` a z opakujících se Tailwind tříd v komponentách (`App.tsx`, `HomeSections.tsx`, `ProjectPage.tsx`, `Navbar.tsx`, …).

---

## 1. Brand barvy (CSS proměnné)

Definováno v `@theme` v `src/index.css` a používáno jako `var(--color-…)` nebo Tailwind arbitrary values `bg-[var(--color-vibe-orange)]`.

| Token | Hodnota | Použití |
|--------|---------|---------|
| `--color-vibe-orange` | `#9ef01a` | Akcent (limetková), CTA, hover, selection, značkové zvýraznění; text na `#050505` ~14.5:1 (WCAG AAA) |
| `--color-vibe-black` | `#050505` | Pozadí celého webu, tmavé stránky projektů, scrollbar track |
| `--color-vibe-green` | `#00FF00` | Rezervovaný token v theme; v UI se aktuálně nepoužívá |

**Doplňkové barvy mimo `@theme` (v kódu):**

- Hero nadpis (gradient text): `#fff` → `#b8c5d6` (viz kritický CSS v `index.html`).
- Zelený glow u Spark CTA / glitch: `rgba(158, 240, 26, …)` odvozeno od akcentu `#9ef01a`.
- Scrollbar thumb: `#333`, hover: `--color-vibe-orange`.
- `theme-color` v HTML: `#9ef01a` (soulad s `--color-vibe-orange`; lišta prohlížeče / PWA).

---

## 2. Sémantické texty na tmavém pozadí

Definováno v `@theme` (komentář: WCAG AA na `#050505`):

| Token | Hodnota |
|--------|---------|
| `--text-primary` | `rgba(255, 255, 255, 0.95)` |
| `--text-secondary` | `rgba(255, 255, 255, 0.78)` |
| `--text-muted` | `rgba(255, 255, 255, 0.6)` |

V praxi se často používají Tailwind opacity utilities: `text-white/95`, `text-white/80`, `text-white/70`, `text-white/50`, atd.

---

## 3. Typografie

### Font rodiny (`@theme`)

| Role | Token / třída | Stack |
|------|----------------|--------|
| Body | `font-sans` | `"Inter", ui-sans-serif, system-ui, sans-serif` |
| Nadpisy (display) | `font-display` + utilita `.font-display` | `"Montserrat", sans-serif` — **700**, `letter-spacing: 0.03em` |
| Mono / štítky | `font-mono` | `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace` |

Self-hosted: Montserrat + Inter (viz `index.html`), JetBrains Mono (`src/fonts-mono.css`).

### Mobilní typografická škála (ratio ~1.25)

Utility třídy v `@layer base` (`src/index.css`):

- `.text-scale-xs` → 12px  
- `.text-scale-sm` → 14px  
- `.text-scale-base` → 16px  
- `.text-scale-lg` → 18px  
- `.text-scale-xl` → 20px  
- `.text-scale-2xl` → 24px  

### Časté vzory v UI

- **Navigace (desktop):** `text-xs font-bold tracking-[0.3em] uppercase`.
- **Sekční „kicker“ / label:** velmi malý kapitál, široké `tracking` (např. `tracking-[0.35em]`–`tracking-[0.5em]`), `text-white/50`.
- **Display nadpisy:** `font-display` + `uppercase` + fluidní `clamp` na hero / stránkách projektů.
- **Tělo:** `font-light` / `leading-relaxed` / `leading-[1.7]` podle kontextu.

---

## 4. Mezery (8px grid)

V `@theme`:

| Token | Rem | Px (při 16px root) |
|--------|-----|---------------------|
| `--space-1` … `--space-20` | 0.5rem až 10rem | 8px až 160px |

Sekce typicky: `px-4 sm:px-6 md:px-8 lg:px-12` a vertikální `py-20 sm:py-28 md:py-36` (podle sekce).

Maximální šířka obsahu: často `max-w-7xl mx-auto`.

---

## 5. Zaoblení a rámy

- **Pill tlačítka / tagy:** `rounded-full`.
- **Karty / bloky:** `rounded-2xl`, větší média někdy `rounded-[1.75rem]` / `rounded-[2rem]` / `rounded-[2.5rem]`.
- **Ikony v „dlaždicích“:** `rounded-xl` / `rounded-2xl`.

**Tmavé plochy (glass / subtle):**

- `border border-white/10` až `white/20`, pozadí `bg-white/[0.03]`–`bg-white/5`.
- Hover: `hover:border-[var(--color-vibe-orange)]/15`–`/30`, `hover:bg-white/[0.05]`–`[0.06]`.

**Světlé karty (např. výběr práce):**

- `bg-white`, `border-black/[0.06]`, `shadow-sm` → `hover:shadow-lg`.

---

## 6. Pohyb a easing

- Častá křivka: **`cubic-bezier(0.16, 1, 0.3, 1)`** — v Tailwind jako `ease-[0.16,1,0.3,1]` u `transition` / Motion.
- Délky: typicky **300–700 ms** pro hover; hero / page fade kolem **0.7–0.8 s**.
- **Lenis** smooth scroll; `scroll-behavior: smooth` na `html` záměrně není (komentář v CSS).
- **`prefers-reduced-motion`:** zjednodušené chování pro scroll, typewriter caret, photo-glitch (`src/index.css`).

---

## 7. Navigace a vrstvy

- **Fixed nav:** `z-50`; po scrollu `bg-black/10` + **backdrop blur 24px** (`.nav-blur-active`).
- **Mobilní menu:** `z-[100]`, pozadí `--color-vibe-black`.
- **Skip link:** pozadí `--color-vibe-orange`, černý text, focus ring `outline` v barvě `--color-vibe-black` (kontrast na limetce), zaoblení `0.5rem` (viz `.skip-link`).

---

## 8. Komponenty — vzory

### Primární CTA

- `bg-[var(--color-vibe-orange)]`, `text-black`, `rounded-full`, tučné **uppercase** s širším `tracking`.
- Hover: `bg-…/90`, někdy akcentový glow; `active:scale-[0.98]`.
- Minimální výška pro touch: často **`min-h-[44px]`** nebo větší.

### Sekundární / duchové tlačítka (tmavý režim)

- Ohraničení `border-white/20`, hover `bg-white/10`, `font-mono` u odkazů „related“.

### Témata stránek

- **`Navbar`:** `theme="light"` (úvod — text černý na světlém) vs `theme="dark"` (stránky projektů — bílý text).
- **Stránka projektu:** pozadí `bg-[var(--color-vibe-black)]`, akcenty v barvě `--color-vibe-orange`; **„Next project“** pás: `bg-white text-black` s plnou výplní `--color-vibe-orange` při hoveru.

### Kontaktní sekce

- Plné pozadí **`--color-vibe-orange`**, text **`black`** (vysoký kontrast).

---

## 9. Přístupnost

- **Focus visible:** `outline: 2px solid var(--color-vibe-orange)`, `outline-offset: 2px` (`a`, `button`).
- **Selection:** `selection:bg-[var(--color-vibe-orange)] selection:text-black` na `body`.
- **Safe area:** třídy `.safe-area-inset*`, `pt-nav-safe` pro obsah pod fixed nav + notch.
- **Formulářové prvky:** `scroll-margin-top` kvůli fixed navbar (`src/index.css`).

---

## 10. Ikony

- **Lucide React** (`lucide-react`) — velikosti typicky `w-4 h-4` až `w-6 h-6`, barvy v souladu s textem / akcentem `--color-vibe-orange`.

---

## 11. Kde to měnit

| Oblast | Soubor |
|--------|--------|
| Tokeny barev, fontů, spacing, base typografie | `src/index.css` (`@theme`, `@layer base`) |
| Mono font face | `src/fonts-mono.css` |
| Kritický font + hero FOUC / display | `index.html` (inline `<style>`) |

Tento soubor je **referenční dokumentace**; při změnách v CSS ho prosím aktualizuj, ať zůstane v souladu s kódem.
