import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { translations, type Lang } from './translations';

function getBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || (navigator as any).userLanguage || '';
  return lang.toLowerCase().startsWith('cs') ? 'cs' : 'en';
}

const LanguageContext = createContext<{ lang: Lang; t: typeof translations.cs } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => {
    const lang = getBrowserLang();
    return { lang, t: translations[lang] };
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
