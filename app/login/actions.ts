'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('[login] Tentando fazer login para:', data.email)

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('[login] Erro no login:', error.message)
    // Normalizar email para evitar problemas de case sensitivity
    const normalizedEmail = data.email?.toLowerCase().trim()
    redirect(`/login?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(normalizedEmail || '')}`)
  }

  if (!signInData?.user) {
    console.error('[login] Login retornou sem usuário')
    redirect('/login?error=' + encodeURIComponent('Erro ao fazer login. Tente novamente.'))
  }

  console.log('[login] Login bem-sucedido para:', signInData.user.email)
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Email de recuperação enviado! Verifique sua caixa de entrada.'))
}

