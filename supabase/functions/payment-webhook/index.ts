import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log(`[payment-webhook] Received request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let payload;
  try {
    payload = await req.json();
    console.log('[payment-webhook] Webhook payload received:', payload);
  } catch (e) {
    console.error('[payment-webhook] Error parsing JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  try {
    const transactionId = payload.idTransaction || payload.externalReference;
    const status = payload.status;
    let dbStatus = '';

    if (!transactionId || !status) {
        console.warn('[payment-webhook] Webhook received without transactionId or status. Payload:', payload);
        // Still return 200 OK to prevent retries from the gateway
        return new Response('OK', { headers: corsHeaders, status: 200 });
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
        console.warn(`[payment-webhook] Received unhandled webhook status: '${status}'`);
        // Return 200 OK to prevent retries for unhandled statuses
        return new Response('OK', { headers: corsHeaders, status: 200 });
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .update({ status: dbStatus, raw_gateway_response: payload })
      .eq('gateway_transaction_id', transactionId);

    if (error) {
      console.error(`[payment-webhook] DB Error: Failed to update transaction ${transactionId} to status ${dbStatus}:`, error);
    } else {
      console.log(`[payment-webhook] DB Success: Successfully updated transaction ${transactionId} to status ${dbStatus}`);
    }

    // Respond with a simple 200 OK to acknowledge receipt.
    return new Response('OK', { headers: corsHeaders, status: 200 });

  } catch (error) {
    console.error('[payment-webhook] Unhandled error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})