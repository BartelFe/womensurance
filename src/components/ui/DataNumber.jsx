import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { deNum } from '../../utils/format';

export default function DataNumber({ value, decimals = 1, suffix = '%', triggerOn = 'self', start = 'top 80%', end, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };

    const trigger = triggerOn === 'self' ? el : triggerOn;

    const tween = gsap.to(obj, {
      v: value,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = deNum(obj.v, decimals);
      },
      scrollTrigger: {
        trigger,
        start,
        end: end || 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, decimals, triggerOn, start, end]);

  // Der Zähler wird per GSAP hochgezählt; ein Screenreader würde den
  // Zwischenstand (meist "0.0") vorlesen. Deshalb steht der Endwert einmal
  // statisch als sr-only da, die Animation ist ausgeblendet.
  const spoken = `${deNum(value, decimals)}${suffix || ''}`;

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span ref={ref} className="data-num">{deNum(0, decimals)}</span>
        {suffix && <span className="data-num">{suffix}</span>}
      </span>
    </span>
  );
}
