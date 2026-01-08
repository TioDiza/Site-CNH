import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const handler = async (req: Request): Promise<Response> => {
  console.log(`[payment-webhook] Received request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log('[payment-webhook] Handling OPTIONS request.');
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let payload;
  try {
    const bodyText = await req.text();
    if (!bodyText) {
      console.warn('[payment-webhook] Received empty request body.');
      return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }
    payload = JSON.parse(bodyText);
    console.log('[payment-webhook] Webhook payload parsed successfully:', payload);
  } catch (e) {
    console.error('[payment-webhook] Error parsing JSON payload:', e);
    return new Response('Invalid JSON payload', {
      headers: corsHeaders,
      status: 400,
    });
  }

  const requestBody = payload.requestBody;

  if (!requestBody) {
    console.warn('[payment-webhook] Webhook received without requestBody. Payload:', payload);
    return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  }

  const transactionId = requestBody.transactionId;
  const status = requestBody.status;
  let dbStatus = '';

  if (!transactionId || !status) {
      console.warn('[payment-webhook] Webhook received without transactionId or status. Payload:', payload);
      return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  }

  switch (status.toUpperCase()) {
    case 'PAID':
    case 'CONFIRMED':
      dbStatus = 'paid';
      break;
    case 'REFUNDED':
      dbStatus = 'refunded';
      break;
    case 'CANCELED':
    case 'EXPIRED':
       dbStatus = 'canceled';
       break;
    default:
      console.warn(`[payment-webhook] Received unhandled webhook status: '${status}'`);
      return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
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

  return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
};

serve(async (req) => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('[payment-webhook] Critical error caught by server:', error);
    return new Response('Internal Server Error', {
      headers: corsHeaders,
      status: 500,
    });
  }
});