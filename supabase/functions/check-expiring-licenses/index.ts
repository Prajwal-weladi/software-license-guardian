import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to send email using EmailJS via their REST API
async function sendEmailWithEmailJS(templateParams) {
  const serviceId = "service_ccr2vb2";
  const templateId = "template_rm0shl1";
  const publicKey = "BnPNSRI9vhiqPLdSX";
  
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${errorText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('EmailJS send error:', error);
    throw error;
  }
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

    const body = await req.json();

    if (body.testEmail) {
      // Send test email using EmailJS
      const testEmailResponse = await sendEmailWithEmailJS({
        from_name: "License Management System",
        to_name: "User",
        to_email: "prajwalweladi1@gmail.com",
        subject: "Test Email from License Management System",
        message: "This is a test email from your License Management System. If you're seeing this, your email configuration is working correctly!"
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
          // Send expiration notice via EmailJS
          await sendEmailWithEmailJS({
            from_name: "License Management System",
            to_name: "User",
            to_email: notification.email,
            subject: `License Expiring Soon: ${license.name}`,
            message: `
              The following license will expire in 5 days:
              
              License: ${license.name}
              Vendor: ${license.vendor}
              Expiry Date: ${new Date(license.expiry_date).toLocaleDateString()}
              
              Please take necessary action to renew the license if needed.
            `
          });
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
