// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.39.7"
import { Twilio } from "npm:twilio@4.23.0"

// Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Twilio API credentials
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID') || 'ACb99e889eaed7a632d5e0bad304d4a5df';
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') || '568bd8851c8091d25b44319330bd3c41';
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER') || '+19414014359';
const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || 'MG24d7598330a7a268857454e0b59462d9';

// Create Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

serve(async (req: Request) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    };

    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Parse request body
    const { phoneNumber } = await req.json();

    // Validate phone number
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return new Response(
        JSON.stringify({ error: 'رقم الهاتف مطلوب' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Format phone number to E.164 format if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    // Check if this is a test phone number
    const testPhoneNumbers = Deno.env.get('TEST_PHONE_NUMBERS') || '967779777358=123456,967774846214=123456';
    const testPhones = testPhoneNumbers.split(',').reduce((acc, pair) => {
      const [phone, code] = pair.split('=');
      if (phone && code) {
        acc[phone] = code;
      }
      return acc;
    }, {} as Record<string, string>);

    // If it's a test phone, return success without sending actual SMS
    const phoneWithoutPlus = formattedPhoneNumber.replace('+', '');
    if (testPhones[phoneWithoutPlus]) {
      console.log(`Test phone number detected: ${formattedPhoneNumber}. Code: ${testPhones[phoneWithoutPlus]}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Test verification code sent successfully',
          isTestPhone: true
        }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: `رمز التحقق الخاص بك في أجار هو: ${verificationCode}`,
      to: formattedPhoneNumber,
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID || undefined,
      from: TWILIO_MESSAGING_SERVICE_SID ? undefined : TWILIO_PHONE_NUMBER
    });

    // Get user from auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Store verification code in database
    const { error: codeError } = await supabase
      .from('phone_verification_codes')
      .insert({
        user_id: user.id,
        phone: formattedPhoneNumber,
        code: verificationCode,
        attempts: 0,
        verified: false,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiry
      });

    if (codeError) {
      console.error('Error storing verification code:', codeError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: message.sid,
        message: 'تم إرسال رمز التحقق بنجاح'
      }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error sending verification code:', error);
    
    return new Response(
      JSON.stringify({ error: 'حدث خطأ أثناء إرسال رمز التحقق', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});