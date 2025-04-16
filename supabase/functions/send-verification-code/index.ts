import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from "npm:twilio@4.19.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber } = await req.json()

    // Initialize Twilio client
    const twilioClient = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') || '',
      Deno.env.get('TWILIO_AUTH_TOKEN') || ''
    )

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: `كود التحقق الخاص بك هو: ${verificationCode}`,
      from: Deno.env.get('TWILIO_PHONE_NUMBER') || '',
      to: phoneNumber
    })

    return new Response(
      JSON.stringify({
        success: true,
        messageId: message.sid,
        code: verificationCode // In production, store this securely and verify against it
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})