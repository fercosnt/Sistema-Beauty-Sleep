import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    console.log('[update-password-via-email] Atualizando senha para:', email)
    
    const supabaseAdmin = createAdminClient()
    
    // Buscar usuário por email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('[update-password-via-email] Erro ao listar usuários:', listError)
      return NextResponse.json(
        { error: `Erro ao buscar usuário: ${listError.message}` },
        { status: 500 }
      )
    }
    
    const user = users?.users?.find(u => 
      u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()
    )
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    
    console.log('[update-password-via-email] Usuário encontrado:', user.id)
    
    // Atualizar senha usando Admin API
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: password,
      }
    )

    if (updateError) {
      console.error('[update-password-via-email] Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: `Erro ao atualizar senha: ${updateError.message}` },
        { status: 500 }
      )
    }
    
    console.log('[update-password-via-email] Senha atualizada com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      userId: updateData?.user?.id,
      email: updateData?.user?.email
    })
  } catch (error: any) {
    console.error('[update-password-via-email] Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado: ${error.message}` },
      { status: 500 }
    )
  }
}
