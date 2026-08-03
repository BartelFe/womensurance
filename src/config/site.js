// Zentrale Site-Konstanten: eine Quelle statt vier Kopien.
//
// Buchungslink, Social-Profile und die Länge des Erstgesprächs pflegt die
// Redaktion selbst (Sanity → src/content/startseite.json). Die Rückfallwerte
// hier greifen nur, falls ein Feld einmal leer ist, damit kein Knopf ins
// Leere führt.

import startseite from '../content/startseite.json';

export const BOOKING_URL =
  startseite.buchungsUrl || 'https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled';

// TikTok entfernt (07/2026: Julia bespielt den Kanal nicht mehr).
// Kurzform und Symbol hängen an der Kennung des Netzwerks, deshalb sind im
// Redaktionssystem nur Instagram und LinkedIn wählbar.
const KURZ = { instagram: 'IG', linkedin: 'in' };

export const SOCIALS = (startseite.socialProfile || []).map((p) => ({
  id: p.netzwerk,
  label: p.label,
  short: KURZ[p.netzwerk] || '',
  url: p.url,
}));

// Länge des kostenlosen Erstgesprächs, an einer Stelle pflegen.
// Wird über den Platzhalter {minuten} in alle Texte eingesetzt, in denen die
// Dauer vorkommt (Startseite, beide Unterseiten, Kurzprofil).
export const CALL_MINUTES = startseite.gespraechsdauer ?? 60;

// Google Tag Manager Container-ID (z.B. 'GTM-XXXXXXX').
// Kommt aus der Umgebung (.env lokal, Environment-Variablen in Vercel), damit
// die ID nicht im Repo liegt und sich Preview und Produktion trennen lassen.
// Leer = kein Tracking wird geladen, der Cookie-Banner funktioniert trotzdem.
export const GTM_ID = import.meta.env.VITE_GTM_ID || '';
