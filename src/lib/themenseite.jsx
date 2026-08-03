/**
 * Uebersetzt einen Eintrag aus `src/content/themenseiten.json` in die Props,
 * die `TopicPage` erwartet.
 *
 * Die beiden Seitenkomponenten bleiben dadurch auf das reduziert, was sie
 * unterscheidet: welche Grafik unter dem Kopf steht und welche nach dem Zitat.
 */
import { useEffect } from 'react';
import { Satz } from './inhalt';
import themenseiten from '../content/themenseiten.json';

export function themenseite(kennung) {
  const seite = themenseiten.find((s) => s.kennung === kennung);
  if (!seite) throw new Error(`Unterseite "${kennung}" fehlt in src/content/themenseiten.json`);
  return seite;
}

/** Setzt Titel und Beschreibung fuer die Google-Trefferliste. */
export function useSeitenkopf({ metaTitel, metaBeschreibung }) {
  useEffect(() => {
    document.title = metaTitel;
    const meta = document.querySelector('meta[name="description"]');
    const vorher = meta?.getAttribute('content');
    meta?.setAttribute('content', metaBeschreibung);
    return () => {
      if (vorher) meta?.setAttribute('content', vorher);
    };
  }, [metaTitel, metaBeschreibung]);
}

export function topicProps(seite) {
  return {
    eyebrow: seite.eyebrow,
    titleLines: seite.titelZeilen,
    lead: seite.lead,
    stats: seite.kennzahlen.map((k) => ({
      value: k.wert,
      decimals: k.nachkommastellen,
      unit: k.einheit,
      label: k.label,
      source: k.quelle,
    })),
    chapters: seite.kapitel.map((k) => ({ kicker: k.kicker, title: k.titel, paragraphs: k.absaetze })),
    quote: { text: seite.zitat?.text, author: seite.zitat?.autor },
    actions: seite.handlungen.map((h) => ({ title: h.titel, lead: h.lead || undefined, body: h.body })),
    actionsHeadline: seite.handlungenUeberschrift?.length ? (
      <Satz teile={seite.handlungenUeberschrift} grund="hell" />
    ) : null,
    ctaHeadline: <Satz teile={seite.ctaUeberschrift} />,
    ctaBody: seite.ctaText,
    faq: {
      title: <Satz teile={seite.faqUeberschrift} />,
      items: seite.faqEintraege.map((f) => ({ q: f.frage, a: f.antwort })),
      note: seite.faqHinweis,
    },
  };
}
