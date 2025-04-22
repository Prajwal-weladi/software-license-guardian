import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const body = await req.json();

    if (body.testEmail) {
      const testEmailResponse = await resend.emails.send({
        from: 'notifications@yourdomain.com',
        to: 'test@example.com',
        subject: 'Test Email from License Management System',
        html: `
          <h1>Email Service Test</h1>
          <p>This is a test email from your License Management System.</p>
          <p>If you're seeing this, your email configuration is working correctly!</p>
        `
      });

      return new Response(
        JSON.stringify({ message: 'Test email sent successfully', response: testEmailResponse }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const fiveDaysFromNow = new Date()
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)
    
    const { data: expiringLicenses, error: licensesError } = await supabaseClient
      .from('licenses')
      .select(`
        *,
        license_notifications (email)
      `)
      .eq('status', 'active')
      .lt('expiry_date', fiveDaysFromNow.toISOString())
      .gt('expiry_date', new Date().toISOString())

    if (licensesError) throw licensesError

    for (const license of expiringLicenses) {
      if (license.license_notifications) {
        for (const notification of license.license_notifications) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'notifications@yourdomain.com',
              to: notification.email,
              subject: `License Expiring Soon: ${license.name}`,
              html: `
                <h2>License Expiration Notice</h2>
                <p>The following license will expire in 5 days:</p>
                <ul>
                  <li>License: ${license.name}</li>
                  <li>Vendor: ${license.vendor}</li>
                  <li>Expiry Date: ${new Date(license.expiry_date).toLocaleDateString()}</li>
                </ul>
                <p>Please take necessary action to renew the license if needed.</p>
              `,
            }),
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Expiring license notifications processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in check-expiring-licenses function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
