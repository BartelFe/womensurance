import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const GapContext = createContext(null);

// Plausible (not exact) gap math:
// Base gender pension gap = 39%. Each toggle compounds.
const TOGGLE_IMPACT = {
  parttime: 12, // working part-time
  children: 8, // taking parental leave
  care: 6, // caring for relatives
  pause: 5, // career break
};

const BASE_GAP = 39;

export function GapProvider({ children }) {
  const [toggles, setToggles] = useState({
    parttime: false,
    children: false,
    care: false,
    pause: false,
  });

  const toggle = useCallback((key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const gap = useMemo(() => {
    let total = BASE_GAP;
    Object.entries(toggles).forEach(([key, on]) => {
      if (on) total += TOGGLE_IMPACT[key];
    });
    // Cap realistically
    return Math.min(total, 78);
  }, [toggles]);

  const value = useMemo(
    () => ({ toggles, toggle, gap, baseGap: BASE_GAP }),
    [toggles, toggle, gap]
  );

  return <GapContext.Provider value={value}>{children}</GapContext.Provider>;
}

export function useGap() {
  const ctx = useContext(GapContext);
  if (!ctx) throw new Error('useGap must be used inside GapProvider');
  return ctx;
}
