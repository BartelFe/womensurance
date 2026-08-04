import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { HERO_GAP_VALUE } from '../data/gapStats';
import { AKTUELLER_RENTENWERT } from '../data/rentenwert';

// ── Zahlen-Grundlage (Stand 04.08.2026) ──
// Vollständige Übersicht mit allen Fundstellen, auch für Julia lesbar:
// `Kunden\Womensurance (DVM)\Zahlen und Quellen.md` (plus PDF daneben).
//
// BELEGT:
//  - BASE_GAP kommt aus dem Redaktionssystem (Kennzahl `pension`), aktuell
//    36,0 % → Statistisches Bundesamt, Tabelle „Alterseinkünfte nach
//    Geschlecht sowie Gender Pension Gap", Berichtsjahr 2025, eigene
//    Alterseinkünfte OHNE Hinterbliebenenrenten.
//    ⚠️ Vorher stand hier hartcodiert 39,4 (Berichtsjahr 2023). Destatis hat
//    diesen Wert seither selbst revidiert, auch das Jahr 2023 lautet heute
//    37,7 %. Zahl deshalb nie ohne Blick in die laufende Tabelle zitieren.
//  - BASE_EURO 450 €  → DRV Rentenbestand: Ø Altersrente Männer rund 1.350 €,
//    Frauen rund 900 € → Differenz rund 450 €/Monat.
//  - RETIREMENT_YEARS 15 → bewusst konservativ. Die Restlebenserwartung von
//    Frauen ab 65 liegt höher; gerechnet wird trotzdem nur mit 15,
//    damit die Lebenssumme nicht überzeichnet wirkt (Wunsch Julia/Felix 08/2026).
// HERGELEITET über die Entgeltpunkt-Logik:
//  - parttime 7,5 EP ≈ 15 Jahre 50%-Teilzeit bei Durchschnittslohn.
//  - children 4,4 EP ≈ Elternzeit + verzögerter Wiedereinstieg.
//    (reine Kindererziehungszeiten werden teilweise staatlich kompensiert;
//    der Wert bildet die typischen Folgeeffekte ab, mit Julia schärfen!)
//  - care     3,0 EP ≈ 2 bis 3 Jahre reduzierte Arbeit.
//  - pause    2,2 EP ≈ 2 Jahre ohne Beiträge.
// ⚠️ Kategorien überschneiden sich real (Teilzeit oft WEGEN Kind), die
// Summe ist eine bewusst vereinfachte Beispielrechnung, kein Bescheid.
//
// ⚠️ Die Euro-Beträge werden BERECHNET, nicht eingetragen. Bis 04.08.2026
// standen sie hartcodiert da, hergeleitet mit dem Rentenwert von 40,79 €.
// Als der zum 01.07.2026 auf 42,52 € stieg, lagen sie rund 4 % zu niedrig
// und niemand hat es gemerkt. Jetzt hängt alles an einer Zahl in
// `data/rentenwert.js`, die einmal im Jahr nachgezogen wird.
//
// Ein Lebensereignis wirkt dreifach:
//  - pct   → Beitrag zum prozentualen Pension Gap
//  - ep    → Entgeltpunkte, daraus wird der Euro-Betrag berechnet
//  - x/drop→ Position + Absturz-Tiefe der Linie im Hero-Chart (SVG-Koordinaten)
const LEBENSEREIGNISSE = [
  {
    id: 'pause',
    label: 'Karrierepause',
    short: 'PAUSE',
    pct: 5,
    ep: 2.2,
    x: 204,
    drop: 24,
    receiptLabel: 'Karrierepause',
    receiptSub: 'Jahre ohne Einzahlung',
  },
  {
    id: 'children',
    label: 'Kinder bekommen',
    short: 'KIND',
    pct: 8,
    ep: 4.4,
    x: 300,
    drop: 34,
    receiptLabel: 'Kind & Elternzeit',
    receiptSub: 'Reduzierte Rentenpunkte',
  },
  {
    id: 'parttime',
    label: 'Teilzeit gearbeitet',
    short: 'TEILZEIT',
    pct: 12,
    ep: 7.5,
    x: 390,
    drop: 52,
    receiptLabel: 'Teilzeit über Jahre',
    receiptSub: 'Halbe Stunden, halbe Punkte',
  },
  {
    id: 'care',
    label: 'Angehörige gepflegt',
    short: 'PFLEGE',
    pct: 6,
    ep: 3.0,
    x: 480,
    drop: 40,
    receiptLabel: 'Pflege von Angehörigen',
    receiptSub: 'Unbezahlt, unsichtbar',
  },
];

// Auf 5 € gerundet. Die Werte sind Schätzungen; glatte Zahlen sagen das auch
// optisch, während 318,90 € eine Genauigkeit vortäuschen würde, die es nicht
// gibt. Ergibt aktuell 95, 185, 320 und 130 € (vorher 90, 180, 310, 120).
export const TOGGLE_META = LEBENSEREIGNISSE.map((e) => ({
  ...e,
  euro: Math.round((e.ep * AKTUELLER_RENTENWERT) / 5) * 5,
}));

// Eine Quelle statt zwei: Der Wert steht im Redaktionssystem, nicht hier.
export const BASE_GAP = HERO_GAP_VALUE; // % — Gender Pension Gap, ohne Hinterbliebenenrenten
export const BASE_EURO = 450; // €/Monat — Ø Rentendifferenz Frau/Mann (DRV 2024)
export const RETIREMENT_YEARS = 15; // für die Lebenssumme auf dem Rentenbescheid

const GapContext = createContext(null);

export function GapProvider({ children }) {
  const [toggles, setToggles] = useState({
    pause: false,
    children: false,
    parttime: false,
    care: false,
  });

  const toggle = useCallback((key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const activeMeta = useMemo(
    () => TOGGLE_META.filter((m) => toggles[m.id]),
    [toggles]
  );

  const gap = useMemo(() => {
    const total = BASE_GAP + activeMeta.reduce((s, m) => s + m.pct, 0);
    return Math.min(total, 78); // realistisch deckeln
  }, [activeMeta]);

  const euroGap = useMemo(
    () => BASE_EURO + activeMeta.reduce((s, m) => s + m.euro, 0),
    [activeMeta]
  );

  const value = useMemo(
    () => ({
      toggles,
      toggle,
      gap,
      baseGap: BASE_GAP,
      euroGap,
      baseEuro: BASE_EURO,
      activeMeta,
      meta: TOGGLE_META,
    }),
    [toggles, toggle, gap, euroGap, activeMeta]
  );

  return <GapContext.Provider value={value}>{children}</GapContext.Provider>;
}

export function useGap() {
  const ctx = useContext(GapContext);
  if (!ctx) throw new Error('useGap must be used inside GapProvider');
  return ctx;
}
