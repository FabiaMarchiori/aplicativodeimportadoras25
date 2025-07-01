
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KiwifyWebhookPayload {
  event: string;
  data: {
    subscription_id?: string;
    customer: {
      email: string;
      name?: string;
      id?: string;
    };
    product: {
      name: string;
      id?: string;
    };
    amount?: number;
    status?: string;
    created_at?: string;
    expires_at?: string;
    cancelled_at?: string;
    refunded_at?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validar token do webhook
    const kiwifySignature = req.headers.get('X-Kiwify-Signature')
    const webhookToken = Deno.env.get('KIIWIFY_WEBHOOK_TOKEN')

    if (!kiwifySignature || !webhookToken) {
      console.error('Token do webhook não fornecido ou não configurado')
      return new Response(
        JSON.stringify({ error: 'Token de autenticação não fornecido' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    if (kiwifySignature !== webhookToken) {
      console.error('Token do webhook inválido')
      return new Response(
        JSON.stringify({ error: 'Token de autenticação inválido' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('KIIWIFY_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: KiwifyWebhookPayload = await req.json()
    console.log('Webhook recebido:', JSON.stringify(payload, null, 2))

    // Log do webhook recebido
    await supabaseClient
      .from('webhook_logs')
      .insert({
        evento: payload.event,
        payload: payload,
        status: 'received'
      })

    const { event, data } = payload
    const { customer, product } = data

    if (!customer?.email) {
      throw new Error('Email do cliente não fornecido')
    }

    // Buscar ou criar usuário
    const { data: userId, error: userError } = await supabaseClient
      .rpc('get_or_create_user_by_email', { email_param: customer.email })

    if (userError) {
      throw new Error(`Erro ao buscar/criar usuário: ${userError.message}`)
    }

    console.log('User ID:', userId)

    // Processar eventos diferentes
    switch (event) {
      case 'subscription.created':
      case 'payment.approved':
        await processSubscriptionCreated(supabaseClient, userId, data)
        break

      case 'subscription.renewed':
        await processSubscriptionRenewed(supabaseClient, data)
        break

      case 'subscription.cancelled':
        await processSubscriptionCancelled(supabaseClient, data)
        break

      case 'payment.refunded':
        await processPaymentRefunded(supabaseClient, data)
        break

      default:
        console.log(`Evento não processado: ${event}`)
    }

    // Atualizar log como processado
    await supabaseClient
      .from('webhook_logs')
      .insert({
        evento: payload.event,
        payload: payload,
        status: 'processed'
      })

    return new Response(
      JSON.stringify({ message: 'Webhook processado com sucesso' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro no webhook:', error)

    // Log de erro
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('KIIWIFY_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient
      .from('webhook_logs')
      .insert({
        evento: 'error',
        payload: { error: error.message },
        status: 'error',
        error_message: error.message
      })

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function processSubscriptionCreated(supabaseClient: any, userId: string, data: any) {
  const subscriptionData = {
    user_id: userId,
    kiwify_subscription_id: data.subscription_id || `manual_${Date.now()}`,
    kiwify_customer_id: data.customer.id,
    email: data.customer.email,
    nome_cliente: data.customer.name,
    status: 'ativa',
    plano: data.product.name,
    valor: data.amount,
    data_inicio: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    data_expiracao: data.expires_at ? new Date(data.expires_at).toISOString() : null
  }

  const { error } = await supabaseClient
    .from('assinaturas')
    .upsert(subscriptionData, { 
      onConflict: 'kiwify_subscription_id',
      ignoreDuplicates: false 
    })

  if (error) {
    throw new Error(`Erro ao criar assinatura: ${error.message}`)
  }

  console.log('Assinatura criada/atualizada:', subscriptionData)
}

async function processSubscriptionRenewed(supabaseClient: any, data: any) {
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'ativa',
      data_expiracao: data.expires_at ? new Date(data.expires_at).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    throw new Error(`Erro ao renovar assinatura: ${error.message}`)
  }

  console.log('Assinatura renovada:', data.subscription_id)
}

async function processSubscriptionCancelled(supabaseClient: any, data: any) {
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'cancelada',
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    throw new Error(`Erro ao cancelar assinatura: ${error.message}`)
  }

  console.log('Assinatura cancelada:', data.subscription_id)
}

async function processPaymentRefunded(supabaseClient: any, data: any) {
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'reembolsada',
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    throw new Error(`Erro ao processar reembolso: ${error.message}`)
  }

  console.log('Assinatura reembolsada:', data.subscription_id)
}
