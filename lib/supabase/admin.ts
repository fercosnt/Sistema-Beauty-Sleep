import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase Admin com Service Role Key
 * ⚠️ NUNCA use este cliente no frontend - apenas em API routes do servidor
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não está configurada')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

