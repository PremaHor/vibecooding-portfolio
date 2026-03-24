import React, { useEffect } from 'react';
import { Link } from '../router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';
import { fixCzechTypography, fixDashes } from '../utils/czechTypography';

export function PrivacyPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tr = t.privacy;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-12 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'cs' ? fixCzechTypography('Zpět na portfolio') : fixDashes('Back to portfolio')}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-sm sm:prose-base max-w-none"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {lang === 'cs' ? fixCzechTypography(tr.title) : fixDashes(tr.title)}
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mb-10">
            {lang === 'cs' ? fixCzechTypography(tr.lastUpdated) : fixDashes(tr.lastUpdated)}
          </p>

          <section className="mb-10">
            <p className="text-white/80 leading-relaxed">
              {lang === 'cs' ? fixCzechTypography(tr.intro) : fixDashes(tr.intro)}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.analyticsTitle) : fixDashes(tr.analyticsTitle)}
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              {lang === 'cs' ? fixCzechTypography(tr.analyticsText) : fixDashes(tr.analyticsText)}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.dataTitle) : fixDashes(tr.dataTitle)}
            </h2>
            <ul className="list-disc list-inside text-white/80 space-y-2 marker:text-[var(--color-vibe-orange)]">
              {tr.dataList.map((item, i) => (
                <li key={i}>
                  {lang === 'cs' ? fixCzechTypography(item) : fixDashes(item)}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.formTitle) : fixDashes(tr.formTitle)}
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              {lang === 'cs' ? fixCzechTypography(tr.formText) : fixDashes(tr.formText)}
            </p>
            <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2">
              {lang === 'cs' ? fixCzechTypography(tr.formDataTitle) : fixDashes(tr.formDataTitle)}
            </h3>
            <ul className="list-disc list-inside text-white/80 space-y-2 marker:text-[var(--color-vibe-orange)] mb-4">
              {tr.formDataList.map((item: string, i: number) => (
                <li key={i}>
                  {lang === 'cs' ? fixCzechTypography(item) : fixDashes(item)}
                </li>
              ))}
            </ul>
            <p className="text-white/80 leading-relaxed mb-4">
              {lang === 'cs' ? fixCzechTypography(tr.formPurpose) : fixDashes(tr.formPurpose)}
            </p>
            <p className="text-white/60 leading-relaxed text-sm">
              {lang === 'cs' ? fixCzechTypography(tr.formThirdParty) : fixDashes(tr.formThirdParty)}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.purposeTitle) : fixDashes(tr.purposeTitle)}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {lang === 'cs' ? fixCzechTypography(tr.purposeText) : fixDashes(tr.purposeText)}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.revokeTitle) : fixDashes(tr.revokeTitle)}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {lang === 'cs' ? fixCzechTypography(tr.revokeText) : fixDashes(tr.revokeText)}
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
              {lang === 'cs' ? fixCzechTypography(tr.contactTitle) : fixDashes(tr.contactTitle)}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {lang === 'cs' ? fixCzechTypography(tr.contactText) : fixDashes(tr.contactText)}
            </p>
          </section>
        </motion.article>

        <footer className="mt-20 pt-10 border-t border-white/10 text-center text-white/50 text-xs">
          <Link to="/" className="hover:text-white/70 transition-colors">
            {lang === 'cs' ? fixCzechTypography('← Zpět na portfolio') : fixDashes('← Back to portfolio')}
          </Link>
        </footer>
      </div>
    </div>
  );
}
