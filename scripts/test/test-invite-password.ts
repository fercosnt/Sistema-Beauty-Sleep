/**
 * Script para testar se a senha está sendo salva corretamente após convite
 * 
 * Uso: npx tsx scripts/test/test-invite-password.ts <email>
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Carregar variáveis do .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('✅ Variáveis carregadas do .env.local')
} else {
  console.warn('⚠️  Arquivo .env.local não encontrado, usando variáveis de ambiente do sistema')
  dotenv.config() // Tenta carregar do .env se existir
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testInvitePassword(email: string) {
  console.log(`\n🔍 Testando senha para usuário: ${email}\n`)

  try {
    // 1. Buscar usuário
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError)
      return
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      console.error(`❌ Usuário ${email} não encontrado`)
      return
    }

    console.log(`✅ Usuário encontrado:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Email confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`)
    console.log(`   Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`)

    // 2. Testar login com senha de teste
    const testPassword = 'Teste123!@#'
    console.log(`\n🔑 Testando login com senha de teste: ${testPassword}`)
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: testPassword
    })

    if (signInError) {
      console.log(`   ❌ Login falhou: ${signInError.message}`)
      
      if (signInError.message.includes('Invalid login credentials')) {
        console.log(`\n   💡 Isso indica que a senha não está correta ou não foi salva.`)
        console.log(`   💡 Vamos tentar atualizar a senha usando Admin API...`)
        
        // Tentar atualizar senha
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          {
            password: testPassword,
          }
        )

        if (updateError) {
          console.error(`   ❌ Erro ao atualizar senha: ${updateError.message}`)
          return
        }

        console.log(`   ✅ Senha atualizada via Admin API`)
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Testar login novamente
        console.log(`\n🔑 Testando login novamente após atualizar senha...`)
        const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
          email: email,
          password: testPassword
        })

        if (signInError2) {
          console.error(`   ❌ Login ainda falha: ${signInError2.message}`)
          console.error(`   ⚠️  Isso indica um problema mais profundo com o Supabase`)
        } else {
          console.log(`   ✅ Login bem-sucedido após atualizar senha!`)
          console.log(`   📋 Credenciais de teste:`)
          console.log(`      Email: ${email}`)
          console.log(`      Senha: ${testPassword}`)
        }
      }
    } else {
      console.log(`   ✅ Login bem-sucedido!`)
      console.log(`   📋 Credenciais funcionam:`)
      console.log(`      Email: ${email}`)
      console.log(`      Senha: ${testPassword}`)
    }

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

import * as readline from 'readline'

// Função para ler input do usuário
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  let email = process.argv[2]

  // Se não foi passado como argumento, pedir ao usuário
  if (!email) {
    console.log('\n📧 Digite o email do usuário para testar:')
    email = await askQuestion('Email: ')
    
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido')
      process.exit(1)
    }
  }

  await testInvitePassword(email.trim())
}

main()
