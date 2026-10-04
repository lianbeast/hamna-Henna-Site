import { useEffect, useRef, useState } from 'react';
import site from '../data/site.json';
import { EMPTY, SERVICE_OPTIONS, localToday, prepareInquiry, validateBooking, validateField, type Errors, type Field } from '../lib/booking';

export default function BookingInquiry() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [prepared, setPrepared] = useState<ReturnType<typeof prepareInquiry> | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [today, setToday] = useState('');
  const revision = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const preparedRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setToday(localToday()); }, []);

  function setField(field: Field, value: string) {
    revision.current += 1;
    setPrepared(null);
    setCopyStatus('');
    setValues((prev) => ({ ...prev, [field]: value }));
    // clear the error as soon as the field is being corrected
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  function onBlur(field: Field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const message = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const currentToday = localToday();
    setToday(currentToday);
    const next = validateBooking(values, currentToday);
    revision.current += 1;
    setPrepared(null);
    setCopyStatus('');

    setTouched(Object.fromEntries((Object.keys(EMPTY) as Field[]).map((f) => [f, true])));
    setErrors(next);

    const count = Object.keys(next).length;
    if (count > 0) {
      // move focus to the summary so the failure is announced, not silent
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setPrepared(prepareInquiry(values, site.email));
    requestAnimationFrame(() => preparedRef.current?.focus());
  }

  async function copyInquiry() {
    if (!prepared) return;
    const currentRevision = revision.current;
    setCopyStatus('Copying inquiry…');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prepared.text);
      if (currentRevision === revision.current) setCopyStatus('Inquiry copied. Paste it into an email and send it when ready.');
    } catch {
      if (currentRevision !== revision.current) return;
      setCopyStatus('Could not copy automatically. Select and copy the inquiry text below, then paste it into your email.');
      fallbackRef.current?.focus();
      fallbackRef.current?.select();
    }
  }

  const errorList = (Object.keys(errors) as Field[]).filter((f) => errors[f]);
  const LABELS: Record<Field, string> = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone number',
    date: 'Event date',
    location: 'Event location',
    service: 'Type of service',
    guests: 'Estimated number of guests',
    message: 'Message',
  };

  return (
    <form className="booking" aria-label="Booking inquiry" onSubmit={onSubmit} noValidate>
      <p className="mb-6 text-sm">All fields are required. This prepares an email draft for you to review and send; it does not send an inquiry from this page.</p>
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="booking-summary"
        >
          <p className="font-medium">
            {errorList.length === 1
              ? 'One field needs attention before your email can be prepared.'
              : `${errorList.length} fields need attention before your email can be prepared.`}
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#f-${f}`} className="underline">
                  {LABELS[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="booking-grid">
        <FieldGroup id="name" label="Name" error={touched.name ? errors.name : undefined}>
          <input
            id="f-name"
            name="name"
            required
            className="booking-input"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            onBlur={() => onBlur('name')}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'e-name' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="email" label="Email" error={touched.email ? errors.email : undefined}>
          <input
            id="f-email"
            name="email"
            required
            className="booking-input"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'e-email' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="phone" label="Phone number" error={touched.phone ? errors.phone : undefined}>
          <input
            id="f-phone"
            name="phone"
            required
            className="booking-input"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={touched.phone && errors.phone ? 'e-phone' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="date" label="Event date" error={touched.date ? errors.date : undefined}>
          <input
            id="f-date"
            name="date"
            required
            min={today || undefined}
            onFocus={() => setToday(localToday())}
            className="booking-input"
            type="date"
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
            onBlur={() => onBlur('date')}
            aria-invalid={Boolean(touched.date && errors.date)}
            aria-describedby={touched.date && errors.date ? 'e-date' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="location" label="Event location" hint="Venue or city, if you know it." error={touched.location ? errors.location : undefined}>
          <input
            id="f-location"
            name="location"
            required
            className="booking-input"
            type="text"
            autoComplete="off"
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            onBlur={() => onBlur('location')}
            aria-invalid={Boolean(touched.location && errors.location)}
            aria-describedby={`h-location${touched.location && errors.location ? ' e-location' : ''}`}
          />
        </FieldGroup>

        <FieldGroup id="service" label="Type of service" error={touched.service ? errors.service : undefined}>
          <select
            id="f-service"
            name="service"
            required
            className="booking-input"
            value={values.service}
            onChange={(e) => setField('service', e.target.value)}
            onBlur={() => onBlur('service')}
            aria-invalid={Boolean(touched.service && errors.service)}
            aria-describedby={touched.service && errors.service ? 'e-service' : undefined}
          >
            <option value="">Please choose…</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup id="guests" label="Estimated number of guests" error={touched.guests ? errors.guests : undefined}>
          <input
            id="f-guests"
            name="guests"
            required
            step={1}
            className="booking-input"
            type="number"
            inputMode="numeric"
            min={1}
            value={values.guests}
            onChange={(e) => setField('guests', e.target.value)}
            onBlur={() => onBlur('guests')}
            aria-invalid={Boolean(touched.guests && errors.guests)}
            aria-describedby={touched.guests && errors.guests ? 'e-guests' : undefined}
          />
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup id="message" label="Message" hint="Tell me what you have in mind (at least 20 characters)." error={touched.message ? errors.message : undefined}>
            <textarea
              id="f-message"
              name="message"
              required
              minLength={20}
              className="booking-input min-h-32 resize-y"
              rows={5}
              value={values.message}
              onChange={(e) => setField('message', e.target.value)}
              onBlur={() => onBlur('message')}
              aria-invalid={Boolean(touched.message && errors.message)}
              aria-describedby={`h-message${touched.message && errors.message ? ' e-message' : ''}`}
            />
          </FieldGroup>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
        Prepare email draft
      </button>

      <p className="booking-note">
        This form does not send your inquiry. Sending an email does not guarantee a booking. I will confirm availability with you
        personally before anything is reserved.
      </p>

      {prepared && (
        <div ref={preparedRef} tabIndex={-1} className="mt-6" aria-labelledby="inquiry-heading">
          <h3 id="inquiry-heading" className="text-xl">Your inquiry is ready</h3>
          <p className="booking-note">Nothing has been sent. Open your email app to review and send the inquiry to {site.email}. If no app opens, copy the text below into a new email to that address.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={prepared.href} className="btn btn-primary">Open email draft</a>
            <button type="button" className="btn btn-primary" onClick={copyInquiry}>Copy inquiry</button>
          </div>
          <label htmlFor="inquiry-text" className="booking-label mt-6">Inquiry text to copy</label>
          <textarea ref={fallbackRef} id="inquiry-text" className="booking-input resize-y" rows={10} readOnly value={prepared.text} aria-describedby="inquiry-copy-help" />
          <p id="inquiry-copy-help" className="booking-note">You can select this text and copy it manually.</p>
        </div>
      )}
      <p role="status" aria-live="polite" className="booking-live">{copyStatus}</p>
    </form>
  );
}

function FieldGroup({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="booking-label">
        {label}
      </label>
      {children}
      {hint && <p id={`h-${id}`} className="booking-hint">{hint}</p>}
      {error && (
        <p id={`e-${id}`} className="booking-error">
          {error}
        </p>
      )}
    </div>
  );
}
