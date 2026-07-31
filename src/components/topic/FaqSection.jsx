import { useEffect } from 'react';

/**
 * SEO-FAQ: natives <details>-Accordion (zugänglich, kein JS nötig)
 * + FAQPage-JSON-LD im <head> für Google Rich Results.
 */
export default function FaqSection({ title, items, note }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((i) => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [items]);

  return (
    <section className="bg-ink text-paper px-6 md:px-12 py-24 md:py-32 border-t border-paper/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="display-lg text-paper text-balance mb-12" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 3.4rem)' }}>
          {title}
        </h2>

        <div className="divide-y divide-paper/10 border-y border-paper/10">
          {items.map((item) => (
            <details key={item.q} className="group">
              <summary
                data-cursor="link"
                className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
              >
                <span className="font-medium text-paper/85 group-open:text-pink transition-colors" style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)' }}>
                  {item.q}
                </span>
                <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-paper/25 text-paper/60 transition-transform duration-300 group-open:rotate-45 group-open:border-pink group-open:text-pink">
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 body-lead text-paper/60" style={{ fontSize: 'clamp(0.9rem, 1vw, 1.05rem)' }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {note && (
          <p className="mt-8 text-[12px] text-paper/55 leading-relaxed max-w-2xl">{note}</p>
        )}
      </div>
    </section>
  );
}
