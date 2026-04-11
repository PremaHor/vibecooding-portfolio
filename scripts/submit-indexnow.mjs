#!/usr/bin/env node
/**
 * IndexNow – notifikace Bing, Yandex, Seznam o novém obsahu.
 * Nepotřebuje Bing Webmaster Tools – stačí key soubor na webu.
 *
 * Automaticky: Vercel Cron volá /api/indexnow denně v 6:00 UTC.
 * Manuálně: npm run indexnow (po prvním deployi, až je key soubor živě)
 */
const SITE_URL = 'https://premyslhorak.cz';
const KEY = 'premyslhorak-indexnow-a1b2c3d4e5f6';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const urlList = [
  `${SITE_URL}/`,
  `${SITE_URL}/project/risklight`,
  `${SITE_URL}/project/adcalc`,
  `${SITE_URL}/project/ddu-olomouc`,
  `${SITE_URL}/project/void-interface`,
  `${SITE_URL}/ochrana-soukromi`,
  `${SITE_URL}/llms.txt`,
  `${SITE_URL}/robots.txt`,
];

async function submit() {
  const body = {
    host: 'premyslhorak.cz',
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log(`[IndexNow] OK (${res.status}) – ${urlList.length} URL odesláno do Bing, Yandex, Seznam...`);
    } else {
      console.warn(`[IndexNow] ${res.status} ${res.statusText}`, await res.text());
    }
  } catch (err) {
    console.warn('[IndexNow] Chyba:', err.message);
  }
}

submit();
