/**
 * Script para verificar e criar usuário de teste
 * 
 * Uso:
 *   npx tsx scripts/verify-test-user.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const testEmail = process.env.TEST_USER_EMAIL || 'admin@test.com'
const testPassword = process.env.TEST_USER_PASSWORD || 'admin123'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.log('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAndCreateUser() {
  console.log('🔍 Verificando usuário de teste...\n')
  console.log(`📧 Email: ${testEmail}`)
  console.log(`🔑 Senha: ${testPassword.length > 0 ? '✅ Configurada' : '❌ Não configurada'}\n`)

  try {
    // 1. Verificar se usuário existe no Auth
    console.log('1️⃣ Verificando no Supabase Auth...')
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message)
      return
    }

    const existingAuthUser = authUsers.users.find(u => u.email === testEmail)
    
    if (existingAuthUser) {
      console.log(`   ✅ Usuário existe no Auth (ID: ${existingAuthUser.id})`)
      console.log(`   📅 Criado em: ${new Date(existingAuthUser.created_at).toLocaleString('pt-BR')}`)
      console.log(`   ✅ Email confirmado: ${existingAuthUser.email_confirmed_at ? 'Sim' : 'Não'}`)
      
      // Testar login
      console.log('\n2️⃣ Testando credenciais...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      if (signInError) {
        console.log(`   ❌ Login falhou: ${signInError.message}`)
        console.log('\n   💡 Soluções:')
        console.log('   1. Verificar se a senha está correta')
        console.log('   2. Resetar senha do usuário no Supabase Dashboard')
        console.log('   3. Ou criar um novo usuário com senha conhecida')
      } else {
        console.log('   ✅ Login bem-sucedido!')
        await supabase.auth.signOut()
      }
    } else {
      console.log('   ❌ Usuário NÃO existe no Auth')
      console.log('\n   📝 Criando usuário...')
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true
      })

      if (createError) {
        console.error('   ❌ Erro ao criar usuário:', createError.message)
        return
      }

      console.log(`   ✅ Usuário criado no Auth (ID: ${newUser.user?.id})`)
    }

    // 2. Verificar/Criar na tabela users
    console.log('\n3️⃣ Verificando na tabela users...')
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single()

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('   ❌ Erro ao buscar usuário:', dbError.message)
      return
    }

    if (dbUser) {
      console.log(`   ✅ Usuário existe na tabela users (ID: ${dbUser.id})`)
      console.log(`   👤 Nome: ${dbUser.nome}`)
      console.log(`   🔐 Role: ${dbUser.role}`)
      console.log(`   ✅ Ativo: ${dbUser.ativo ? 'Sim' : 'Não'}`)
      
      // Atualizar se necessário
      const needsUpdate = !dbUser.ativo || !dbUser.role || dbUser.role === 'recepcao'
      if (needsUpdate) {
        console.log('\n   📝 Atualizando usuário...')
        await supabase
          .from('users')
          .update({ 
            role: 'admin',
            ativo: true,
            nome: 'Admin Teste'
          })
          .eq('email', testEmail)
        console.log('   ✅ Usuário atualizado')
      }
    } else {
      console.log('   ❌ Usuário NÃO existe na tabela users')
      console.log('   📝 Criando na tabela users...')
      
      // Buscar ID do Auth primeiro
      const { data: authUser } = await supabase.auth.admin.listUsers()
      const userToCreate = authUser?.users.find(u => u.email === testEmail)
      
      if (userToCreate) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userToCreate.id,
            email: testEmail,
            nome: 'Admin Teste',
            role: 'admin',
            ativo: true
          })

        if (insertError) {
          console.error('   ❌ Erro ao criar na tabela users:', insertError.message)
        } else {
          console.log('   ✅ Usuário criado na tabela users')
        }
      }
    }

    console.log('\n✅ Verificação completa!')
    console.log('\n📋 Credenciais para usar nos testes:')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Senha: ${testPassword}`)

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

verifyAndCreateUser()

