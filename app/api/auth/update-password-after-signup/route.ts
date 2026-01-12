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

    const body = await request.json()
    const { password } = body

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    console.log('[update-password] Atualizando senha para usuário:', user.id, user.email)
    
    // Atualizar senha usando Admin API (mais confiável que updateUser do cliente)
    const supabaseAdmin = createAdminClient()
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: password,
      }
    )

    if (updateError) {
      console.error('[update-password] Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: `Erro ao atualizar senha: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('[update-password] Senha atualizada com sucesso via Admin API')
    console.log('[update-password] Dados atualizados:', {
      userId: updateData?.user?.id,
      email: updateData?.user?.email
    })
    
    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso'
    })
  } catch (error: any) {
    console.error('[update-password] Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado: ${error.message}` },
      { status: 500 }
    )
  }
}
