import { useState, useCallback } from 'react';

type Status = 'idle' | 'opened' | 'error';

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

// ponytail: the studio address is placeholder, same as the phone and the
// Instagram handle on this template. Set it once here and every mailto in the
// form body follows. The phone link below is the channel that works whatever
// this says, so the form is never a dead end.
const STUDIO_EMAIL = 'hello@example.com';
const STUDIO_PHONE = '301.555.4321';
const STUDIO_PHONE_HREF = 'tel:+13015554321';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = [
      ['name', 'name'],
      ['email', 'email address'],
      ['phone', 'phone number'],
      ['weddingDate', 'date']
    ].filter(([key]) => !data[key as keyof FormData].trim());

    if (missing.length > 0) {
      setStatus('error');
      setError(`Add your ${missing.map(([, label]) => label).join(', ')} so Hamna can reach you.`);
      return;
    }

    const service = services.find((s) => s.value === data.service)?.label ?? data.service;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Date: ${data.weddingDate}`,
      `Service: ${service}`,
      data.message.trim() ? `Notes: ${data.message.trim()}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    // There is no backend on this deploy, so the inquiry is handed to the
    // visitor's own mail client. That is honest about where the message goes
    // and keeps working on a static host.
    window.location.href =
      `mailto:${STUDIO_EMAIL}` +
      `?subject=${encodeURIComponent(`Henna inquiry — ${service} — ${data.weddingDate}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus('opened');
  };

  if (status === 'opened') {
    return (
      <div className="booking-success" role="status" aria-live="polite">
        <svg className="booking-success-tick" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 13l5 5 11-11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="booking-success-title">Your mail app should be open.</h3>
        <p className="booking-success-body">
          The date and your details are in the draft, ready to send. Nothing is delivered until you press send —
          and if no window opened, call <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a> and Hamna will take the
          booking directly. In the meantime, follow{' '}
          <a href="https://www.instagram.com/henna-designer/" target="_blank" rel="noopener">@henna-designer</a> for
          the latest work.
        </p>
        <button type="button" className="booking-reopen" onClick={() => { setStatus('idle'); setError(null); }}>
          Edit the details
        </button>
      </div>
    );
  }

  return (
    <div className="booking-card">
      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <p className="booking-sub">
          Sends a draft from your own mail app. Prefer to talk it through?{' '}
          <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>.
        </p>

        <div className="booking-error-region" role="alert" aria-live="polite">
          {error && (
            <p className="booking-error">
              <svg className="booking-error-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.14" />
                <path d="M9 4.6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="9" cy="12.6" r="1" fill="currentColor" />
              </svg>
              {error}
            </p>
          )}
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
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="tel"
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
              className="booking-textarea"
            />
          </div>
        </div>

        <button type="submit" className="booking-submit">
          Compose the draft
        </button>
      </form>
    </div>
  );
}