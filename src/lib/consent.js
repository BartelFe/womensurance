// Consent-Verwaltung + consent-gated GTM-Loader.
// DSGVO-Prinzip: KEIN Tracking-Script wird geladen, bevor die Nutzerin
// aktiv eingewilligt hat. Google Consent Mode v2 wird mit "denied"
// vorbelegt und erst nach Einwilligung aktualisiert.

import { GTM_ID } from '../config/site';

export const CONSENT_KEY = 'wmns-consent-v1';

export const CATEGORIES = [
  {
    id: 'essential',
    label: 'Essenziell',
    required: true,
    description:
      'Technisch notwendig, damit die Website funktioniert (z. B. das Speichern dieser Cookie-Auswahl). Kann nicht deaktiviert werden.',
  },
  {
    id: 'analytics',
    label: 'Statistik',
    required: false,
    description:
      'Hilft uns zu verstehen, wie die Website genutzt wird (z. B. Google Tag Manager / Analytics). Daten werden erst nach deiner Einwilligung erhoben.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    required: false,
    description:
      'Ermöglicht Wiedererkennung über Plattformen hinweg (z. B. Meta Pixel für Instagram/TikTok-Anzeigen). Wird erst nach deiner Einwilligung geladen.',
  },
];

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.choices) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function storeConsent(choices) {
  const record = {
    choices: { ...choices, essential: true },
    timestamp: new Date().toISOString(),
    version: 1,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* private mode */
  }
  applyConsent(record.choices);
  return record;
}

let gtmLoaded = false;

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Consent Mode v2 Default: alles denied, bevor irgendein Tag lädt */
export function initConsentDefaults() {
  ensureDataLayer();
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

/** Wendet eine Einwilligung an: Consent-Update + ggf. GTM nachladen */
export function applyConsent(choices) {
  ensureDataLayer();
  gtag('consent', 'update', {
    analytics_storage: choices.analytics ? 'granted' : 'denied',
    ad_storage: choices.marketing ? 'granted' : 'denied',
    ad_user_data: choices.marketing ? 'granted' : 'denied',
    ad_personalization: choices.marketing ? 'granted' : 'denied',
  });
  window.dataLayer.push({ event: 'wmns_consent_update', consent: choices });

  if ((choices.analytics || choices.marketing) && GTM_ID && !gtmLoaded) {
    loadGTM(GTM_ID);
  }
}

/** Lädt den GTM-Container — wird NUR nach Einwilligung aufgerufen */
function loadGTM(id) {
  gtmLoaded = true;
  ensureDataLayer();
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}
