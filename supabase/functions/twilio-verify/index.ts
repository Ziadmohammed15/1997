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
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID') || '';
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') || '';
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get('TWILIO_VERIFY_SERVICE_SID') || '';

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

    // Parse request URL to get action
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    // Parse request body
    const body = await req.json();

    // Handle different actions
    if (action === 'send') {
      return await handleSendVerification(body, headers);
    } else if (action === 'verify') {
      return await handleVerifyCode(body, headers);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in Twilio verification service:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Handle sending verification code
async function handleSendVerification(body: any, headers: HeadersInit) {
  const { phoneNumber, userId } = body;

  // Validate phone number
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return new Response(
      JSON.stringify({ error: 'رقم الهاتف مطلوب' }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  // Validate user ID
  if (!userId || typeof userId !== 'string') {
    return new Response(
      JSON.stringify({ error: 'معرف المستخدم مطلوب' }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  // Format phone number to E.164 format if needed
  let formattedPhoneNumber = phoneNumber;
  if (!phoneNumber.startsWith('+')) {
    formattedPhoneNumber = `+${phoneNumber}`;
  }

  try {
    // Send verification code via Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhoneNumber,
        channel: 'sms'
      });

    // Log verification in database
    await supabase
      .from('phone_verification_codes')
      .insert({
        user_id: userId,
        phone: formattedPhoneNumber,
        code: 'twilio-verify', // We don't store the actual code as Twilio handles it
        attempts: 0,
        verified: false,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiry
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: verification.status,
        message: 'تم إرسال رمز التحقق بنجاح'
      }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error sending verification code:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ أثناء إرسال رمز التحقق', details: error.message }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Handle verifying code
async function handleVerifyCode(body: any, headers: HeadersInit) {
  const { phoneNumber, code, userId } = body;

  // Validate input
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return new Response(
      JSON.stringify({ error: 'رقم الهاتف مطلوب' }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  if (!code || typeof code !== 'string') {
    return new Response(
      JSON.stringify({ error: 'رمز التحقق مطلوب' }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  if (!userId || typeof userId !== 'string') {
    return new Response(
      JSON.stringify({ error: 'معرف المستخدم مطلوب' }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  // Format phone number to E.164 format if needed
  let formattedPhoneNumber = phoneNumber;
  if (!phoneNumber.startsWith('+')) {
    formattedPhoneNumber = `+${phoneNumber}`;
  }

  try {
    // Verify the code with Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhoneNumber,
        code
      });

    if (verificationCheck.status === 'approved') {
      // Update verification status in database
      await supabase
        .from('phone_verification_codes')
        .update({ 
          verified: true 
        })
        .eq('user_id', userId)
        .eq('phone', formattedPhoneNumber)
        .is('verified', false);

      // Update user's profile
      await supabase
        .from('profiles')
        .update({ 
          phone: formattedPhoneNumber,
          phone_verified: true 
        })
        .eq('id', userId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          message: 'تم التحقق من رقم الهاتف بنجاح'
        }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          verified: false, 
          message: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
          status: verificationCheck.status
        }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ أثناء التحقق من الرمز', details: error.message }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}