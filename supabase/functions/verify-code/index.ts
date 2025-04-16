// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.39.7"
import { Twilio } from "npm:twilio@4.23.0"

// Initialize clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

const twilioClient = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

serve(async (req) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const { phone, code, userId } = await req.json();

    // Validate inputs
    if (!phone || !/^\+\d{8,15}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'رقم الهاتف غير صالح' }),
        { headers, status: 400 }
      );
    }

    if (!code || !/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'يجب أن يكون رمز التحقق 6 أرقام' }),
        { headers, status: 400 }
      );
    }

    // Check test numbers
    const testPhones = (Deno.env.get('TEST_PHONE_NUMBERS') || '').split(',');
    const isTestPhone = testPhones.some(tp => phone.includes(tp));

    if (isTestPhone) {
      // Bypass Twilio verification for test numbers
      console.log(`Test verification for ${phone}`);
      
      await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          phone: phone
        })
        .eq('id', userId);

      return new Response(
        JSON.stringify({ 
          success: true,
          isTest: true,
          message: 'تم التحقق من رقم الهاتف (وضع الاختبار)'
        }),
        { headers, status: 200 }
      );
    }

    // Real verification with Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services(Deno.env.get('TWILIO_VERIFY_SERVICE_SID'))
      .verificationChecks
      .create({ to: phone, code });

    if (verificationCheck.status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'رمز التحقق غير صحيح أو منتهي الصلاحية'
        }),
        { headers, status: 400 }
      );
    }

    // Update user profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ 
        phone_verified: true,
        phone: phone
      })
      .eq('id', userId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'تم التحقق من رقم الهاتف بنجاح'
      }),
      { headers, status: 200 }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'فشل عملية التحقق',
        details: error.message 
      }),
      { headers, status: 500 }
    );
  }
});