import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Gepinnte Sektionen haben am Pin-Anfang noch "leeren" Zustand (Intro bei
 * Opacity 0 → wirkt wie schwarzer Screen). Für diese IDs springen wir deshalb
 * nicht an den Sektionsanfang, sondern anteilig in die Pin-Strecke hinein —
 * weit genug, dass Überschrift + Bescheid-Karte bereits sichtbar sind.
 */
const PIN_PROGRESS = {
  gap: 0.16,
};

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const progress = PIN_PROGRESS[id];
  if (progress != null) {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === el && s.pin);
    if (st) {
      const target = st.start + (st.end - st.start) * progress;
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.4 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
  }

  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
