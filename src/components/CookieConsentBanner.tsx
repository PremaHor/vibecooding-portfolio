import { useState, useEffect, useCallback } from 'react';
import { Link } from '../router';
import { Cookie } from 'lucide-react';
import {
  getStoredConsent,
  saveConsent,
  injectGtag,
  injectClarity,
  applyConsentOnLoad,
} from '../lib/consent';
import { useLanguage } from '../i18n/LanguageContext';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';

export function CookieConsentBanner() {
  const { t, lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const status = getStoredConsent();
    if (status === 'accepted') {
      applyConsentOnLoad();
    } else if (status === null) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = useCallback((afterDismiss: () => void) => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      afterDismiss();
    }, 320);
  }, []);

  const handleAccept = () => dismiss(() => { saveConsent('accepted'); injectGtag(); injectClarity(); });
  const handleReject = () => dismiss(() => { saveConsent('rejected'); });

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 safe-area-inset-bottom pointer-events-none ${isExiting ? 'cookie-exit' : 'cookie-enter'}`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-2xl mx-auto bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 pointer-events-auto">
        <div className="flex gap-4 sm:gap-5">
          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-vibe-orange)]/20 flex items-center justify-center text-[var(--color-vibe-orange)]">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="cookie-consent-title"
              className="font-display text-lg sm:text-xl font-bold text-white mb-2"
            >
              {lang === 'cs' ? fixCzechTypography(t.cookieConsent.title) : fixDashes(t.cookieConsent.title)}
            </h2>
            <p
              id="cookie-consent-desc"
              className="text-sm sm:text-base text-white/75 leading-relaxed mb-4"
            >
              {lang === 'cs' ? fixCzechTypography(t.cookieConsent.description) : fixDashes(t.cookieConsent.description)}
            </p>
            <p className="text-xs text-white/70 mb-5 sm:mb-6">
              <Link to="/ochrana-soukromi" className="underline hover:text-white/85 transition-colors">
                {lang === 'cs' ? fixCzechTypography(t.cookieConsent.privacyLink) : fixDashes(t.cookieConsent.privacyLink)}
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAccept}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold bg-[var(--color-vibe-orange)] text-black hover:bg-[var(--color-vibe-orange)]/90 active:scale-[0.98] transition-all"
              >
                {lang === 'cs' ? fixCzechTypography(t.cookieConsent.acceptAll) : fixDashes(t.cookieConsent.acceptAll)}
              </button>
              <button
                onClick={handleReject}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 active:scale-[0.98] transition-all"
              >
                {lang === 'cs' ? fixCzechTypography(t.cookieConsent.reject) : fixDashes(t.cookieConsent.reject)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
