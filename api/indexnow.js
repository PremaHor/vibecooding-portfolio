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
    host: 'premyslhorak.cz',
    key: 'premyslhorak-indexnow-a1b2c3d4e5f6',
    keyLocation: 'https://premyslhorak.cz/premyslhorak-indexnow-a1b2c3d4e5f6.txt',
    urlList: [
      'https://premyslhorak.cz/',
      'https://premyslhorak.cz/project/risklight',
      'https://premyslhorak.cz/project/adcalc',
      'https://premyslhorak.cz/project/ddu-olomouc',
      'https://premyslhorak.cz/project/void-interface',
      'https://premyslhorak.cz/ochrana-soukromi',
      'https://premyslhorak.cz/llms.txt',
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
