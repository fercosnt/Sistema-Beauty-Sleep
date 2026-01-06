import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch (error) {
    // If there's an error (e.g., missing env variables), redirect to login
    console.error('Error in Home page:', error)
    redirect('/login?error=config')
  }
}

