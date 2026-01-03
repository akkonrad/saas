import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  message?: string;
  recaptchaToken: string;
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

function validateContactForm(data: unknown): { valid: true; data: ContactFormRequest } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const body = data as Record<string, unknown>;

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (!body.email || typeof body.email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!body.recaptchaToken || typeof body.recaptchaToken !== 'string') {
    return { valid: false, error: 'reCAPTCHA token is required' };
  }

  return {
    valid: true,
    data: {
      name: body.name.trim(),
      email: body.email.trim(),
      company: typeof body.company === 'string' ? body.company.trim() : undefined,
      message: typeof body.message === 'string' ? body.message.trim() : undefined,
      recaptchaToken: body.recaptchaToken,
    },
  };
}

async function verifyRecaptcha(token: string, secretKey: string): Promise<RecaptchaVerifyResponse> {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
  });

  return response.json();
}

async function sendEmailWithResend(
  apiKey: string,
  to: string,
  formData: ContactFormRequest
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'KOALKA Contact Form <noreply@koalka.pl>',
      to: [to],
      subject: `Nowy kontakt od ${formData.name}${formData.company ? ` (${formData.company})` : ''}`,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Imię:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
        ${formData.company ? `<p><strong>Firma:</strong> ${formData.company}</p>` : ''}
        ${formData.message ? `<p><strong>Wiadomość:</strong></p><p>${formData.message.replace(/\n/g, '<br>')}</p>` : '<p><em>Brak wiadomości</em></p>'}
        <hr>
        <p style="color: #666; font-size: 12px;">Wiadomość wysłana z formularza kontaktowego na koalka.pl</p>
      `,
      text: `
Nowa wiadomość z formularza kontaktowego

Imię: ${formData.name}
Email: ${formData.email}
${formData.company ? `Firma: ${formData.company}\n` : ''}
${formData.message ? `Wiadomość:\n${formData.message}` : 'Brak wiadomości'}

---
Wiadomość wysłana z formularza kontaktowego na koalka.pl
      `.trim(),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Resend API error:', errorData);
    return { success: false, error: 'Failed to send email' };
  }

  return { success: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get environment variables
    const recaptchaSecret = Deno.env.get('KOALKA_CAPTCHA_SECRET');
    const resendApiKey = Deno.env.get('KOALKA_RESEND_API_KEY');
    const recipientEmail = Deno.env.get('KOALKA_EMAIL');

    if (!recaptchaSecret || !resendApiKey || !recipientEmail) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateContactForm(body);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = validation.data;

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(formData.recaptchaToken, recaptchaSecret);

    if (!recaptchaResult.success) {
      console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes']);
      return new Response(
        JSON.stringify({ success: false, error: 'reCAPTCHA verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check reCAPTCHA v3 score (0.0 - 1.0, higher is more likely human)
    if (recaptchaResult.score !== undefined && recaptchaResult.score < 0.5) {
      console.warn('Low reCAPTCHA score:', recaptchaResult.score);
      return new Response(
        JSON.stringify({ success: false, error: 'Spam detection triggered' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const emailResult = await sendEmailWithResend(resendApiKey, recipientEmail, formData);

    if (!emailResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: emailResult.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
