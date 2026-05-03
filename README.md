# Womensurance — Awwwards 2026 Build

Editorial Data-Story für Womensurance (Marke der DVM Ingolstadt, Inhaberin Julia Pashchenko). Konzept: **Die Lücke** — eine scroll-driven Reportage über den Gender Pension Gap, die in Julia als persönliche Antwort aufgelöst wird.

## Stack

- **Vite** + **React 18**
- **Tailwind CSS 3**
- **GSAP** + **ScrollTrigger** (gesamte Motion-Schicht)
- **Lenis** (smooth scroll, GSAP-synced)
- **React Three Fiber** + **drei** (Particle Field im Hero)
- **Fraunces** (Variable Display, Italic + SOFT axis) + **Geist** (Body) + **JetBrains Mono** (Accent)

## Setup

```bash
npm install
npm run dev    # localhost:5173
npm run build  # production build to dist/
```

## Story-Architektur (Akt-Reihenfolge)

| # | Komponente | Mechanik |
|---|------------|----------|
| 00 | `Loader` | Brand-Moment, Counter 0 → 39.4, Variable Font Weight Tween |
| 01 | `OpeningStatement` | Char-by-char Reveal, R3F Partikel-Hintergrund |
| 02 | `TheGap` | Pinned scrub: SVG-Lines divergieren, Big-Number zählt hoch, Stat-Ticker |
| 03 | `YourLife` | Pinned horizontaler Scroll, 7 Lebensphasen, **interaktive Toggles ändern Live-Lücke** |
| 04 | `TheTruth` | Bridge — übernimmt personalisierte Lücke aus Akt 02/03 |
| 05 | `MeetJulia` | Editorial Portrait: Pull-Quote, clip-path Image-Reveals, Bio |
| 06 | `TheMethod` | Sticky-Stack Cards, jede Karte stackt auf vorherige |
| 07 | `Voices` | Editorial-Testimonials, vertikal gestapelt (kein Slider) |
| 08 | `TheStep` | Magnetic-Button CTA, radial-glow background |

## Cross-cutting Layer

- `Cursor` — kontext-bewusst (default · link · image · toggle), mix-blend-difference
- `GrainOverlay` — fixed SVG noise, blend-mode overlay 5 %
- `Lenis` — global smooth scroll, GSAP-ticker integriert
- `GapProvider` — shared state für interaktive Lücken-Berechnung über Sektionen hinweg

## Was du noch tauschen musst (Platzhalter)

| Stelle | Datei | Aktuell | Zu tauschen |
|--------|-------|---------|-------------|
| Julia-Portraits | `MeetJulia.jsx` | Gradient-Placeholders mit "J" | Drei echte Portraits (4:5 + 2× 1:1) |
| Logo-Wordmark | `Nav.jsx`, `Footer.jsx` | Type-set "womensurance" | SVG-Logo wenn vorhanden |
| Stats | `data/gapStats.js` | Größenordnungen | Exakte Zahlen + Quellen (Stat. Bundesamt) |
| Testimonials | `data/voices.js` | Geschriebene Platzhalter | Echte Kundinnenstimmen |
| Impressum | `Footer.jsx` | Dummy-Text | Vollständige Daten |
| Lebensphasen-Mathe | `hooks/useGapState.jsx` | Plausible Approximation | Mit Julia abgleichen ob's hinkommt |

## Architektur-Notizen

- **Editorial-Stack statt AI-Default**: Fraunces (variable Italic, SOFT axis für emotionale Headlines) + Geist (technisch-präzise) + JetBrains Mono (für Daten und Captions). Bewusst kein Cormorant Garamond / Inter — die sind durch.
- **Farbsystem geschärft**: `#ff2e88` (Pink, schärfer als das alte `#E8197D`), `#0a0807` (Ink, fast schwarz mit Wärme), `#f4ede4` (Paper, warm cream). Über CSS-Vars **und** Tailwind-Tokens, einheitlich nutzbar.
- **Scroll-Performance**: Alle ScrollTriggers sind in `gsap.context()` gewrapped → sauberes Cleanup. Lenis läuft im GSAP-Ticker, kein doppeltes RAF.
- **Reduced Motion**: Hook ist da (`useReducedMotion`), aber noch nicht in jeder Section verkabelt — TODO falls Accessibility-Audit kommt.

## Mögliche nächste Schritte

1. **Code-Split R3F** — der Three.js-Bundle ist 70 % der initial-load. Dynamic-import von `BackgroundField`, lazy-load wenn Hero im Viewport.
2. **Real Portraits** — Julia braucht ein professionelles Shooting für Akt 04. Drei Settings: Office, Outdoor (Ingolstadt), Detail.
3. **Akt 03 finetuning** — die Toggle-Mathe ist plausibel, aber wenn Julia sie für Beratung nutzt, sollten die Werte mit ihrer Logik übereinstimmen.
4. **Booking-Embed** — aktuell verlinkt CTA zu Outlook. Inline-Embed wäre cleaner aber Outlook bietet das nur über iframe an, mit eigenen Limits.
5. **OG-Image + Meta** — fehlt noch, vor Live-Schaltung ergänzen.

— Build by Claude für Felix, Mai 2026.
