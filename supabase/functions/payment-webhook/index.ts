import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log(`[payment-webhook-test] ----- NOVA REQUISIÇÃO -----`);
  console.log(`[payment-webhook-test] Método: ${req.method}`);
  
  // Log de todos os cabeçalhos para diagnóstico
  for (const [key, value] of req.headers.entries()) {
    console.log(`[payment-webhook-test] Cabeçalho: ${key}: ${value}`);
  }

  // Lida com a requisição CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[payment-webhook-test] Respondendo à requisição OPTIONS.');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    console.log('[payment-webhook-test] Corpo da requisição (raw):', bodyText);
  } catch (e) {
    console.error('[payment-webhook-test] Não foi possível ler o corpo da requisição:', e.message);
  }
  
  console.log('[payment-webhook-test] Enviando resposta 200 OK agora.');
  return new Response('OK', { 
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' }, 
    status: 200 
  });
});