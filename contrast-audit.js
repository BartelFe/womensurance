// Kontrast-Auditor: läuft im Browser, prüft jedes sichtbare Textelement
// gegen WCAG 1.4.3 (AA): 4,5:1 normal, 3:1 für großen Text (>=24px oder >=18.66px bold).
(() => {
  const lum = (r, g, b) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.a * fg.r + (1 - fg.a) * bg.r,
    g: fg.a * fg.g + (1 - fg.a) * bg.g,
    b: fg.a * fg.b + (1 - fg.a) * bg.b,
    a: 1,
  });
  // Effektiven Hintergrund durch die Ancestor-Kette ermitteln
  const bgOf = (el) => {
    let stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) {
        stack.unshift(c);
        if (c.a === 1) break;
      }
      n = n.parentElement;
    }
    let acc = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of stack) acc = over(c, acc);
    return acc;
  };
  const ratio = (a, b) => {
    const l1 = lum(a.r, a.g, a.b);
    const l2 = lum(b.r, b.g, b.b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
  };

  const fails = [];
  const seen = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    // nur Elemente mit eigenem, sichtbarem Textknoten
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (parseFloat(cs.opacity) < 0.1) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (el.closest('[inert]')) return;

    const fg = parse(cs.color);
    if (!fg) return;
    const bg = bgOf(el);
    const eff = over(fg, bg);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const r = ratio(eff, bg);
    if (r >= need) return;

    const key = el.className + '|' + Math.round(size) + '|' + cs.color;
    if (seen.has(key)) return;
    seen.add(key);
    fails.push({
      ratio: Math.round(r * 100) / 100,
      need,
      px: Math.round(size * 10) / 10,
      weight,
      color: cs.color,
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 45),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 90),
    });
  });
  fails.sort((a, b) => a.ratio - b.ratio);
  return JSON.stringify({ path: location.pathname, count: fails.length, fails }, null, 1);
})();
