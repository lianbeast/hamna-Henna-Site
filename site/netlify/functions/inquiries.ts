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