import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const payload = await req.json();
    console.log('Webhook received:', payload);

    const transactionId = payload.idTransaction || payload.externalReference;
    const status = payload.status;
    let dbStatus = '';

    if (!transactionId || !status) {
        console.warn('Webhook received without transactionId or status');
        return new Response(JSON.stringify({ status: "received, but malformed" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
    }

    switch (status) {
      case 'paid':
        dbStatus = 'paid';
        break;
      case 'SaquePago':
        dbStatus = 'paid';
        break;
      case 'SaqueFalhou':
        dbStatus = 'failed';
        break;
      case 'refund_approved':
        dbStatus = 'refunded';
        break;
      case 'canceled':
         dbStatus = 'canceled';
         break;
      default:
        console.warn(`Received unknown webhook status: ${status}`);
        return new Response(JSON.stringify({ status: "received, unknown status" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .update({ status: dbStatus, raw_gateway_response: payload })
      .eq('gateway_transaction_id', transactionId);

    if (error) {
      console.error(`Failed to update transaction ${transactionId} to status ${dbStatus}:`, error);
    } else {
      console.log(`Successfully updated transaction ${transactionId} to status ${dbStatus}`);
    }

    return new Response(JSON.stringify({ status: "received" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})