import { useState, useEffect } from 'react';
import { Link } from '../router';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useLanguage } from '../i18n/LanguageContext';
import { useGoToContactForm } from '../hooks/useGoToContactForm';

export const Navbar = ({ theme, isProjectPage }: { theme: 'light' | 'dark'; isProjectPage?: boolean }) => {
  const { t, lang } = useLanguage();
  const goToContactForm = useGoToContactForm();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);

  const mobileNavItems = [
    { href: '#work',     label: lang === 'cs' ? fixCzechTypography(t.nav.work)     : fixDashes(t.nav.work) },
    { href: '#services', label: lang === 'cs' ? fixCzechTypography(t.nav.services) : fixDashes(t.nav.services) },
    { href: '#about',    label: lang === 'cs' ? fixCzechTypography(t.nav.about)    : fixDashes(t.nav.about) },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        {lang === 'cs' ? 'Přeskočit na obsah' : 'Skip to content'}
      </a>

      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center gap-2 transition-[background-color,padding,color] duration-500 safe-area-inset-top min-w-0 nav-ios-gpu ${
          scrolled ? 'bg-black/10 nav-blur-active py-3' : 'bg-transparent'
        } ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        aria-label={lang === 'cs' ? 'Hlavní navigace' : 'Main navigation'}
      >
        <Link
          to="/"
          className="flex items-center gap-2 group min-w-0 shrink"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={lang === 'cs' ? 'Přemysl Horák, úvodní stránka' : 'Premysl Horak, homepage'}
        >
          <div className="min-w-0 truncate">
            <span className={`font-bold transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Přemysl Horák</span>
            <span className={`text-sm ml-2 hidden sm:inline-block transition-colors duration-500 ${
              theme === 'dark' ? 'text-gray-400' : 'text-black/60'
            }`}>
              | VibeCooding
            </span>
          </div>
        </Link>

        <div className={`hidden lg:flex gap-6 lg:gap-8 text-xs font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${
          theme === 'dark' ? 'text-white/70' : 'text-black/70'
        }`}>
          {!isProjectPage ? (
            <>
              <a href="#work"     className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.work)     : fixDashes(t.nav.work)}</a>
              <a href="#services" className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.services) : fixDashes(t.nav.services)}</a>
              <a href="#about"    className={`nav-link transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{lang === 'cs' ? fixCzechTypography(t.nav.about)    : fixDashes(t.nav.about)}</a>
            </>
          ) : (
            <Link to="/" className={`hover:text-current transition-colors flex items-center gap-2 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>
              <ArrowLeft className="w-4 h-4" /> {lang === 'cs' ? fixCzechTypography(t.nav.backHome) : fixDashes(t.nav.backHome)}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={goToContactForm}
            className={`nav-cta hidden lg:inline-flex px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-[var(--color-vibe-orange)] hover:text-white'
                : 'bg-black text-white hover:bg-[var(--color-vibe-orange)]'
            }`}
          >
            {lang === 'cs' ? fixCzechTypography(t.nav.start) : fixDashes(t.nav.start)}
          </button>

          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className={`lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] rounded-lg transition-colors -mr-1 ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
            aria-label={mobileMenuOpen
              ? (lang === 'cs' ? fixCzechTypography(t.nav.closeMenu) : fixDashes(t.nav.closeMenu))
              : (lang === 'cs' ? fixCzechTypography(t.nav.openMenu)  : fixDashes(t.nav.openMenu))}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-150 ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            } ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'cs' ? 'Navigační menu' : 'Navigation menu'}
        className={`fixed inset-0 z-[100] lg:hidden bg-[var(--color-vibe-black)] text-white
          transition-[opacity,visibility] duration-300 backface-hidden
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 h-16 border-b border-white/[0.07] bg-[var(--color-vibe-black)]"
          style={{ top: 'env(safe-area-inset-top, 0px)' }}
        >
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2.5 group"
            aria-label={lang === 'cs' ? 'Přemysl Horák, úvodní stránka' : 'Premysl Horak, homepage'}
          >
            <div className="min-w-0 truncate">
              <span className="font-bold text-white">Přemysl Horák</span>
              <span className="text-gray-400 text-sm ml-2 hidden sm:inline-block">
                | VibeCooding
              </span>
            </div>
          </Link>
          <button
            onClick={close}
            className="w-11 h-11 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all shrink-0"
            aria-label={lang === 'cs' ? fixCzechTypography(t.nav.closeMenu) : fixDashes(t.nav.closeMenu)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-5 bg-[var(--color-vibe-black)]"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            type="button"
            onClick={() => {
              close();
              goToContactForm();
            }}
            className="flex items-center justify-center gap-2.5 w-full min-h-[54px] rounded-2xl bg-[var(--color-vibe-orange)] text-black text-sm font-bold uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            {lang === 'cs' ? fixCzechTypography(t.nav.start) : fixDashes(t.nav.start)}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <nav
          aria-label={lang === 'cs' ? 'Hlavní navigace' : 'Main navigation'}
          className="absolute left-0 right-0 overflow-y-auto px-5"
          style={{
            top: 'calc(env(safe-area-inset-top, 0px) + 4rem)',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)',
          }}
        >
          {isProjectPage && (
            <div className="pt-6 pb-2">
              <Link
                to="/"
                onClick={close}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === 'cs' ? fixCzechTypography(t.nav.backHome) : fixDashes(t.nav.backHome)}
              </Link>
            </div>
          )}
          <ul className="flex flex-col py-4">
            {mobileNavItems.map((item, i) => (
              <li key={item.href} className="border-b border-white/[0.07] last:border-0">
                <a
                  href={item.href}
                  onClick={close}
                  className="group flex items-center gap-5 py-5 w-full active:opacity-60 transition-opacity duration-100"
                >
                  <span className="font-display text-[1.7rem] leading-none text-white/85 group-hover:text-white transition-colors duration-200 flex-1">
                    {item.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[var(--color-vibe-orange)] group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
