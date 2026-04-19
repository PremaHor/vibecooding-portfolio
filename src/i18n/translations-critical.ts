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
      h1: 'Pomáhám navrhovat digitální produkty tak, aby je lidé opravdu pochopili a chtěli používat.',
      subheadlineLead:
        'Hledám tým, kde můžu růst v UX a podílet se na smysluplných produktech.',
      subheadlineAccent: '',
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
      pageTitle: 'Přemysl Horák | Pomáhám navrhovat digitální produkty',
      twitterTitle: 'Přemysl Horák | Pomáhám navrhovat digitální produkty',
      metaDescription:
        'Přemysl Horák — vývojář a designér. Pomáhá firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
      ogDescription:
        'Přemysl Horák — vývojář a designér. Pomáhá firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
      jsonLdDescription:
        'Přemysl Horák — vývojář a designér. Pomáhá firmám a startupům vytvořit web nebo produkt od první myšlenky až po spuštění. Design, vývoj i produkt v jednom.',
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
      h1: 'I help design digital products so people truly understand them and want to use them.',
      subheadlineLead:
        "I'm looking for a team where I can grow in UX and help build meaningful products.",
      subheadlineAccent: '',
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
      pageTitle: 'Premysl Horak | Digital products people understand',
      twitterTitle: 'Premysl Horak | Digital products people understand',
      metaDescription:
        'Premysl Horak (Přemysl Horák) — developer and designer. Helps companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      ogDescription:
        'Premysl Horak (Přemysl Horák) — developer and designer. Helps companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      jsonLdDescription:
        'Premysl Horak (Přemysl Horák) — developer and designer. Helps companies and startups build a website or product from the first idea to launch. Design, development, and product in one.',
      ogLocale: 'en_US',
      ogLocaleAlternate: 'cs_CZ',
    },
  },
} as const;
