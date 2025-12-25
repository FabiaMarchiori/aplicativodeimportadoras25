import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Regex para validar formato SOPH-XXXX-XXXX
const CODE_REGEX = /^SOPH-[A-Z0-9]{4}-[A-Z0-9]{4}$/

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ valid: false }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { code } = await req.json()

    console.log('[validate-soph-code] Validando código...')

    // Validar entrada
    if (!code || typeof code !== 'string') {
      console.log('[validate-soph-code] Código não fornecido ou inválido')
      return new Response(
        JSON.stringify({ valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar formato do código
    if (!CODE_REGEX.test(code)) {
      console.log('[validate-soph-code] Formato do código inválido')
      return new Response(
        JSON.stringify({ valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar cliente Supabase com service role para bypass de RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Consultar tabela de códigos
    const { data, error } = await supabaseAdmin
      .from('soph_access_codes')
      .select('id')
      .eq('code', code)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error) {
      console.error('[validate-soph-code] Erro ao consultar banco:', error.message)
      return new Response(
        JSON.stringify({ valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const isValid = !!data
    console.log(`[validate-soph-code] Resultado: ${isValid ? 'válido' : 'inválido'}`)

    return new Response(
      JSON.stringify({ valid: isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[validate-soph-code] Erro inesperado:', error)
    return new Response(
      JSON.stringify({ valid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
