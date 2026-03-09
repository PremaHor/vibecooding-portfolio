/**
 * Replace placeholders with your actual IDs.
 * GA4: set in index.html (gtag config) AND here if needed.
 * Clarity: used when injecting script on consent.
 */
export const CONSENT_CONFIG = {
  GA4_MEASUREMENT_ID: 'G-L0TBNLC3D6',
  CLARITY_PROJECT_ID: 'vsrf174num',
} as const;

export const CONSENT_STORAGE_KEY = 'vibecooding_cookie_consent';

export type ConsentStatus = 'accepted' | 'rejected' | null;
