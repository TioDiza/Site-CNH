import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    console.log('[upsert-starlink-customer] Handling OPTIONS request.');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const customerData = await req.json();

    if (!customerData || !customerData.cpf) {
        console.error('[upsert-starlink-customer] Missing customer data or CPF.');
        return new Response(JSON.stringify({ error: 'Dados do cliente, incluindo CPF, são obrigatórios.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[upsert-starlink-customer] Upserting customer with CPF:', customerData.cpf);
    const { data, error } = await supabaseAdmin
      .from('starlink_customers')
      .upsert(customerData, { onConflict: 'cpf' })
      .select()
      .single();

    if (error) {
      console.error('[upsert-starlink-customer] Error during upsert:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('[upsert-starlink-customer] Upsert successful for customer ID:', data.id);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[upsert-starlink-customer] Unexpected error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})