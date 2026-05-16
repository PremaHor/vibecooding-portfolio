/**
 * Language-split translations loader. Each language sits in its own chunk
 * (translations.cs.ts / translations.en.ts), so a CS visitor never downloads
 * the EN copy and vice versa, roughly half the previous payload.
 */
import type CsTranslations from './translations.cs';

export type Lang = 'cs' | 'en';
export type Translations = typeof CsTranslations;
/** Backwards-compat alias for `keyof Translations`. */
export type TranslationKey = keyof Translations;

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const explicit =
    typeof document !== 'undefined' ? document.documentElement.lang : '';
  const raw = (explicit || navigator.language || '').toLowerCase();
  return raw.startsWith('cs') || raw.startsWith('sk') ? 'cs' : 'en';
}

/** Resolves to translations for the active language. */
export const translationsPromise: Promise<Translations> =
  detectLang() === 'cs'
    ? import('./translations.cs').then((m) => m.default as unknown as Translations)
    : import('./translations.en').then((m) => m.default as unknown as Translations);

let cachedTranslations: Translations | null = null;
translationsPromise.then((t) => {
  cachedTranslations = t;
});

/**
 * Synchronous accessor. Useful for non-React code paths.
 * Throws if called before the promise has resolved - every UI consumer should
 * use `useTranslations()` instead (Suspense-friendly).
 */
export function getTranslationsSync(): Translations {
  if (!cachedTranslations) {
    throw new Error('translations not loaded yet - await translationsPromise');
  }
  return cachedTranslations;
}
