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
// Kommt aus der Umgebung (.env lokal, Environment-Variablen in Vercel), damit
// die ID nicht im Repo liegt und sich Preview und Produktion trennen lassen.
// Leer = kein Tracking wird geladen, der Cookie-Banner funktioniert trotzdem.
export const GTM_ID = import.meta.env.VITE_GTM_ID || '';
