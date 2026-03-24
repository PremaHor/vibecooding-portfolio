export type Lang = 'cs' | 'en';

export const criticalTranslations = {
  cs: {
    nav: {
      work: 'Práce',
      process: 'Jak pracuji',
      about: 'O mně',
      services: 'Čemu se věnuji',
      pricing: 'Rozsah práce',
      contact: 'Kontakt',
      backHome: 'Zpět domů',
      start: 'Kontakt',
      closeMenu: 'Zavřít menu',
      openMenu: 'Otevřít menu',
    },
    hero: {
      available: 'Hledám tým, se kterým budu tvořit budoucnost',
      h1: 'Propojuji design, kód a produktové myšlení.',
      subheadline: 'Fascinuje mě AI a tempo, jakým mění svět kolem nás. Hledám tým nebo firmu, kde mohu využít svůj mezioborový přesah a společně tvořit produkty, které dávají smysl. Ne jako nájemný kodér, ale jako loajální parťák.',
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
      copyright: '© 2026 VIBECOODING',
      privacyLink: 'Zásady ochrany soukromí',
    },
  },
  en: {
    nav: {
      work: 'Work',
      process: 'How I work',
      about: 'About me',
      services: 'What I do',
      pricing: 'Scope of work',
      contact: 'Contact',
      backHome: 'Back home',
      start: 'Contact',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
    },
    hero: {
      available: 'Looking for a team to build the future with',
      h1: 'I connect design, code, and product thinking.',
      subheadline: 'I\'m fascinated by AI and the pace at which it\'s changing the world. I\'m looking for a team or company where I can bring my cross-disciplinary skills and build products that truly matter. Not as a hired gun, but as a loyal partner.',
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
      copyright: '© 2026 VIBECOODING',
      privacyLink: 'Privacy policy',
    },
  },
} as const;
