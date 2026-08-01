/**
 * Bild-Proxy (AVV-Architektur „Option A").
 *
 * Bilder liegen im Sanity Content Lake, werden aber NICHT direkt vom
 * Sanity-CDN geladen. Stattdessen holt diese Vercel-Function sie serverseitig
 * und liefert sie unter womensurance.de aus. Dadurch kontaktiert der Browser
 * einer Besucherin ausschließlich Vercel — Sanity fällt aus dem
 * Besucher-Datenpfad heraus (keine IP-Übermittlung in die USA).
 * Sanity bleibt Unterauftragsverarbeiter für die Redaktionsdaten.
 *
 * ⚠️ Kein offener Proxy: Es werden ausschließlich Assets des eigenen Projekts
 * und Datasets ausgeliefert, der Dateiname wird strikt validiert und nur eine
 * Whitelist an Transformationsparametern durchgereicht.
 *
 * Region ist in vercel.json auf fra1 gepinnt (so in der AVV beschrieben).
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '10o1bkel';
const DATASET = process.env.SANITY_DATASET || 'production';

/** Sanity-Assetname: <sha1>-<breite>x<hoehe>.<endung> */
const ASSET_RE = /^[a-f0-9]{40}-\d{1,5}x\d{1,5}\.(?:jpg|jpeg|png|webp|gif|svg)$/i;

/** Nur diese Transformationsparameter werden an das Sanity-CDN weitergegeben */
const ERLAUBTE_PARAMS = new Set([
  'w', 'h', 'q', 'fit', 'auto', 'fm', 'dpr',
  'rect', 'crop', 'blur', 'sharp', 'flip', 'or', 'bg',
]);

const PARAM_WERT_RE = /^[\w.,-]{1,40}$/;

const TIMEOUT_MS = 10_000;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, ...rest } = req.query;

  if (typeof id !== 'string' || !ASSET_RE.test(id)) {
    return res.status(400).json({ error: 'Ungültige Asset-Referenz' });
  }

  const upstream = new URL(
    `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}`
  );

  for (const [key, value] of Object.entries(rest)) {
    if (!ERLAUBTE_PARAMS.has(key)) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (typeof v !== 'string' || !PARAM_WERT_RE.test(v)) continue;
    upstream.searchParams.set(key, v);
  }

  const abbruch = AbortSignal.timeout(TIMEOUT_MS);

  let antwort;
  try {
    antwort = await fetch(upstream, {
      method: req.method,
      signal: abbruch,
      headers: {
        // Nur das Nötigste weiterreichen — keine Cookies, kein User-Agent,
        // keine IP-verratenden Header der Besucherin.
        accept: 'image/*',
      },
    });
  } catch (err) {
    const timeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    return res.status(timeout ? 504 : 502).json({ error: 'Bild nicht erreichbar' });
  }

  if (!antwort.ok) {
    // Upstream-Fehlertext bewusst nicht durchreichen
    return res.status(antwort.status === 404 ? 404 : 502).json({ error: 'Bild nicht gefunden' });
  }

  const typ = antwort.headers.get('content-type') || '';
  if (!typ.startsWith('image/')) {
    return res.status(502).json({ error: 'Unerwarteter Inhaltstyp' });
  }

  res.setHeader('Content-Type', typ);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Der sha1 im Dateinamen macht die URL inhaltsstabil → dauerhaft cachebar
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');

  const laenge = antwort.headers.get('content-length');
  if (laenge) res.setHeader('Content-Length', laenge);

  // SVG kann Skripte enthalten — als Bild eingebunden ist das harmlos,
  // beim Direktaufruf sperrt die CSP alles weg.
  if (typ.includes('svg')) {
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
  }

  if (req.method === 'HEAD') return res.status(200).end();

  const puffer = Buffer.from(await antwort.arrayBuffer());
  return res.status(200).send(puffer);
}
