import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase Admin com Service Role Key
 * ⚠️ NUNCA use este cliente no frontend - apenas em API routes do servidor
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL não está configurada. ' +
      'Verifique seu arquivo .env.local e certifique-se de que a variável está definida.'
    )
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY não está configurada. ' +
      'Verifique seu arquivo .env.local e certifique-se de que a variável está definida. ' +
      'Você pode encontrar a Service Role Key no Supabase Dashboard → Settings → API.'
    )
  }

  // Validar formato básico da URL
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL tem formato inválido: "${supabaseUrl}". ` +
      'Deve começar com http:// ou https://'
    )
  }

  // Validar formato básico da Service Role Key (geralmente começa com "eyJ")
  if (!supabaseServiceRoleKey.startsWith('eyJ')) {
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY pode estar incorreta. ' +
      'Service Role Keys geralmente começam com "eyJ". ' +
      'Verifique se você está usando a Service Role Key (não a Anon Key).'
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

