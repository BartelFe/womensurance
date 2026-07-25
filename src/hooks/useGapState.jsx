import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ── Zahlen-Grundlage (Stand Recherche 07/2026, mit Julia final validieren) ──
// BELEGT:
//  - BASE_GAP 39,4 %  → Destatis, Gender Pension Gap 2023 (eigene Alters-
//    sicherungsleistungen OHNE Hinterbliebenenrenten), PM N016 v. 04/2024.
//  - BASE_EURO 450 €  → DRV 2024: Ø Zahlbetrag Altersrente Männer ~1.405 €,
//    Frauen ~955 € → Differenz ~450 €/Monat (WSI/DRV Rentenbestand).
//  - RETIREMENT_YEARS 20 → Restlebenserwartung Frauen ab 65 ≈ 21 Jahre.
// HERGELEITET (Entgeltpunkt-Logik, Rentenwert 40,79 € seit 07/2025):
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

export const BASE_GAP = 39.4; // % — Gender Pension Gap (Destatis 2023, ohne Hinterbliebene)
export const BASE_EURO = 450; // €/Monat — Ø Rentendifferenz Frau/Mann (DRV 2024)
export const RETIREMENT_YEARS = 20; // für die Lebenssumme auf dem Kassenzettel

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
