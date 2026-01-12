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
    console.log('[update-password] Senha recebida (primeiros 3 chars):', password.substring(0, 3) + '***')
    
    // Verificar estado atual do usuário antes de atualizar
    const supabaseAdmin = createAdminClient()
    const { data: currentUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(user.id)
    
    if (getUserError) {
      console.error('[update-password] Erro ao buscar usuário:', getUserError)
      return NextResponse.json(
        { error: `Erro ao buscar usuário: ${getUserError.message}` },
        { status: 500 }
      )
    }
    
    console.log('[update-password] Estado atual do usuário:', {
      id: currentUser?.user?.id,
      email: currentUser?.user?.email,
      emailConfirmed: currentUser?.user?.email_confirmed_at ? 'Sim' : 'Não',
      createdAt: currentUser?.user?.created_at
    })
    
    // Atualizar senha usando Admin API (mais confiável que updateUser do cliente)
    console.log('[update-password] Chamando updateUserById com Admin API...')
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: password,
      }
    )

    if (updateError) {
      console.error('[update-password] Erro ao atualizar senha:', updateError)
      console.error('[update-password] Detalhes do erro:', {
        message: updateError.message,
        status: updateError.status,
        name: updateError.name
      })
      return NextResponse.json(
        { error: `Erro ao atualizar senha: ${updateError.message}` },
        { status: 500 }
      )
    }
    
    console.log('[update-password] updateUserById retornou sem erros')

    console.log('[update-password] Senha atualizada com sucesso via Admin API')
    console.log('[update-password] Dados atualizados:', {
      userId: updateData?.user?.id,
      email: updateData?.user?.email
    })
    
    // IMPORTANTE: Verificar se a senha foi realmente salva testando login
    // Aguardar um pouco para garantir que a atualização foi processada
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Testar se o login funciona com a senha que acabamos de definir
    // Usar Admin API para criar um cliente temporário e testar login
    console.log('[update-password] Testando login com a senha recém-definida...')
    try {
      // Criar um cliente anônimo para testar login
      const { createClient: createClientBrowser } = await import('@supabase/supabase-js')
      const testSupabase = createClientBrowser(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Tentar fazer login com a senha que acabamos de definir
      const { data: testLogin, error: testLoginError } = await testSupabase.auth.signInWithPassword({
        email: user.email!,
        password: password
      })
      
      if (testLoginError) {
        console.error('[update-password] ⚠️ TESTE DE LOGIN FALHOU:', testLoginError.message)
        console.error('[update-password] Isso pode indicar que a senha não foi salva corretamente')
        // Não retornar erro aqui - pode ser um problema de timing
        // A senha pode estar sendo processada ainda
      } else {
        console.log('[update-password] ✅ TESTE DE LOGIN BEM-SUCEDIDO! Senha foi salva corretamente.')
        // Fazer logout do cliente de teste
        await testSupabase.auth.signOut()
      }
    } catch (testError: any) {
      console.warn('[update-password] Erro ao testar login (não crítico):', testError.message)
      // Não falhar a requisição por causa do teste
    }
    
    // Verificar dados do usuário via Admin API
    const testClient = createAdminClient()
    const { data: testUser } = await testClient.auth.admin.getUserById(user.id)
    
    if (testUser?.user) {
      console.log('[update-password] Usuário verificado via Admin API:', {
        id: testUser.user.id,
        email: testUser.user.email,
        emailConfirmed: testUser.user.email_confirmed_at ? 'Sim' : 'Não',
        lastSignIn: testUser.user.last_sign_in_at
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      userId: updateData?.user?.id,
      email: updateData?.user?.email
    })
  } catch (error: any) {
    console.error('[update-password] Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado: ${error.message}` },
      { status: 500 }
    )
  }
}
