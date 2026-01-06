import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use default values if env vars are not set (for build/runtime compatibility)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

