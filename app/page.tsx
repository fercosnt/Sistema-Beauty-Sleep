import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Verificar parâmetros de convite ou recovery na URL
  const token = searchParams.token as string | undefined
  const type = searchParams.type as string | undefined
  const code = searchParams.code as string | undefined
  const tokenHash = searchParams.token_hash as string | undefined

  // Se for invite, redirecionar para signup
  if (type === 'invite' || type === 'signup' || tokenHash) {
    const signupUrl = new URL('/auth/signup', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    if (code) signupUrl.searchParams.set('code', code)
    if (type) signupUrl.searchParams.set('type', type)
    if (tokenHash) signupUrl.searchParams.set('token_hash', tokenHash)
    redirect(signupUrl.toString())
  }

  // Se tiver token de recovery na URL, redirecionar para callback
  if (token && type === 'recovery') {
    redirect(`/auth/callback?token=${token}&type=recovery`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}

