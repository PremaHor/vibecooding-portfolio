import { CONSENT_CONFIG, CONSENT_STORAGE_KEY, type ConsentStatus } from './consentConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Načte gtag.js a aktivuje GA4 - pouze po udělení souhlasu. Bez souhlasu se skript vůbec nenačte. */
export function injectGtag(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const id = CONSENT_CONFIG.GA4_MEASUREMENT_ID;
  if (!id) return;

  if (document.querySelector('script[data-gtag-injected]')) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.setAttribute('data-gtag-injected', 'true');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  script.onload = () => {
    grantAnalyticsConsent();
    if (window.gtag) window.gtag('config', id);
  };
  document.head.appendChild(script);
}

export function getStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') return stored;
    return null;
  } catch {
    return null;
  }
}

export function saveConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      localStorage.setItem(CONSENT_STORAGE_KEY, status);
    } else {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
  } catch {
    // localStorage may be disabled
  }
}

export function grantAnalyticsConsent(): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

export function injectClarity(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const id = CONSENT_CONFIG.CLARITY_PROJECT_ID;
  if (!id) return;

  // Avoid double injection
  if (document.querySelector('script[data-clarity-injected]')) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.setAttribute('data-clarity-injected', 'true');
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${id}");
  `;
  document.head.appendChild(script);
}

export function applyConsentOnLoad(): void {
  const status = getStoredConsent();
  if (status === 'accepted') {
    injectGtag();
    injectClarity();
  }
}
