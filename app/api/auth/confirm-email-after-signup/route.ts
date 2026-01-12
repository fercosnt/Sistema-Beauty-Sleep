import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar se o usuário está autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se o email já está confirmado
    if (user.email_confirmed_at) {
      return NextResponse.json(
        { success: true, message: 'Email já está confirmado' }
      )
    }

    // Confirmar email usando Admin API
    const supabaseAdmin = createAdminClient()
    
    console.log('[confirm-email] Confirmando email para usuário:', user.id, user.email)
    
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
      }
    )

    if (updateError) {
      console.error('[confirm-email] Erro ao confirmar email:', updateError)
      return NextResponse.json(
        { error: `Erro ao confirmar email: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('[confirm-email] Email confirmado com sucesso para:', user.email)
    console.log('[confirm-email] Dados atualizados:', {
      userId: updateData?.user?.id,
      email: updateData?.user?.email,
      emailConfirmed: updateData?.user?.email_confirmed_at ? 'Sim' : 'Não'
    })
    
    return NextResponse.json({
      success: true,
      message: 'Email confirmado com sucesso'
    })
  } catch (error: any) {
    console.error('[confirm-email] Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado: ${error.message}` },
      { status: 500 }
    )
  }
}
