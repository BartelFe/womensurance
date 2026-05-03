import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MagneticButton({ href, target, children, variant = 'pink', className = '', onClick }) {
  const root = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const el = root.current;
    const innerEl = inner.current;
    if (!el || !innerEl) return;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.5, ease: 'power3.out' });
      gsap.to(innerEl, { x: x * 0.1, y: y * 0.1, duration: 0.5, ease: 'power3.out' });
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      gsap.to(innerEl, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  const variants = {
    pink: 'bg-pink text-ink hover:bg-pink-deep',
    paper: 'bg-paper text-ink hover:bg-bone',
    outline: 'bg-transparent text-paper border border-paper/40 hover:border-paper',
  };

  const Tag = href ? 'a' : 'button';

  return (
    <span ref={root} className="inline-block">
      <Tag
        ref={inner}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noreferrer' : undefined}
        onClick={onClick}
        className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      >
        {children}
      </Tag>
    </span>
  );
}
