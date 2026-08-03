/**
 * Absichtlich leer.
 *
 * PostCSS sucht seine Konfiguration aufwaerts im Dateibaum. Ohne diese Datei
 * findet der Studio-Build die `postcss.config.js` der Website eine Ebene
 * hoeher und jagt die Studio-Oberflaeche durch Tailwind samt deren
 * Basis-Stilen (unter anderem `cursor: none` auf dem Body). Diese Datei
 * stoppt die Suche.
 */
export default {};
