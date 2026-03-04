# Příprava fotek pro portfolio projekty

## Důležité: Názvy = slug projektu

Projekty jsou zatím mockupy a budou se jmenovat jinak. **Názvy obrázků vždy odpovídají slug** v kódu – malá písmena, pomlčky místo mezer (např. `moje-nova-aplikace`).

Při přejmenování projektu stačí:
1. Změnit `slug`, `title` a další údaje v `PROJECTS` v kódu
2. Přejmenovat obrázky podle nového slug

---

## Aktuální použití obrázků

V projektu máte **3 projekty**, každý s **1 hlavním obrázkem**:

| Místo | Poměr stran | Doporučený rozměr |
|-------|-------------|-------------------|
| Karta v sekci Práce | 16:10 (nebo 6:5) | **1200 × 750 px** |
| Hero na detailu projektu | 16:9 | **1920 × 1080 px** |

Obrázky se zobrazují s `object-cover` – vyplní plochu a oříznou se. Důležité je **poměr stran**, ne přesný rozměr.

---

## Specifikace pro přípravu fotek

### 1. Rozměry a formát

**Hlavní obrázek projektu (1 obrázek na projekt):**
- **Minimální rozměr:** 1200 × 750 px (pro karty)
- **Doporučený:** 1920 × 1080 px (pokryje i detail)
- **Formát:** WebP (nejlepší výkon) nebo JPG (kompatibilita)
- **Kvalita:** 80–85 % komprese (dobrý kompromis velikost/kvalita)

**Hero avatary (volitelné):** 100 × 100 px, čtverec – pro sekci „Důvěřují mi lídři v oboru“

### 2. Co fotit / vybrat

- **Screenshot** webu nebo aplikace (nejlépe na reálném zařízení)
- **Mockup** – např. laptop/telefon s projektem
- **Detail UI** – klíčová obrazovka nebo funkce
- **Celková kompozice** – aby byl projekt na první pohled srozumitelný

### 3. Nástroje pro úpravu

- **Změna velikosti:** [Squoosh.app](https://squoosh.app) (Google) – zdarma, WebP export
- **Batch úprava:** ImageMagick, Photoshop Actions
- **Online:** Canva, Photopea

---

## Struktura souborů

```
vibecooding-portfolio/
├── public/
│   └── images/
│       └── projects/
│           ├── neon-velocity.webp
│           ├── cyber-garden.webp
│           └── void-interface.webp
```

Odkaz v kódu: `/images/projects/neon-velocity.webp`

---

## Checklist pro zítřek

1. **Připravit 3 obrázky** – jeden na projekt (neon-velocity, cyber-garden, void-interface)
2. **Poměr 16:9 nebo 16:10** – oříznout v editoru
3. **Exportovat jako WebP** (nebo JPG) – cca 200–500 KB na obrázek
4. **Pojmenovat podle slug** projektu
5. **Uložit do** `public/images/projects/`

---

## Galerie v detailu projektu (více fotek)

Pokud chcete v detailu projektu **galerii**, připravte obrázky takto:

### Struktura souborů

```
public/images/projects/
├── neon-velocity.webp          ← hlavní (hero) – používá se i na kartě
├── neon-velocity-01.webp       ← galerie 1
├── neon-velocity-02.webp       ← galerie 2
├── neon-velocity-03.webp       ← galerie 3
├── cyber-garden.webp
├── cyber-garden-01.webp
├── cyber-garden-02.webp
└── void-interface.webp
└── void-interface-01.webp
...
```

### Specifikace pro galerii

| Parametr | Hodnota |
|----------|---------|
| **Počet** | 3–6 obrázků na projekt (kromě hlavního) |
| **Rozměr** | 1200 × 800 px (16:9) nebo 1200 × 900 px (4:3) |
| **Formát** | WebP nebo JPG |
| **Velikost** | max. 300–500 KB na obrázek |
| **Poměry** | Můžete střídat – landscape (16:9) i portrait (9:16) pro variaci |

### Pojmenování

- **Hlavní:** `{slug}.webp` (např. `neon-velocity.webp`)
- **Galerie:** `{slug}-01.webp`, `{slug}-02.webp`, `{slug}-03.webp` …

### Co zobrazit v galerii

1. **Hlavní** – nejlepší screenshot / hero shot
2. **Detail UI** – klíčové obrazovky, funkce
3. **Různé stavy** – mobil/desktop, light/dark mode
4. **Proces** – wireframe, iterace (volitelné)
5. **Kontext** – mockup na zařízení

### Pořadí

Obrázky se zobrazí v pořadí podle čísla: 01, 02, 03… První v galerii = nejdůležitější.
