import { createClient } from '@/lib/supabase/server'

export async function getUserRole(): Promise<string | null> {
  try {
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
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

export async function getUserData() {
  try {
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
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export async function getUserEmail(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email || null
  } catch (error) {
    console.error('Error getting user email:', error)
    return null
  }
}

