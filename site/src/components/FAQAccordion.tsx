import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <div className="faq-accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={i} className="faq-item">
            <h3 className="faq-heading">
              <button
                id={buttonId}
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className="faq-q">{item.q}</span>
                {/* Drawn, not typed: a glyph renders at whatever weight the
                    font carries, which reads as decoration beside a real icon
                    set. Both bars are always present — the CSS rotates the
                    cross 45deg to become the minus, so the state change is
                    one continuous turn instead of a character swap. */}
                <svg className="faq-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 3v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-answer"
              >
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
