import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Bettet das erzeugte Stylesheet direkt in die index.html ein.
 *
 * Ein <link rel="stylesheet"> blockiert das Rendern: der Browser malt nichts,
 * bevor die Datei da ist. Das kostet auf gedrosseltem Mobilfunk eine volle
 * Rundreise, gemessen rund 450 ms, und trifft ausgerechnet den Vorab-Anstrich
 * aus der index.html, der ja gerade dafuer da ist, frueh etwas zu zeigen.
 *
 * Das Stylesheet ist mit 41 kB roh (rund 9 kB komprimiert) klein genug, um es
 * mitzuschicken. Alle url()-Verweise darin sind absolut (/fonts/...), das
 * Verschieben in die HTML aendert also keine Pfade.
 *
 * Wenn Vite die Datei kuenftig anders einbindet und der Austausch nicht mehr
 * greift, wird nur gewarnt statt abgebrochen: Builds laufen auch automatisch
 * per Sanity-Webhook, wenn Julia etwas veroeffentlicht. Ein reiner
 * Tempo-Kniff darf ihr niemals einen Deploy zerschiessen.
 */
function cssEinbetten() {
  return {
    name: 'css-einbetten',
    enforce: 'post',
    apply: 'build',
    generateBundle(_optionen, buendel) {
      const html = buendel['index.html'];
      if (!html) return;

      let getauscht = 0;
      const quelltext = String(html.source).replace(/<link\b[^>]*>/g, (tag) => {
        if (!/rel="stylesheet"/.test(tag)) return tag;
        const treffer = tag.match(/href="\/?([^"]+\.css)"/);
        const datei = treffer && buendel[treffer[1]];
        if (!datei) return tag;
        getauscht += 1;
        return `<style>${datei.source}</style>`;
      });

      if (getauscht === 0) {
        this.warn('css-einbetten: kein Stylesheet gefunden, index.html unveraendert');
        return;
      }
      html.source = quelltext;
    },
  };
}

export default defineConfig({
  plugins: [react(), cssEinbetten()],
  server: { port: 5173, host: true },
});
