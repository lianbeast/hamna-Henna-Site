import { useRef, useState } from 'react';
import site from '../data/site.json';

type Field = 'name' | 'email' | 'phone' | 'date' | 'location' | 'service' | 'guests' | 'message';

type Errors = Partial<Record<Field, string>>;

const SERVICE_OPTIONS = [
  'Bridal Mehndi',
  'Bridesmaid Mehndi',
  'Engagement Mehndi',
  'Wedding Guest Mehndi',
  'Private Appointment',
  'Events & Celebrations',
  'Custom Design',
];

const EMPTY: Record<Field, string> = {
  name: '',
  email: '',
  phone: '',
  date: '',
  location: '',
  service: '',
  guests: '',
  message: '',
};

// validate on blur, never on keystroke — a half-typed email is not an error
function validate(field: Field, value: string, all: Record<Field, string>): string {
  const v = value.trim();
  switch (field) {
    case 'name':
      return v ? '' : 'Please tell me your name.';
    case 'email':
      if (!v) return 'I need an email address to reply to.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address looks incomplete.';
    case 'phone':
      return v ? '' : 'A phone number helps me reach you faster.';
    case 'date':
      return v ? '' : 'What is the date of your event?';
    case 'location':
      return v ? '' : 'Where will the event be held?';
    case 'service':
      return v ? '' : 'Please choose the service you are interested in.';
    case 'guests':
      return v ? '' : 'Roughly how many people?';
    case 'message':
      if (!v) return 'Tell me a little about what you have in mind.';
      if (v.length < 20) return 'A sentence or two more would help me prepare.';
      return '';
    default:
      void all;
      return '';
  }
}

export default function BookingInquiry() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  function setField(field: Field, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // clear the error as soon as the field is being corrected
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value, { ...values, [field]: value }) }));
    }
  }

  function onBlur(field: Field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const message = validate(field, values[field], values);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next: Errors = {};
    (Object.keys(EMPTY) as Field[]).forEach((f) => {
      const message = validate(f, values[f], values);
      if (message) next[f] = message;
    });

    setTouched(Object.fromEntries((Object.keys(EMPTY) as Field[]).map((f) => [f, true])));
    setErrors(next);

    const count = Object.keys(next).length;
    if (count > 0) {
      // move focus to the summary so the failure is announced, not silent
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Event date: ${values.date}`,
      `Event location: ${values.location}`,
      `Service: ${values.service}`,
      `Estimated guests: ${values.guests}`,
      '',
      values.message,
    ].join('\n');

    const href =
      `mailto:${site.email}` +
      `?subject=${encodeURIComponent(`Booking inquiry — ${values.name}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setSent(true);
    window.location.href = href;
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
    <form className="booking" onSubmit={onSubmit} noValidate>
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="booking-summary"
        >
          <p className="font-medium">
            {errorList.length === 1
              ? 'One field needs attention before this can be sent.'
              : `${errorList.length} fields need attention before this can be sent.`}
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
            className="booking-input"
            type="date"
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
            onBlur={() => onBlur('date')}
            aria-invalid={Boolean(touched.date && errors.date)}
            aria-describedby={touched.date && errors.date ? 'e-date' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="location" label="Event location" error={touched.location ? errors.location : undefined}>
          <input
            id="f-location"
            className="booking-input"
            type="text"
            autoComplete="address-level2"
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
            onBlur={() => onBlur('location')}
            aria-invalid={Boolean(touched.location && errors.location)}
            aria-describedby={touched.location && errors.location ? 'e-location' : undefined}
          />
        </FieldGroup>

        <FieldGroup id="service" label="Type of service" error={touched.service ? errors.service : undefined}>
          <select
            id="f-service"
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
          <FieldGroup id="message" label="Message" error={touched.message ? errors.message : undefined}>
            <textarea
              id="f-message"
              className="booking-input min-h-32 resize-y"
              rows={5}
              value={values.message}
              onChange={(e) => setField('message', e.target.value)}
              onBlur={() => onBlur('message')}
              aria-invalid={Boolean(touched.message && errors.message)}
              aria-describedby={touched.message && errors.message ? 'e-message' : undefined}
            />
          </FieldGroup>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
        Send Booking Inquiry
      </button>

      <p className="booking-note">
        Submitting this form does not guarantee a booking. I will confirm availability with you
        personally before anything is reserved.
      </p>

      <p aria-live="polite" className="booking-live">
        {sent &&
          'Your email app should have opened with the inquiry ready to send. If nothing opened, email me directly.'}
      </p>
    </form>
  );
}

function FieldGroup({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="booking-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`e-${id}`} className="booking-error">
          {error}
        </p>
      )}
    </div>
  );
}
