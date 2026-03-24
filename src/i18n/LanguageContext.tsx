import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { criticalTranslations, type Lang } from './translations-critical';

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
  }, [value.lang]);

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
