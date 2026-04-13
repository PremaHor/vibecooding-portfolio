export type Lang = 'cs' | 'en';

export const criticalTranslations = {
  cs: {
    nav: {
      work: 'Práce',
      process: 'Jak pracuji',
      about: 'O mně',
      services: 'Můj přesah',
      pricing: 'Rozsah práce',
      contact: 'Kontakt',
      backHome: 'Zpět domů',
      start: 'Kontakt',
      closeMenu: 'Zavřít menu',
      openMenu: 'Otevřít menu',
    },
    hero: {
      available: 'Hledám tým, se kterým budu tvořit budoucnost',
      h1: 'Stavím produkty. Ne backlogy.',
      subheadlineLead: 'Hledám tým, kde využiju svůj přesah napříč obory.',
      subheadlineAccent:
        'Ne jako nájemný kodér, ale jako parťák, který staví produkty, které dávají smysl.',
      ctaPrimary: 'Pojďme se potkat',
      ctaSecondary: 'Prohlédnout projekty',
      workedWith: 'Spolupracovali se mnou',
    },
    cookieConsent: {
      title: 'Souhlas s cookies',
      description: 'Ahoj! Abych věděl, co se vám na mém portfoliu líbí a mohl ho zlepšovat, používám analytické nástroje (Google Analytics a Clarity). K tomu potřebuji váš souhlas.',
      acceptAll: 'Přijmout vše',
      reject: 'Odmítnout vše',
      privacyLink: 'Zásady ochrany soukromí',
    },
    footer: {
      copyright: '© 2026 Přemysl Horák',
      privacyLink: 'Zásady ochrany soukromí',
    },
    seo: {
      pageTitle: 'Weby a produkty od nápadu po nasazení',
      metaDescription:
        'Pomáhám firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
      ogDescription:
        'Pomáhám firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
      jsonLdDescription:
        'Pomáhám firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
      ogLocale: 'cs_CZ',
      ogLocaleAlternate: 'en_US',
    },
  },
  en: {
    nav: {
      work: 'Work',
      process: 'How I work',
      about: 'About me',
      services: 'My edge',
      pricing: 'Scope of work',
      contact: 'Contact',
      backHome: 'Back home',
      start: 'Contact',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
    },
    hero: {
      available: 'Looking for a team to build the future with',
      h1: 'I build products. Not backlogs.',
      subheadlineLead: 'I am looking for a team where I can put my cross-disciplinary edge to work.',
      subheadlineAccent:
        'Not as a hired gun, but as a partner who builds products that make sense.',
      ctaPrimary: 'Let\'s meet',
      ctaSecondary: 'View projects',
      workedWith: 'Worked with me',
    },
    cookieConsent: {
      title: 'Cookie consent',
      description: 'Hi! To understand what you like on my portfolio and improve it, I use analytics tools (Google Analytics and Clarity). I need your consent for that.',
      acceptAll: 'Accept all',
      reject: 'Reject all',
      privacyLink: 'Privacy policy',
    },
    footer: {
      copyright: '© 2026 Přemysl Horák',
      privacyLink: 'Privacy policy',
    },
    seo: {
      pageTitle: 'Websites and products from idea to deployment',
      metaDescription:
        'I help companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      ogDescription:
        'I help companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      jsonLdDescription:
        'I help companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      ogLocale: 'en_US',
      ogLocaleAlternate: 'cs_CZ',
    },
  },
} as const;
