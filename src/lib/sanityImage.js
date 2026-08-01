/**
 * Bild-URLs für Sanity-Assets — immer über den eigenen Proxy (`/api/image`),
 * nie direkt gegen cdn.sanity.io.
 *
 * Hintergrund: Laut AVV (Architektur „Option A") sollen Besucherinnen
 * ausschließlich womensurance.de/Vercel kontaktieren. Ein direkter
 * <img src="https://cdn.sanity.io/...">-Aufruf würde ihre IP an Sanity in die
 * USA übertragen und die geprüfte AVV unzutreffend machen.
 *
 * Bewusst ohne @sanity/image-url: die Bibliothek erzeugt cdn.sanity.io-URLs.
 * Hier wird nur die Asset-Referenz zerlegt und an den Proxy gehängt.
 */

/** "image-<sha1>-<breite>x<hoehe>-<endung>" → "<sha1>-<breite>x<hoehe>.<endung>" */
export function assetDateiname(ref) {
  if (typeof ref !== 'string') return null;
  const m = /^image-([a-f0-9]{40})-(\d{1,5}x\d{1,5})-(\w{2,4})$/i.exec(ref);
  return m ? `${m[1]}-${m[2]}.${m[3]}` : null;
}

/** Nimmt ein Sanity-Bildfeld, eine Asset-Referenz oder den fertigen Dateinamen */
function dateinameAus(quelle) {
  if (!quelle) return null;
  if (typeof quelle === 'string') {
    return quelle.startsWith('image-') ? assetDateiname(quelle) : quelle;
  }
  const ref = quelle.asset?._ref || quelle._ref || quelle.asset?._id || quelle._id;
  return assetDateiname(ref);
}

/**
 * Baut eine Proxy-URL.
 *
 * @param quelle  Sanity-Bildfeld, Asset-Referenz oder Dateiname
 * @param opts    { w, h, q, fit, auto, fm, dpr } — Sanity-Transformationsparameter
 * @returns       "/api/image?id=…" oder null, wenn die Referenz nicht passt
 */
export function urlFor(quelle, opts = {}) {
  const id = dateinameAus(quelle);
  if (!id) return null;

  const params = new URLSearchParams({ id });
  // auto=format liefert WebP/AVIF, wo der Browser es unterstützt
  const standard = { auto: 'format', q: 75, ...opts };

  for (const [key, value] of Object.entries(standard)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }

  return `/api/image?${params.toString()}`;
}

/**
 * srcSet für responsive Bilder — dieselbe Quelle in mehreren Breiten.
 * Beispiel: <img src={urlFor(bild, { w: 800 })} srcSet={srcSetFor(bild)} />
 */
export function srcSetFor(quelle, breiten = [480, 768, 1024, 1440, 1920], opts = {}) {
  const id = dateinameAus(quelle);
  if (!id) return undefined;
  return breiten
    .map((w) => `${urlFor(quelle, { ...opts, w })} ${w}w`)
    .join(', ');
}
