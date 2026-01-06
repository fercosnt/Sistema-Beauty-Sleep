/**
 * Script para criar usuários de teste no Supabase Auth e na tabela users
 * 
 * Cria 3 usuários:
 * - admin@test.com (role: admin)
 * - equipe@test.com (role: equipe)
 * - recepcao@test.com (role: recepcao)
 * 
 * Uso:
 *   npx tsx scripts/create-test-users.ts
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.log('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TEST_USERS = [
  { email: 'admin@test.com', password: 'admin123', nome: 'Admin Test', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', nome: 'Equipe Test', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', nome: 'Recepcao Test', role: 'recepcao' }
]

async function createTestUsers() {
  console.log('🔐 Criando usuários de teste...\n')

  for (const user of TEST_USERS) {
    try {
      // 1. Criar no Supabase Auth
      console.log(`📝 Criando ${user.email} (${user.role})...`)
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  ${user.email} já existe no Auth, continuando...`)
        } else {
          console.error(`  ❌ Erro ao criar no Auth: ${authError.message}`)
          continue
        }
      } else {
        console.log(`  ✅ Criado no Auth: ${authData.user?.id}`)
      }

      // 2. Buscar ou criar na tabela users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single()

      if (existingUser) {
        console.log(`  ⚠️  ${user.email} já existe na tabela users, atualizando role...`)
        await supabase
          .from('users')
          .update({ role: user.role, nome: user.nome, ativo: true })
          .eq('email', user.email)
      } else {
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            nome: user.nome,
            role: user.role,
            ativo: true
          })

        if (dbError) {
          console.error(`  ❌ Erro ao criar na tabela users: ${dbError.message}`)
        } else {
          console.log(`  ✅ Criado na tabela users`)
        }
      }

      console.log(`  ✅ ${user.email} configurado com sucesso!\n`)
    } catch (error: any) {
      console.error(`  ❌ Erro ao processar ${user.email}: ${error.message}\n`)
    }
  }

  console.log('✅ Usuários de teste criados!')
  console.log('\n📋 Credenciais:')
  TEST_USERS.forEach(u => {
    console.log(`  ${u.email} / ${u.password} (${u.role})`)
  })
}

createTestUsers()

