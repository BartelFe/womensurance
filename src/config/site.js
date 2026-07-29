// Zentrale Site-Konstanten — eine Quelle statt vier Kopien.

export const BOOKING_URL =
  'https://outlook.office.com/book/Womensurance@dvm.de/?ismsaljsauthenabled';

// TikTok entfernt (07/2026: Julia bespielt den Kanal nicht mehr).
export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', short: 'IG', url: 'https://www.instagram.com/womensurance/' },
  { id: 'linkedin', label: 'LinkedIn', short: 'in', url: 'https://www.linkedin.com/in/julia-pashchenko/' },
];

// Länge des kostenlosen Erstgesprächs — an einer Stelle pflegen.
export const CALL_MINUTES = 60;

// Google Tag Manager Container-ID (z.B. 'GTM-XXXXXXX').
// Leer lassen = kein Tracking wird geladen, Cookie-Banner funktioniert trotzdem.
// Wird erst befüllt, wenn Felix den GTM-Container angelegt hat (Phase 4 der Roadmap).
export const GTM_ID = '';
