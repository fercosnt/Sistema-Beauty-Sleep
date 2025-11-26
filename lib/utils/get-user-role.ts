import { createClient } from '@/lib/supabase/server'

export async function getUserRole(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, ativo')
    .eq('email', user.email)
    .single()

  if (!userData || !userData.ativo) {
    return null
  }

  return userData.role
}

export async function getUserData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single()

  if (!userData || !userData.ativo) {
    return null
  }

  return {
    ...userData,
    authUser: user,
  }
}

export async function getUserEmail(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email || null
}

