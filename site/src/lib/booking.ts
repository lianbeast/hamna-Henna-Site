export type Field = 'name' | 'email' | 'phone' | 'date' | 'location' | 'service' | 'guests' | 'message';
export type BookingValues = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const SERVICE_OPTIONS = [
  'Bridal Mehndi', 'Bridesmaid Mehndi', 'Engagement Mehndi', 'Wedding Guest Mehndi',
  'Private Appointment', 'Events & Celebrations', 'Custom Design',
];
export const EMPTY: BookingValues = {
  name: '', email: '', phone: '', date: '', location: '', service: '', guests: '', message: '',
};

export function localToday(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function validateField(field: Field, value: string, today = localToday()): string {
  const v = value.trim();
  switch (field) {
    case 'name': return v ? '' : 'Please tell me your name.';
    case 'email':
      if (!v) return 'I need an email address to reply to.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address looks incomplete.';
    case 'phone': return v ? '' : 'A phone number helps me reach you faster.';
    case 'date': {
      if (!v) return 'What is the date of your event?';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Please enter a valid event date.';
      const [year, month, day] = v.split('-').map(Number);
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) {
        return 'Please enter a valid event date.';
      }
      return v < today ? 'Please choose today or a future date.' : '';
    }
    case 'location': return v ? '' : 'Where will the event be held?';
    case 'service': return SERVICE_OPTIONS.includes(v) ? '' : 'Please choose the service you are interested in.';
    case 'guests':
      if (!v) return 'Roughly how many people?';
      return /^\d+$/.test(v) && Number.isSafeInteger(Number(v)) && Number(v) > 0
        ? '' : 'Please enter a whole number of guests, at least 1.';
    case 'message':
      if (!v) return 'Tell me a little about what you have in mind.';
      return v.length < 20 ? 'A sentence or two more would help me prepare.' : '';
  }
}

export function validateBooking(values: BookingValues, today = localToday()): Errors {
  const errors: Errors = {};
  for (const field of Object.keys(EMPTY) as Field[]) {
    const message = validateField(field, values[field], today);
    if (message) errors[field] = message;
  }
  return errors;
}

export function prepareInquiry(values: BookingValues, recipient: string) {
  const subject = `Booking inquiry — ${values.name.trim()}`;
  const body = [
    `Name: ${values.name.trim()}`, `Email: ${values.email.trim()}`, `Phone: ${values.phone.trim()}`,
    `Event date: ${values.date.trim()}`, `Event location: ${values.location.trim()}`,
    `Service: ${values.service.trim()}`, `Estimated guests: ${values.guests.trim()}`,
    '', values.message.trim(),
  ].join('\n');
  return {
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `To: ${recipient}\nSubject: ${subject}\n\n${body}`,
  };
}
