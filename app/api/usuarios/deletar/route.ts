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
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem excluir usuários.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userEmail = searchParams.get('email')

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'userId e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Prevenir que o admin exclua a si mesmo
    if (currentUserData.id === userId) {
      return NextResponse.json(
        { error: 'Você não pode excluir seu próprio usuário' },
        { status: 400 }
      )
    }

    // Buscar o usuário no Auth pelo email
    const supabaseAdmin = createAdminClient()
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Erro ao listar usuários do Auth:', listError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuário no sistema de autenticação' },
        { status: 500 }
      )
    }

    const authUser = authUsers.users.find((u) => u.email === userEmail)
    
    // Usar cliente admin para deletar (bypassa RLS)
    // Deletar da tabela users primeiro
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('Erro ao deletar usuário da tabela:', deleteError)
      return NextResponse.json(
        { error: `Erro ao excluir usuário: ${deleteError.message}` },
        { status: 500 }
      )
    }

    // Deletar do Auth também (se encontrou o usuário)
    if (authUser) {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id)
      
      if (authDeleteError) {
        console.warn('Erro ao deletar usuário do Auth (não crítico):', authDeleteError)
        // Não falhar o processo, pois já deletamos da tabela
      }
    } else {
      console.warn('Usuário não encontrado no Auth, mas foi deletado da tabela users')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Usuário excluído com sucesso' 
    })
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado ao excluir usuário: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

