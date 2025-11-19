
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-token',
}

// Função para normalizar o nome do plano
function normalizarPlano(productName: string, amount?: number): string {
  const lowerName = productName.toLowerCase();
  
  // Se o nome do produto contém "anual" ou o valor é >= 147
  if (lowerName.includes('anual') || (amount && amount >= 147)) {
    return 'Anual';
  }
  
  // Se o nome do produto contém "mensal" ou o valor é >= 27
  if (lowerName.includes('mensal') || (amount && amount >= 27)) {
    return 'Mensal';
  }
  
  // Fallback: usar o nome original
  return productName;
}

// Função para calcular a data de expiração baseado no plano
function calcularDataExpiracao(plano: string, dataInicio: string, expiresAt?: string): string | null {
  // Se a Kiwify forneceu expires_at, usar esse valor
  if (expiresAt) {
    return new Date(expiresAt).toISOString();
  }
  
  const inicio = new Date(dataInicio);
  
  if (plano === 'Anual') {
    inicio.setFullYear(inicio.getFullYear() + 1);
    return inicio.toISOString();
  }
  
  if (plano === 'Mensal') {
    inicio.setMonth(inicio.getMonth() + 1);
    return inicio.toISOString();
  }
  
  return null;
}

// Normaliza o valor da assinatura - sempre usa o valor real enviado pela Kiwify
// Isso permite valores promocionais (Black Friday, etc)
function normalizarValor(amount: number | undefined, plano: string): number {
  return amount || 0;
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
    // === DEBUG: Logging completo para diagnóstico ===
    console.log('=== 🔍 DEBUG: INÍCIO DO DIAGNÓSTICO ===')
    
    console.log('=== 📋 Todos os Headers Recebidos ===')
    req.headers.forEach((value, key) => {
      // Mostra o valor completo para tokens, mas mascara se for muito longo
      if (key.toLowerCase().includes('token') || key.toLowerCase() === 'authorization') {
        console.log(`${key}: ${value}`)
      } else {
        console.log(`${key}: ${value}`)
      }
    })
    
    console.log('=== 🌐 URL Completa ===')
    console.log(req.url)
    
    console.log('=== 📦 Método HTTP ===')
    console.log(req.method)
    
    // Validar token do webhook - aceita tanto x-kiwify-token quanto authorization
    const tokenFromHeader = req.headers.get('x-kiwify-token')
    const authHeader = req.headers.get('authorization')
    const tokenFromAuth = authHeader?.replace('Bearer ', '').trim()
    const kiwifySignature = tokenFromHeader || tokenFromAuth
    const webhookToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')

    console.log('🔐 Token recebido:', kiwifySignature || 'null')
    console.log('🔐 Token esperado:', webhookToken || 'null')
    console.log('🔐 Fonte do token:', tokenFromHeader ? 'x-kiwify-token' : tokenFromAuth ? 'authorization' : 'nenhum')

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: KiwifyWebhookPayload = await req.json()
    
    console.log('=== 📨 Body Completo Recebido ===')
    console.log(JSON.stringify(payload, null, 2))
    console.log('=== 🔍 DEBUG: FIM DO DIAGNÓSTICO ===')
    
    console.log('Webhook recebido:', JSON.stringify(payload, null, 2))

    // Log do webhook recebido - captura o ID para atualizações posteriores
    const { data: logData, error: logError } = await supabaseClient
      .from('webhook_logs')
      .insert({
        evento: payload.event,
        payload: payload,
        status: 'received'
      })
      .select('id')
      .single()

    if (logError) {
      console.error('⚠️ Erro ao criar log inicial:', logError)
    }

    const logId = logData?.id
    console.log('📝 Log ID criado:', logId)

    const { event, data } = payload
    const { customer, product } = data

    if (!customer?.email) {
      throw new Error('Email do cliente não fornecido')
    }

    // Processar eventos diferentes
    switch (event) {
      case 'subscription.created':
      case 'payment.approved':
        await processSubscriptionCreated(supabaseClient, data)
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

    // Atualizar log como processado (não cria duplicata)
    if (logId) {
      await supabaseClient
        .from('webhook_logs')
        .update({
          status: 'processed',
          payload: payload
        })
        .eq('id', logId)
      console.log('✅ Log atualizado para processed:', logId)
    } else {
      // Fallback: se não temos o ID, criar novo registro
      await supabaseClient
        .from('webhook_logs')
        .insert({
          evento: payload.event,
          payload: payload,
          status: 'processed'
        })
      console.log('⚠️ Novo log processed criado (fallback)')
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processado com sucesso' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Erro no webhook:', {
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });

    // Log de erro estruturado
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    try {
      // Tenta obter o logId do escopo anterior se disponível
      const logIdFromScope = typeof logId !== 'undefined' ? logId : null;
      
      if (logIdFromScope) {
        // Atualizar log existente com erro
        await supabaseClient
          .from('webhook_logs')
          .update({
            status: 'error',
            error_message: errorMessage,
            payload: { 
              error: errorMessage,
              stack: errorStack,
              timestamp: new Date().toISOString()
            }
          })
          .eq('id', logIdFromScope)
        console.log('✅ Log atualizado para error:', logIdFromScope)
      } else {
        // Criar novo log de erro se não houver log inicial
        await supabaseClient
          .from('webhook_logs')
          .insert({
            evento: 'error',
            payload: { 
              error: errorMessage,
              stack: errorStack,
              timestamp: new Date().toISOString()
            },
            status: 'error',
            error_message: errorMessage
          })
        console.log('⚠️ Novo log error criado (sem logId)')
      }
    } catch (logError) {
      console.error('❌ Erro ao salvar log de erro:', logError);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function processSubscriptionCreated(supabaseClient: any, data: any) {
  console.log('📧 Email do cliente:', data.customer.email);
  console.log('🆔 Subscription ID:', data.subscription_id);
  console.log('📦 Produto original:', data.product.name);
  console.log('💰 Valor recebido:', data.amount);
  
  // Normalizar plano e calcular valores
  const planoNormalizado = normalizarPlano(data.product.name, data.amount);
  const valorNormalizado = normalizarValor(data.amount, planoNormalizado);
  const dataInicio = data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString();
  const dataExpiracao = calcularDataExpiracao(planoNormalizado, dataInicio, data.expires_at);
  
  console.log('📦 Plano normalizado:', planoNormalizado);
  console.log('💰 Valor a ser gravado:', valorNormalizado);
  
  // Detectar promoções
  if (planoNormalizado === 'Anual' && valorNormalizado !== 147) {
    console.log('🎉 PROMOÇÃO DETECTADA - Valor promocional:', valorNormalizado);
  }
  if (planoNormalizado === 'Mensal' && valorNormalizado !== 27) {
    console.log('🎉 PROMOÇÃO DETECTADA - Valor promocional:', valorNormalizado);
  }
  
  console.log('📅 Data início:', dataInicio);
  console.log('📅 Data expiração calculada:', dataExpiracao);
  
  const subscriptionData = {
    user_id: null, // Será vinculado quando o usuário fizer login
    kiwify_subscription_id: data.subscription_id || `manual_${Date.now()}`,
    kiwify_customer_id: data.customer.id,
    email: data.customer.email,
    nome_cliente: data.customer.name,
    status: 'ativa',
    plano: planoNormalizado,
    valor: valorNormalizado,
    data_inicio: dataInicio,
    data_expiracao: dataExpiracao
  }

  const { error } = await supabaseClient
    .from('assinaturas')
    .upsert(subscriptionData, { 
      onConflict: 'kiwify_subscription_id',
      ignoreDuplicates: false 
    })

  if (error) {
    console.error('❌ Erro ao criar assinatura:', error.message);
    throw new Error(`Erro ao criar assinatura: ${error.message}`)
  }

  console.log('✅ Assinatura criada/atualizada com sucesso:', subscriptionData)
}

async function processSubscriptionRenewed(supabaseClient: any, data: any) {
  console.log('🔄 Renovando assinatura:', data.subscription_id);
  console.log('📅 Nova data de expiração:', data.expires_at);
  
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'ativa',
      data_expiracao: data.expires_at ? new Date(data.expires_at).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    console.error('❌ Erro ao renovar assinatura:', error.message);
    throw new Error(`Erro ao renovar assinatura: ${error.message}`)
  }

  console.log('✅ Assinatura renovada com sucesso:', data.subscription_id)
}

async function processSubscriptionCancelled(supabaseClient: any, data: any) {
  console.log('🚫 Cancelando assinatura:', data.subscription_id);
  
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'cancelada',
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    console.error('❌ Erro ao cancelar assinatura:', error.message);
    throw new Error(`Erro ao cancelar assinatura: ${error.message}`)
  }

  console.log('✅ Assinatura cancelada com sucesso:', data.subscription_id)
}

async function processPaymentRefunded(supabaseClient: any, data: any) {
  console.log('💸 Processando reembolso:', data.subscription_id);
  
  const { error } = await supabaseClient
    .from('assinaturas')
    .update({
      status: 'reembolsada',
      updated_at: new Date().toISOString()
    })
    .eq('kiwify_subscription_id', data.subscription_id)

  if (error) {
    console.error('❌ Erro ao processar reembolso:', error.message);
    throw new Error(`Erro ao processar reembolso: ${error.message}`)
  }

  console.log('✅ Reembolso processado com sucesso:', data.subscription_id)
}
