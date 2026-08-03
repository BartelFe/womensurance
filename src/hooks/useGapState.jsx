import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { HERO_GAP_VALUE } from '../data/gapStats';

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
// HERGELEITET (Entgeltpunkt-Logik, Rentenwert 40,79 € Stand 07/2025):
// ⚠️ Der Rentenwert liegt seit 01.07.2026 bei 42,52 €. Die vier Euro-Beträge
//    unten sind noch mit 40,79 € hergeleitet und damit rund 4 % zu niedrig.
//    Bewusst offen: gehört zusammen mit Julia neu geschärft, weil sich dabei
//    auch die Frage der Überschneidung der Kategorien stellt.
//  - parttime 310 €  ≈ 15 Jahre 50%-Teilzeit bei Ø-Lohn = 7,5 EP × 40,79 €.
//  - children 180 €  ≈ Elternzeit + verzögerter Wiedereinstieg ~4,4 EP.
//    (reine Kindererziehungszeiten werden tlw. staatlich kompensiert —
//    Wert bildet die typischen Folgeeffekte ab; mit Julia schärfen!)
//  - care 120 €      ≈ 2–3 Jahre reduzierte Arbeit ~3 EP.
//  - pause 90 €      ≈ 2 Jahre ohne Beiträge ~2,2 EP.
// ⚠️ Kategorien überschneiden sich real (Teilzeit oft WEGEN Kind) — die
// Summe ist eine bewusst vereinfachte Beispielrechnung, kein Bescheid.
//
// Ein Lebensereignis wirkt dreifach:
//  - pct   → Beitrag zum prozentualen Pension Gap
//  - euro  → geschätzter monatlicher Renten-Verlust in €
//  - x/drop→ Position + Absturz-Tiefe der Linie im Hero-Chart (SVG-Koordinaten)
export const TOGGLE_META = [
  {
    id: 'pause',
    label: 'Karrierepause',
    short: 'PAUSE',
    pct: 5,
    euro: 90,
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
    euro: 180,
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
    euro: 310,
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
    euro: 120,
    x: 480,
    drop: 40,
    receiptLabel: 'Pflege von Angehörigen',
    receiptSub: 'Unbezahlt, unsichtbar',
  },
];

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
