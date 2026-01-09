'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function completeSignup(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const email = formData.get('email') as string

  if (!email) {
    redirect('/auth/signup?error=' + encodeURIComponent('Email é obrigatório'))
  }

  if (password !== confirmPassword) {
    redirect('/auth/signup?error=' + encodeURIComponent('As senhas não coincidem'))
  }

  if (password.length < 6) {
    redirect('/auth/signup?error=' + encodeURIComponent('A senha deve ter pelo menos 6 caracteres'))
  }

  // Verificar se o usuário já está autenticado (via convite)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Usuário já autenticado via convite, apenas atualizar senha
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      redirect('/auth/signup?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } else {
    // Se não estiver autenticado, o token pode não ter sido processado
    redirect('/auth/signup?error=' + encodeURIComponent('Link de convite inválido ou expirado. Solicite um novo convite.'))
  }
}

