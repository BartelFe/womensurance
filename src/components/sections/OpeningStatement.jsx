import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// three.js und React-Three-Fiber machen den mit Abstand groessten Teil des
// Bundles aus und werden fuer nichts gebraucht ausser dem dekorativen
// Partikelfeld hinter dem Kopfbereich. Als statischer Import lagen sie im
// Haupt-Bundle und mussten geladen, geparst und ausgefuehrt sein, bevor
// ueberhaupt etwas auf dem Bildschirm stand. Jetzt kommen sie als eigenes
// Stueck nach. Siehe den Effekt unten, warum das nicht sichtbar wird.
const BackgroundField = lazy(() => import('../canvas/BackgroundField'));
import { splitChars } from '../../utils/splitText';
import { BOOKING_URL } from '../../config/site';
import { useGap, TOGGLE_META } from '../../hooks/useGapState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { de1 } from '../../utils/format';
import { satzText, klasseFuerStil } from '../../lib/inhalt';
import startseite from '../../content/startseite.json';

// ── Chart-Geometrie (viewBox 0 0 600 400) ─────────────────────
// Lebensphasen-Raster (Spaltenköpfe)
const LIFE_PHASES = [
  { age: '25', label: 'AUSBILDUNG',   pos: 7,  mobileLabel: false },
  { age: '28', label: 'ERSTER JOB',  pos: 18, mobileLabel: true  },
  { age: '32', label: 'BEZIEHUNG',   pos: 34, mobileLabel: false },
  { age: '35', label: 'KIND',        pos: 50, mobileLabel: true  },
  { age: '42', label: 'TEILZEIT',    pos: 65, mobileLabel: false },
  { age: '50', label: 'CARE-ARBEIT', pos: 80, mobileLabel: false },
  { age: '67', label: 'RENTE',       pos: 96, mobileLabel: true  },
];

// Stützstellen (x) und Grundverläufe (y) beider Linien (viewBox 600×440).
// Weiblich = Durchschnitts-Story (39,4 %): der Auto-Play-Drop beim Zeichnen.
// Die Basis-Kurve endet bewusst "hoch" (260), damit die Toggles die Lücke
// sichtbar weiter aufreißen können (max. Drop-Summe 150 → Ende 410 < Floor 425).
// Nebeneffekt: Lückenlänge bleibt grob proportional zum Prozentwert
// (39,4 % ≙ 150px · 70 % ≙ ~300px).
const XS       = [0,   24,  108, 204, 300, 390, 480, 576, 600];
const MALE_Y   = [170, 169, 164, 150, 133, 124, 117, 111, 110];
const FEMALE_Y = [170, 172, 180, 196, 220, 238, 252, 258, 260];
const VIEW_H = 440;
const Y_FLOOR = 425; // unterhalb reißt das Chart optisch aus

// Catmull-Rom → kubische Bézier-Segmente ("C x1,y1 x2,y2 x,y …")
function smoothSegments(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`;
  }
  return d;
}

function linePath(ys) {
  const pts = XS.map((x, i) => [x, ys[i]]);
  return `M ${pts[0][0]},${pts[0][1]}${smoothSegments(pts)}`;
}

// Fläche zwischen weiblicher und männlicher Linie (Lücke)
const MALE_REVERSED = smoothSegments(XS.map((x, i) => [x, MALE_Y[i]]).reverse());
function areaPath(ys) {
  return `${linePath(ys)} L 600,${MALE_Y[MALE_Y.length - 1]}${MALE_REVERSED} Z`;
}

const MALE_PATH = linePath(MALE_Y);

export default function OpeningStatement() {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const maleLineRef = useRef(null);
  const femaleLineRef = useRef(null);
  const areaRef = useRef(null);
  const gapLineRef = useRef(null);
  const gapLabelRef = useRef(null);
  const gridRef = useRef(null);
  const chipsRef = useRef(null);
  const counterBoxRef = useRef(null);
  const euroRef = useRef(null);

  const { toggles, toggle, gap, euroGap } = useGap();
  const reduced = useReducedMotion();

  const [introDone, setIntroDone] = useState(false);
  const chartReady = useRef(false);

  // Partikelfeld nachladen.
  //
  // Der Ladebildschirm ("Wie sicher bist du wirklich?") deckt die ersten vier
  // Sekunden den kompletten Bildschirm ab. Das Nachladen faellt in dieses
  // Fenster: weil three.js hinter dem Ladebildschirm aufgebaut wird, ist das
  // Feld bereits da, wenn der Vorhang hochgeht. Fuer Rueckkehrerinnen ohne
  // Ladebildschirm blendet es sich weich ein statt aufzuploppen (siehe
  // BackgroundField).
  //
  // Der Abruf startet aber bewusst NICHT sofort beim Mounten. Der Brocken ist
  // 220 kB gross und war damit der laengste Strang im Abhaengigkeitsbaum: er
  // hat auf gedrosseltem Mobilfunk knapp eine Sekunde lang die Leitung mit
  // Stylesheet und Schriften geteilt, die beide sichtbar gebraucht werden,
  // waehrend das Feld hinter dem Vorhang liegt und niemand es sieht. Also
  // erst, wenn der Hauptthread Luft hat, spaetestens nach 1,5 Sekunden. Das
  // liegt komfortabel vor dem Ende des Ladebildschirms, sichtbar aendert sich
  // dadurch nichts.
  //
  // Bei "Bewegung reduzieren" wird es gar nicht erst geladen: ein dauerhaft
  // driftendes Partikelfeld ist genau die Art von Bewegung, die dann
  // unerwuenscht ist, und spart nebenbei den gesamten Brocken.
  const [feldBereit, setFeldBereit] = useState(false);
  useEffect(() => {
    if (reduced) return undefined;
    let abgebrochen = false;

    const holen = () => {
      import('../canvas/BackgroundField').then(
        () => { if (!abgebrochen) setFeldBereit(true); },
        // Faellt der Abruf aus (Netz weg, Chunk fehlt), bleibt der Kopfbereich
        // ohne Partikel. Er ist Deko, dafuer bricht nichts.
        () => {}
      );
    };

    // requestIdleCallback fehlt in aelteren Safari-Versionen, daher der Timer
    // als Ersatz. Beide Wege landen im selben Zeitfenster.
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(holen, { timeout: 1500 });
      return () => { abgebrochen = true; cancelIdleCallback(id); };
    }
    const id = setTimeout(holen, 1200);
    return () => { abgebrochen = true; clearTimeout(id); };
  }, [reduced]);
  const firstRun = useRef(true);
  const displayedEuro = useRef(0);
  const ysRef = useRef(null);

  // Ziel-Y-Werte aus aktiven Toggles: jeder Klick drückt die Linie ab
  // seinem Lebensereignis-Punkt weiter nach unten.
  const targetYs = useMemo(() => {
    return XS.map((x, i) => {
      let y = FEMALE_Y[i];
      TOGGLE_META.forEach((m) => {
        if (toggles[m.id] && x >= m.x) y += m.drop;
      });
      return Math.min(y, Y_FLOOR);
    });
  }, [toggles]);

  const updatePaths = (ys) => {
    if (femaleLineRef.current) femaleLineRef.current.setAttribute('d', linePath(ys));
    if (areaRef.current) areaRef.current.setAttribute('d', areaPath(ys));
    // Lücken-Konnektor (Rente, x=576): von Männer- zu Frauen-Linie
    const yFemale = ys[XS.indexOf(576)];
    const yMale = MALE_Y[XS.indexOf(576)];
    if (gapLineRef.current) {
      gapLineRef.current.setAttribute('y1', yMale);
      gapLineRef.current.setAttribute('y2', yFemale);
    }
    if (gapLabelRef.current) {
      const mid = (yMale + yFemale) / 2;
      gapLabelRef.current.style.top = `${(mid / VIEW_H) * 100}%`;
    }
  };

  // ── Intro / Auto-Play-Story ──────────────────────────────────
  useEffect(() => {
    if (!headlineRef.current) return;

    // Initialzustand (Toggles können bei Rückkehr von Unterseite gesetzt sein)
    ysRef.current = [...targetYs];
    updatePaths(ysRef.current);

    const lines = headlineRef.current.querySelectorAll('[data-line]');
    lines.forEach((line) => splitChars(line));
    const allChars = headlineRef.current.querySelectorAll('.char');

    const maleLine = maleLineRef.current;
    const femaleLine = femaleLineRef.current;
    const area = areaRef.current;
    const gapLine = gapLineRef.current;
    const gapLabel = gapLabelRef.current;
    const gridCols = gridRef.current?.querySelectorAll('[data-grid-col]');
    const chips = chipsRef.current;
    const counterBox = counterBoxRef.current;

    if (reduced) {
      // Reduced Motion: alles sofort sichtbar, keine Choreografie
      gsap.set([subRef.current, chips, counterBox], { opacity: 1 });
      if (area) gsap.set(area, { opacity: 1 });
      if (gapLine) gsap.set(gapLine, { opacity: 0.7 });
      if (gapLabel) gsap.set(gapLabel, { opacity: 1 });
      if (euroRef.current) euroRef.current.textContent = String(euroGap);
      displayedEuro.current = euroGap;
      chartReady.current = true;
      setIntroDone(true);
      return;
    }

    if (maleLine && femaleLine) {
      const mLen = maleLine.getTotalLength();
      const fLen = femaleLine.getTotalLength();
      gsap.set(maleLine, { strokeDasharray: mLen, strokeDashoffset: mLen });
      gsap.set(femaleLine, { strokeDasharray: fLen, strokeDashoffset: fLen });
    }
    if (area) gsap.set(area, { opacity: 0 });
    if (gapLine) gsap.set(gapLine, { opacity: 0 });
    if (gapLabel) gsap.set(gapLabel, { opacity: 0 });
    if (gridCols?.length) gsap.set(gridCols, { scaleY: 0, transformOrigin: 'top', opacity: 0 });
    if (chips) gsap.set(chips, { opacity: 0, y: 14 });
    if (counterBox) gsap.set(counterBox, { opacity: 0, y: 10 });

    const tl = gsap.timeline({ delay: 1.4 });

    tl.fromTo(
      allChars,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: { each: 0.012, from: 'start' }, ease: 'power4.out' }
    );
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    );

    if (maleLine && femaleLine) {
      tl.addLabel('linesStart', '-=0.3');
      // Männerlinie zieht ruhig nach oben …
      tl.to(maleLine, { strokeDashoffset: 0, duration: 2.0, ease: 'power1.inOut' }, 'linesStart');
      // … die Frauenlinie fällt — das ist der Auto-Play-Drop.
      tl.to(femaleLine, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.in' }, 'linesStart+=0.15');

      if (gridCols?.length) {
        tl.to(
          gridCols,
          { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
          'linesStart'
        );
      }

      // Lücke füllt sich pink, sobald beide Linien stehen
      if (area) {
        tl.to(area, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 'linesStart+=1.9');
      }
      // Konnektor macht die Lücke explizit: Strich von Linie zu Linie
      if (gapLine) {
        tl.to(gapLine, { opacity: 0.75, duration: 0.6, ease: 'power2.out' }, 'linesStart+=2.2');
      }
      if (gapLabel) {
        tl.to(gapLabel, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 'linesStart+=2.4');
      }

      // Euro-Zähler tickt hoch
      if (counterBox && euroRef.current) {
        tl.to(counterBox, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 'linesStart+=1.7');
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: euroGap,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              displayedEuro.current = obj.v;
              if (euroRef.current) euroRef.current.textContent = String(Math.round(obj.v));
            },
          },
          'linesStart+=1.9'
        );
      }

      // Einladung zur Interaktion
      if (chips) {
        tl.to(chips, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 'linesStart+=2.6');
      }

      tl.call(() => {
        // Dash-Trick beenden, damit spätere Morphs die Linie nicht "kürzen"
        gsap.set(femaleLine, { strokeDasharray: 'none', strokeDashoffset: 0 });
        chartReady.current = true;
        setIntroDone(true);
      });
    }

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // ── Toggle → dramatischer Linien-Drop ────────────────────────
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!ysRef.current) return;

    if (!chartReady.current) {
      // Intro läuft noch: Ziel still übernehmen
      ysRef.current = [...targetYs];
      updatePaths(ysRef.current);
      return;
    }

    const from = [...ysRef.current];
    const to = [...targetYs];
    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      duration: 1.1,
      ease: 'back.out(1.4)', // kurzer freier Fall mit Nachfedern
      onUpdate: () => {
        const ys = from.map((f, i) => f + (to[i] - f) * proxy.t);
        ysRef.current = ys;
        updatePaths(ys);
      },
    });
    return () => tween.kill();
  }, [targetYs]);

  // ── Euro-Zähler folgt jeder Änderung ─────────────────────────
  useEffect(() => {
    if (!introDone || !euroRef.current) return;
    const obj = { v: displayedEuro.current };
    const tween = gsap.to(obj, {
      v: euroGap,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => {
        displayedEuro.current = obj.v;
        if (euroRef.current) euroRef.current.textContent = String(Math.round(obj.v));
      },
    });
    return () => tween.kill();
  }, [euroGap, introDone]);

  // Marker der aktiven Lebensereignisse (auf Ziel-Position)
  const markers = TOGGLE_META.filter((m) => toggles[m.id]).map((m) => {
    const i = XS.indexOf(m.x);
    return { ...m, y: targetYs[i] };
  });

  return (
    <section
      id="hero"
      className="relative h-[100svh] overflow-hidden bg-ink flex flex-col"
    >
      {feldBereit && (
        <Suspense fallback={null}>
          <BackgroundField />
        </Suspense>
      )}

      {/* Fixed-nav clearance */}
      <div className="h-24 md:h-24 shrink-0" />

      {/* ── Main content row: text left + interactive chart right ── */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row md:items-stretch px-6 md:px-12 min-h-0">

        {/* Text column */}
        <div className="shrink-0 w-full md:w-[44%] text-center md:text-left flex flex-col justify-center">
          <h1
            ref={headlineRef}
            className="display-xl text-paper"
            style={{ fontSize: 'clamp(2.6rem, min(8vw, 11vh), 8.5rem)' }}
          >
            {/* splitChars() zerlegt die Zeilen unten in ein <span> je Buchstabe —
                ein Screenreader würde die Headline buchstabieren. Deshalb steht
                der Satz einmal als zusammenhängender Text hier und die animierte
                Fassung ist für assistive Technologien ausgeblendet. */}
            <span className="sr-only">{satzText(startseite.heroZeilen, null, ' ')}</span>
            <span className="block" aria-hidden="true">
              {startseite.heroZeilen.map((zeile, i) => (
                <span key={i} className="block line-mask">
                  <span data-line className={klasseFuerStil(zeile.stil)}>
                    {zeile.text}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle — desktop only */}
          <div ref={subRef} className="hidden md:block mt-6 max-w-md">
            <p
              className="body-lead text-paper/75"
              style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.4rem)' }}
            >
              {startseite.heroUntertitel}
            </p>
            <p className="mt-2 text-paper/55" style={{ fontSize: 'clamp(0.78rem, 0.85vw, 1rem)' }}>
              {startseite.heroZusatz}
            </p>
          </div>
        </div>

        {/* ── Chart column ── */}
        <div className="flex-1 relative min-h-0 mt-2 md:mt-0 md:pl-8">

            {/* Left fade — desktop only */}
            <div
              className="hidden md:block absolute inset-y-0 left-0 w-12 z-20 pointer-events-none"
              style={{ background: 'linear-gradient(to right, var(--color-ink), transparent)' }}
            />

            {/* Life-phase grid lines */}
            <div ref={gridRef} className="absolute inset-0 z-[5]">
              {LIFE_PHASES.map(({ age, label, pos, mobileLabel }) => (
                <div
                  key={age}
                  data-grid-col
                  className="absolute top-0 bottom-0 flex flex-col items-center"
                  style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="pt-2 md:pt-10 flex flex-col items-center gap-[4px]">
                    <span
                      className="tnum font-bold"
                      style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'rgb(var(--paper-rgb) / 0.7)' }}
                    >
                      {age}
                    </span>
                    {/* Mobil nur ausgewählte Labels sichtbar — aber `invisible`
                        statt `hidden`, damit der Platz reserviert bleibt und
                        alle Rasterlinien gleich hoch beginnen. */}
                    {/* 0,55 statt 0,4 (03.08.2026): bei 9px braucht Text
                        4,5:1, Paper auf Ink schaffte mit 0,4 nur 3,18:1.
                        0,55 ergibt 4,75:1. Die Beschriftungen sind keine
                        Deko, sie benennen die Lebensphasen der Kurve, also
                        greift die Ausnahme für rein dekorativen Text nicht.
                        Der Auditor hatte sie bisher übersehen, weil sie im
                        Vorschau-Browser auf dem GSAP-Startwert opacity 0
                        festhängen und dadurch als ungeprüft durchliefen. */}
                    <span
                      className={mobileLabel ? '' : 'invisible md:visible'}
                      style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgb(var(--paper-rgb) / 0.55)', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </span>
                  </div>
                  <div
                    className="w-px mt-2"
                    style={{ flex: 1, background: 'rgb(var(--paper-rgb) / 0.15)' }}
                  />
                </div>
              ))}
            </div>

            {/* SVG: Lücken-Fläche + Linien + Marker */}
            <svg
              viewBox={`0 0 600 ${VIEW_H}`}
              className="absolute inset-0 w-full h-full z-[10]"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-pink)" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="var(--color-pink)" stopOpacity="0.16" />
                </linearGradient>
              </defs>

              {/* Lücke */}
              <path ref={areaRef} d={areaPath(FEMALE_Y)} fill="url(#gapFill)" stroke="none" />

              {/* Männer */}
              <path
                ref={maleLineRef}
                d={MALE_PATH}
                fill="none"
                stroke="var(--color-paper)"
                strokeWidth="1"
                opacity="0.4"
              />
              {/* Frauen */}
              <path
                ref={femaleLineRef}
                d={linePath(FEMALE_Y)}
                fill="none"
                stroke="var(--color-pink)"
                strokeWidth="1.4"
                opacity="0.9"
              />

              {/* Lücken-Konnektor: vertikaler Strich Männer→Frauen bei Rente */}
              <line
                ref={gapLineRef}
                x1="576"
                y1={MALE_Y[XS.indexOf(576)]}
                x2="576"
                y2={FEMALE_Y[XS.indexOf(576)]}
                stroke="var(--color-pink)"
                strokeWidth="1.4"
                strokeDasharray="4 5"
                opacity="0.75"
              />

              {/* Marker aktiver Lebensereignisse */}
              {markers.map((m) => (
                <g key={m.id} style={{ transition: 'transform 0.3s' }}>
                  <circle cx={m.x} cy={m.y} r="5" fill="var(--color-pink)" opacity="0.25">
                    <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={m.x} cy={m.y} r="2.6" fill="var(--color-pink)" />
                </g>
              ))}
            </svg>

            {/* Label am Lücken-Konnektor — Größe wie der Hero-Paragraph */}
            <div
              ref={gapLabelRef}
              className="absolute z-[15] text-pink font-bold pointer-events-none text-right"
              style={{
                left: `${(576 / 600) * 100}%`,
                top: `${(((MALE_Y[XS.indexOf(576)] + FEMALE_Y[XS.indexOf(576)]) / 2) / VIEW_H) * 100}%`,
                transform: 'translate(-106%, -50%)',
                fontSize: 'clamp(0.9rem, 1.05vw, 1.4rem)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              Die Lücke
            </div>

            {/* Marker-Labels (HTML, unverzerrt) */}
            {markers.map((m) => (
              <div
                key={m.id}
                className="absolute z-[15] text-pink font-bold tnum pointer-events-none"
                style={{
                  left: `${(m.x / 600) * 100}%`,
                  top: `${(m.y / VIEW_H) * 100}%`,
                  transform: 'translate(-50%, -190%)',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                −{m.euro} €
              </div>
            ))}

            {/* Euro-Zähler — deine Lücke, live */}
            <div
              ref={counterBoxRef}
              className="absolute left-0 bottom-1 md:bottom-3 z-20 pointer-events-none"
            >
              {/* Größe bewusst gleich dem Hero-Paragraph */}
              <div
                className="font-bold text-paper/75 mb-1"
                style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.4rem)', letterSpacing: '0.01em' }}
              >
                Deine Rentenlücke
              </div>
              <div className="flex items-baseline gap-1">
                <span className="data-num text-pink" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}>
                  −<span ref={euroRef}>0</span> €
                </span>
              </div>
              <div className="text-[11px] text-paper/55 mt-1">
                pro Monat Rente · {de1(gap)} % weniger als Männer
              </div>
            </div>
        </div>
      </div>

      {/* ── Bottom bar: CTA (nur Desktop) + Toggle-Chips auf einer Höhe ── */}
      <div className="shrink-0 relative z-10 px-6 md:px-12 pb-5 md:pb-8 pt-2 md:pt-3 flex items-end justify-between gap-6">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex group items-center gap-2 eyebrow text-paper border border-paper/30 hover:border-pink hover:text-pink rounded-full px-5 py-3 transition-colors shrink-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-pink animate-pulse" />
          {startseite.abschlussButton}
        </a>

        <div ref={chipsRef} className="w-full md:w-auto">
          <div className="hidden md:block eyebrow text-paper/55 mb-2 text-center">
            {startseite.heroChipsHinweis}
          </div>
          {/* Immer 2×2 oder 4×1 — nie 3+1 */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              {TOGGLE_META.map((m, i) => {
                const on = toggles[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    // Umschalter statt Aktion — aria-pressed sagt dem Screenreader,
                    // ob die Lebensphase gerade eingerechnet ist.
                    aria-pressed={on}
                    data-cursor="toggle"
                    data-cursor-label={on ? '−' : '+'}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all duration-300 border ${
                      on
                        ? 'bg-pink text-ink border-pink'
                        : 'chip-pulse bg-transparent text-paper/70 border-paper/25 hover:border-pink hover:text-pink'
                    }`}
                    style={on ? undefined : { animationDelay: `${i * 0.35}s` }}
                  >
                    <span aria-hidden="true" className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[10px] ${on ? 'bg-ink text-pink' : 'bg-paper/15'}`}>
                      {on ? '✓' : '+'}
                    </span>
                    <span className="whitespace-nowrap">{m.label}</span>
                    {/* opacity-80 statt -60: die Deckkraft multipliziert sich mit dem
                        text-paper/70 des Knopfes. Mit 60 landete der Betrag bei
                        effektiv 42 % und 3,34:1, gefordert sind bei 12px fett 4,5:1.
                        0,70 × 0,80 = 0,56 ergibt 4,6:1 und trifft zugleich die
                        projekteigene Untergrenze paper/55 aus A.9. */}
                    <span className="tnum font-bold opacity-80 whitespace-nowrap hidden sm:inline">−{m.euro} €</span>
                  </button>
                );
              })}
            </div>
        </div>
      </div>
    </section>
  );
}
