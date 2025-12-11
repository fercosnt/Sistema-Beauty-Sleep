import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar se o usuário é admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: currentUserData } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('email', user.email)
      .single()

    if (currentUserData?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem excluir pacientes.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const pacienteId = searchParams.get('pacienteId')

    if (!pacienteId) {
      return NextResponse.json(
        { error: 'pacienteId é obrigatório' },
        { status: 400 }
      )
    }

    // Usar cliente admin para deletar (bypassa RLS)
    const supabaseAdmin = createAdminClient()
    
    // Deletar da tabela pacientes
    // Nota: O banco tem ON DELETE CASCADE para exames, sessoes, notas, etc.
    const { error: deleteError } = await supabaseAdmin
      .from('pacientes')
      .delete()
      .eq('id', pacienteId)

    if (deleteError) {
      console.error('Erro ao deletar paciente:', deleteError)
      return NextResponse.json(
        { error: `Erro ao excluir paciente: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Paciente excluído com sucesso' 
    })
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado ao excluir paciente: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

