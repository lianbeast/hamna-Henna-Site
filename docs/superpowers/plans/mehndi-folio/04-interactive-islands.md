# Module 4: Interactive Islands

> **Source:** Tasks 8, 10-11 from `docs/superpowers/plans/2026-08-15-mehndi-folio-design.md`

## Goal
Create React islands for FAQ accordion and booking inquiry form, plus serverless function to handle inquiries.

## Files Created
- `site/src/data/faq.json`
- `site/src/components/FAQAccordion.tsx`
- `site/src/components/BookingInquiry.tsx`
- `site/netlify/functions/inquiries.ts`

---

## Task 8: FAQ Data + Accordion Island

### Step 1: Create src/data/faq.json

```json
[
  {
    "q": "How long does bridal henna last?",
    "a": "A full bridal set typically takes 2–4 hours and stains deepen over 24–48 hours. Aftercare matters: keep the paste on as long as comfortable, then seal the stain with lemon-sugar and avoid water for several hours after removal."
  },
  {
    "q": "How far in advance should I book?",
    "a": "Bridal dates are held months in advance. Reach out 3–6 months ahead for weddings, and earlier for peak wedding-season weekends. Engagement and sangeet dates often have shorter lead times."
  },
  {
    "q": "Do you travel for destination weddings?",
    "a": "Yes. Travel within the continental US is available; destination weddings elsewhere are quoted case by case. Travel and lodging are added to the booking."
  },
  {
    "q": "Is the paste natural?",
    "a": "A natural/organic option is available for sensitive brides — organic, clove-free paste, drawn in the same hand. Mention any skin sensitivities in your inquiry."
  },
  {
    "q": "Do you offer bridal-party pricing?",
    "a": "Yes. Coordinated bridal-party sets are priced per hand with a reduced per-hand rate as the party grows. Include party size in your inquiry for an exact quote."
  }
]
```

### Step 2: Create FAQAccordion.tsx

```tsx
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
                <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
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
```

### Step 3: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 4: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/data/faq.json site/src/components/FAQAccordion.tsx
git commit -m "feat: add FAQ data and accessible accordion island"
```

---

## Task 10: Booking Inquiry Form (React Island)

### Step 1: Create BookingInquiry.tsx

```tsx
import { useState, useCallback } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  service: string;
  message: string;
}

const services = [
  { value: 'bridal-mehndi', label: 'Bridal Mehndi' },
  { value: 'bridal-party', label: 'Bridal Party Coordination' },
  { value: 'engagement-sangeet', label: 'Engagement & Sangeet' },
  { value: 'natural-organic', label: 'Natural / Organic Henna' }
];

export default function BookingInquiry() {
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    service: 'bridal-mehndi',
    message: ''
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(err.error || 'Submission failed');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="booking-success" role="status" aria-live="polite">
        <span className="booking-success-tick" aria-hidden="true">✓</span>
        <h3 className="booking-success-title">Inquiry received.</h3>
        <p className="booking-success-body">
          Hamna will reply within 48 hours. In the meantime, follow <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener">@henna-designer</a> for the latest work.
        </p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'}>
      <h3 className="booking-title">Inquire about a date</h3>

      <div className="booking-error-region" role="alert" aria-live="polite">
        {error && <p className="booking-error">{error}</p>}
      </div>

      <div className="booking-grid">
        <div className="booking-field">
          <label htmlFor="name" className="booking-label">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={data.name}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="email" className="booking-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={data.email}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="phone" className="booking-label">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={data.phone}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field">
          <label htmlFor="weddingDate" className="booking-label">Wedding date</label>
          <input
            id="weddingDate"
            name="weddingDate"
            type="date"
            required
            value={data.weddingDate}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-input"
          />
        </div>

        <div className="booking-field booking-field-full">
          <label htmlFor="service" className="booking-label">Service</label>
          <select
            id="service"
            name="service"
            value={data.service}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-select"
          >
            {services.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="booking-field booking-field-full">
          <label htmlFor="message" className="booking-label">Note</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={data.message}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="booking-textarea"
          />
        </div>
      </div>

      <button
        type="submit"
        className="booking-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}
```

### Step 2: Verify build
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors.

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/src/components/BookingInquiry.tsx
git commit -m "feat: add BookingInquiry form (React island, no Stripe)"
```

---

## Task 11: Inquiries Serverless Function

### Step 1: Create inquiries.ts

```ts
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  service: string;
  message?: string;
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body: InquiryRequest = JSON.parse(event.body || '{}');
    const { name, email, phone, weddingDate, service, message } = body;

    if (!name || !email || !phone || !weddingDate || !service) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email' })
      };
    }

    console.log('[inquiry]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      weddingDate,
      service,
      message: message || ''
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit inquiry';
    console.error('Inquiry error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message })
    };
  }
};

export { handler };
```

### Step 2: Verify TypeScript
```bash
cd /home/arch/Applications/Play-Site/hamna-site/site
pnpm astro check 2>&1 | tail -20
```
Expected: no errors. (Netlify function TS is not type-checked by astro check but pnpm exec tsc with --noEmit on the file should pass; if `astro check` complains about the function file, add it to `tsconfig.json`'s `exclude` list.)

### Step 3: Commit
```bash
cd /home/arch/Applications/Play-Site/hamna-site
git add site/netlify/functions/inquiries.ts
git commit -m "feat: add /api/inquiries serverless function"
```

---

## Verification
- [ ] `pnpm astro check` passes for all React components
- [ ] FAQ accordion is accessible (aria-expanded, aria-controls, role="region")
- [ ] Booking form validates required fields client-side
- [ ] Form disables inputs while submitting
- [ ] Success state shows confirmation message
- [ ] Error state displays API error message
- [ ] Serverless function validates HTTP method, required fields, email format
- [ ] Function logs payload to console (no actual email sending)
- [ ] Clean git commits