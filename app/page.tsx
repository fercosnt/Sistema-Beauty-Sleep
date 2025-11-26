<<<<<<< HEAD
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
=======
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Beauty Sleep</h1>
      <p className="mt-4 text-lg">Sistema de Tratamento</p>
    </div>
  );
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
}

