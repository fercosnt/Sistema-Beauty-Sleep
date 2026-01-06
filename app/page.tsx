import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  try {
    const supabase = await createClient()
    
    // Check if we're using placeholder values (build time)
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Only try to get user if we have real env vars
    if (!isPlaceholder) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        redirect('/dashboard')
      } else {
        redirect('/login')
      }
    } else {
      // During build or when env vars are missing, just redirect to login without error
      redirect('/login')
    }
  } catch (error) {
    // If there's an error, redirect to login (but don't show config error during build)
    console.error('Error in Home page:', error)
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!isPlaceholder) {
      redirect('/login?error=config')
    } else {
      redirect('/login')
    }
  }
}

