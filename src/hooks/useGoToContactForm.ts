import { useCallback } from 'react';
import { useRouter } from '../router';

const CONTACT_SECTION_ID = 'contact';

export function useGoToContactForm() {
  const { pathname, navigate } = useRouter();

  return useCallback(() => {
    const isHome = pathname === '/' || pathname === '';
    const section = document.getElementById(CONTACT_SECTION_ID);
    if (isHome && section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        document.getElementById('full-name')?.focus({ preventScroll: true });
      }, 550);
      return;
    }
    navigate('/#contact');
  }, [pathname, navigate]);
}
