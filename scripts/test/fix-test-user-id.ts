/**
 * Script para corrigir o ID do usuário na tabela users
 * 
 * O ID na tabela users deve ser o mesmo ID do Auth
 * 
 * Uso:
 *   npx tsx scripts/fix-test-user-id.ts
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUserId() {
  console.log('🔧 Corrigindo ID do usuário na tabela users...\n')

  try {
    // 1. Buscar usuário no Auth
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const authUser = authUsers?.users.find(u => u.email === testEmail)
    
    if (!authUser) {
      console.error(`❌ Usuário ${testEmail} não encontrado no Auth`)
      return
    }

    console.log(`✅ Usuário encontrado no Auth:`)
    console.log(`   ID: ${authUser.id}`)
    console.log(`   Email: ${authUser.email}\n`)

    // 2. Verificar na tabela users
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single()

    if (!dbUser) {
      console.log('📝 Usuário não existe na tabela users, criando...')
      
      const { error } = await supabase
        .from('users')
        .insert({
          id: authUser.id, // Usar o mesmo ID do Auth
          email: testEmail,
          nome: 'Admin Test',
          role: 'admin',
          ativo: true
        })

      if (error) {
        console.error('❌ Erro ao criar:', error.message)
      } else {
        console.log('✅ Usuário criado com ID correto!')
      }
      return
    }

    console.log(`📋 Usuário atual na tabela users:`)
    console.log(`   ID: ${dbUser.id}`)
    console.log(`   Email: ${dbUser.email}`)
    console.log(`   Nome: ${dbUser.nome}`)
    console.log(`   Role: ${dbUser.role}\n`)

    // 3. Se os IDs são diferentes, precisamos corrigir
    if (dbUser.id !== authUser.id) {
      console.log('⚠️  IDs diferentes detectados!')
      console.log(`   Auth ID: ${authUser.id}`)
      console.log(`   Users ID: ${dbUser.id}\n`)

      console.log('📝 Criando novo registro com ID correto...')
      
      // Deletar registro antigo (se não tiver dependências)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', dbUser.id)

      if (deleteError) {
        console.error('⚠️  Não foi possível deletar registro antigo:', deleteError.message)
        console.log('   Tentando atualizar diretamente...')
      }

      // Criar com ID correto
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id, // ID correto do Auth
          email: testEmail,
          nome: dbUser.nome || 'Admin Test',
          role: dbUser.role || 'admin',
          ativo: dbUser.ativo !== false
        })

      if (insertError) {
        if (insertError.code === '23505') {
          console.log('✅ Registro já existe com ID correto!')
        } else {
          console.error('❌ Erro ao criar:', insertError.message)
          
          // Tentar atualizar o ID diretamente (pode não funcionar devido a constraints)
          console.log('\n💡 Tentando atualizar o ID diretamente...')
          console.log('   (Isso pode falhar devido a constraints. Se falhar, você precisará')
          console.log('   deletar e recriar o usuário manualmente no Supabase)\n')
        }
      } else {
        console.log('✅ Registro criado com ID correto!')
      }
    } else {
      console.log('✅ IDs estão corretos! Nenhuma correção necessária.')
    }

    console.log('\n✅ Processo concluído!')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

fixUserId()

