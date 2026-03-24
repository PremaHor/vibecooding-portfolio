import { Link } from 'react-router-dom';
import { Linkedin, Github } from 'lucide-react';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';
import { useLanguage } from '../i18n/LanguageContext';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/p%C5%99emysl-hor%C3%A1k-0590a5326' },
  { name: 'Behance', icon: (
    <svg className="w-6 h-5" viewBox="0 0 34 22" fill="currentColor">
      <path d="M0 0h8.2c1.1 0 2.1.1 3 .4.9.3 1.6.7 2.2 1.2.6.5 1 1.2 1.3 1.9.3.8.4 1.6.4 2.6 0 1.2-.3 2.2-.8 3-.5.8-1.3 1.4-2.3 1.8 1.4.3 2.4 1 3.1 2 .7 1 1 2.1 1 3.5 0 1-.2 1.9-.6 2.7-.4.8-.9 1.4-1.5 1.9-.7.5-1.4.9-2.3 1.2-.9.3-1.8.4-2.7.4H0V0zm4.7 8.8h3.3c.8 0 1.5-.2 2-.6.5-.4.7-1 .7-1.8 0-.5-.1-.9-.3-1.2-.2-.3-.4-.5-.7-.7-.3-.2-.6-.3-1-.3-.4-.1-.7-.1-1.1-.1H4.7v4.7zm0 9.1h3.8c.4 0 .8 0 1.2-.1.4-.1.7-.2 1-.4.3-.2.5-.5.7-.8.2-.4.3-.8.3-1.4 0-1.1-.3-1.8-1-2.3-.6-.4-1.5-.7-2.5-.7H4.7v5.7z"/>
      <path d="M21.2 1.3h8.2v2.1h-8.2V1.3z"/>
      <path d="M29.4 18.3c-.7.7-1.7 1-3 1-1 0-1.8-.3-2.4-.8-.6-.5-1-1.3-1.1-2.3h9.8c.1-1.4 0-2.7-.4-3.9-.4-1.2-1-2.2-1.8-3-.8-.8-1.7-1.5-2.8-1.9-1.1-.4-2.2-.7-3.5-.7-1.2 0-2.3.2-3.3.7-1 .4-1.9 1.1-2.7 1.8-.7.8-1.3 1.7-1.7 2.8-.4 1.1-.6 2.2-.6 3.5 0 1.3.2 2.4.6 3.5.4 1.1 1 2 1.7 2.8.8.8 1.7 1.4 2.7 1.8 1.1.4 2.2.6 3.5.6 1.8 0 3.3-.4 4.5-1.3 1.3-.9 2.1-2.2 2.6-3.9h-3.8c-.2.5-.6 1-1.3 1.3zm-5.3-7.5c.5-.5 1.3-.8 2.3-.8.7 0 1.3.2 1.8.5.5.3.8.8 1 1.3h-6.1c.2-.4.5-.7 1-.9z"/>
    </svg>
  ), url: 'https://www.behance.net/dobryux' },
  { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: 'https://github.com/PremaHor' },
  { name: 'X', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293l13.314 17.411z"/>
    </svg>
  ), url: 'https://x.com/horakpremysl85' },
];

export const Footer = () => {
  const { t, lang } = useLanguage();
  return (
    <footer className="py-10 sm:py-14 px-4 sm:px-6 md:px-8 border-t border-white/10 text-center">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6">
        {SOCIAL_LINKS.map(social => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors duration-300"
            aria-label={`${social.name}, ${lang === 'cs' ? 'otevřít v novém okně' : 'open in new window'}`}
          >
            {social.icon}
          </a>
        ))}
      </div>
      <Link to="/ochrana-soukromi" className="text-white/40 hover:text-white/80 transition-colors block mb-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
        {lang === 'cs' ? fixCzechTypography(t.footer.privacyLink) : fixDashes(t.footer.privacyLink)}
      </Link>
      <p className="text-white/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
        {lang === 'cs' ? fixCzechTypography(t.footer.copyright) : fixDashes(t.footer.copyright)}
      </p>
    </footer>
  );
};
