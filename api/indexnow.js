/**
 * Vercel Serverless Function – spustí IndexNow po deployi.
 * Nastav v Vercel → Settings → Deploy Hooks: URL této funkce.
 * Volá se automaticky po každém deployi – Bing/Yandex/Seznam dostanou nové URL.
 */
export default async function handler(req, res) {
  // GET = Vercel Cron, POST = manuální volání
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = {
    host: 'vibecooding.cz',
    key: 'vibecooding-indexnow-a1b2c3d4e5f6',
    keyLocation: 'https://vibecooding.cz/vibecooding-indexnow-a1b2c3d4e5f6.txt',
    urlList: [
      'https://vibecooding.cz/',
      'https://vibecooding.cz/project/risklight',
      'https://vibecooding.cz/project/adcalc',
      'https://vibecooding.cz/project/ddu-olomouc',
      'https://vibecooding.cz/ochrana-soukromi',
      'https://vibecooding.cz/llms.txt',
    ],
  };

  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    res.status(r.ok ? 200 : r.status).json({
      ok: r.ok,
      status: r.status,
      message: r.ok ? `${body.urlList.length} URL odesláno` : text,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
