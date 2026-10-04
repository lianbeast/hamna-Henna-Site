import assert from 'node:assert/strict';
import test from 'node:test';
import { EMPTY, SERVICE_OPTIONS, localToday, prepareInquiry, validateBooking, validateField } from './booking.ts';

test('all required fields report errors and a complete inquiry passes', () => {
  assert.equal(Object.keys(validateBooking(EMPTY, '2026-10-02')).length, 8);
  assert.deepEqual(validateBooking({
    name: ' Guest ', email: 'guest@example.com', phone: '0123456789', date: '2026-10-02',
    location: 'Event venue', service: SERVICE_OPTIONS[0], guests: '1',
    message: 'I would like to discuss a bridal appointment.',
  }, '2026-10-02'), {});
  assert.ok(validateField('email', 'guest@invalid'));
  assert.ok(validateField('message', 'Too short'));
});

test('dates reject past dates, malformed input and calendar rollovers', () => {
  for (const date of ['2026-10-01', '2026-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-10-00', '2026-1-2', '0000-01-01', 'not-a-date']) {
    assert.ok(validateField('date', date, '2026-10-02'), date);
  }
  for (const date of ['2026-10-02', '2026-10-03', '2028-02-29']) {
    assert.equal(validateField('date', date, '2026-10-02'), '', date);
  }
  assert.ok(validateField('date', '2100-02-29', '2000-01-01'));
  assert.equal(validateField('date', '2000-02-29', '2000-01-01'), '');
});

test('today follows local calendar values near midnight in either timezone direction', () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    assert.equal(localToday(new Date('2026-10-02T00:30:00Z')), '2026-10-01');
    process.env.TZ = 'Pacific/Auckland';
    assert.equal(localToday(new Date('2026-10-02T23:30:00Z')), '2026-10-03');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test('guests must be positive safe integers in decimal notation', () => {
  for (const value of ['0', '-1', '1.5', '1e2', 'Infinity', 'NaN', '+1', '9007199254740992']) {
    assert.ok(validateField('guests', value), value);
  }
  for (const value of ['1', '20', ' 3 ']) assert.equal(validateField('guests', value), '');
});

test('only existing service options are accepted', () => {
  for (const option of SERVICE_OPTIONS) assert.equal(validateField('service', option), '');
  assert.ok(validateField('service', 'Unknown service'));
});

test('email encoding preserves user text without adding mailto parameters', () => {
  const values = {
    ...EMPTY, name: ' A & B ', email: 'guest@example.com', phone: '0123456789',
    date: '2026-10-02', location: 'Hall #2', service: SERVICE_OPTIONS[0], guests: '5',
    message: 'Hello & thank you!\nPlease discuss #design? &bcc=other@example.com',
  };
  const inquiry = prepareInquiry(values, 'artist@example.com');
  const url = new URL(inquiry.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'artist@example.com');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('subject'), 'Booking inquiry — A & B');
  assert.ok(url.searchParams.get('body')?.endsWith(values.message));
  assert.ok(inquiry.text.startsWith('To: artist@example.com\nSubject: Booking inquiry — A & B\n\n'));
  assert.ok(inquiry.text.endsWith(url.searchParams.get('body')!));
});
