// Kundinnenstimmen. Inhalt aus dem Redaktionssystem, Mechanik siehe
// src/data/lifePhases.js.
//
// ⚠️ Die Liste ist zum Projektstand bewusst LEER. Die früheren drei Einträge
// waren erfundene Beispieltexte. Erfundene Kundenstimmen dürfen nicht online
// gehen (§ 5b Abs. 3 UWG verlangt für Bewertungen eine Echtheitsprüfung), und
// die AVV nennt "in Testimonials genannte Personen" ausdrücklich als
// betroffene Personengruppe.
//
// Die Sektion `Voices` blendet sich vollständig aus, solange die Liste leer
// ist. Sobald Julia im Redaktionssystem echte Stimmen veröffentlicht (dort mit
// Pflichthaken "Einverständnis liegt vor"), erscheint sie von selbst wieder.

import roh from '../content/stimmen.json';

export const voices = [...roh]
  .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0))
  .map((s) => ({
    id: s.kennung,
    quote: s.zitat,
    name: s.name,
    role: s.rolle,
    age: s.alter,
    location: s.ort,
    context: s.kontext,
  }));
