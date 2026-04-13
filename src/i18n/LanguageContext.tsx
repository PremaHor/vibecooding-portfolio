import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { criticalTranslations, type Lang } from './translations-critical';

type SeoCopy = (typeof criticalTranslations)['cs']['seo'];

function applyDocumentSeo(seo: SeoCopy) {
  document.title = seo.pageTitle;

  const setMetaName = (name: string, content: string) => {
    const el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', content);
  };
  const setMetaProperty = (property: string, content: string) => {
    const el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
    if (el) el.setAttribute('content', content);
  };

  setMetaName('description', seo.metaDescription);
  setMetaProperty('og:title', seo.pageTitle);
  setMetaProperty('og:description', seo.ogDescription);
  setMetaProperty('og:locale', seo.ogLocale);
  setMetaProperty('og:locale:alternate', seo.ogLocaleAlternate);
  setMetaName('twitter:title', seo.twitterTitle);
  setMetaName('twitter:description', seo.ogDescription);

  const ldEl = document.head.querySelector('script[type="application/ld+json"]');
  if (!ldEl?.textContent) return;
  try {
    const data = JSON.parse(ldEl.textContent.trim()) as Record<string, unknown>;
    if (data['@type'] === 'Person') {
      data.description = seo.jsonLdDescription;
      ldEl.textContent = `${JSON.stringify(data, null, 2)}\n`;
    }
  } catch {
    /* ignore malformed JSON-LD */
  }
}

function getBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const lang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
  return lang.startsWith('cs') || lang.startsWith('sk') ? 'cs' : 'en';
}

const LanguageContext = createContext<{ lang: Lang; t: (typeof criticalTranslations)[Lang] } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => {
    const lang = getBrowserLang();
    return { lang, t: criticalTranslations[lang] };
  }, []);

  useEffect(() => {
    document.documentElement.lang = value.lang;
    applyDocumentSeo(value.t.seo);
  }, [value.lang, value.t.seo]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export type { Lang };
