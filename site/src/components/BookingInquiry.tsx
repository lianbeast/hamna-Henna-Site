import { useState, useCallback } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  service: string;
  message: string;
  'bot-field': string;
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
    message: '',
    'bot-field': ''
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
      const body = new URLSearchParams({
        'form-name': 'inquiry',
        name: data.name,
        email: data.email,
        phone: data.phone,
        weddingDate: data.weddingDate,
        service: data.service,
        message: data.message,
        'bot-field': data['bot-field']
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error('Submission failed. Please try again.');
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
    <form className="booking-form" onSubmit={handleSubmit} name="inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" noValidate aria-busy={status === 'submitting'}>
      <p className="booking-honeypot" aria-hidden="true">
        <label>Don't fill this out if you're human: <input name="bot-field" value={data['bot-field']} onChange={handleChange} tabIndex={-1} autoComplete="off" /></label>
      </p>
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
