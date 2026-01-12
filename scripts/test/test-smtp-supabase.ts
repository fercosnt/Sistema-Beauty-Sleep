/**
 * Script para testar SMTP do Supabase
 * 
 * Este script testa se o SMTP está configurado corretamente tentando:
 * 1. Criar um usuário de teste
 * 2. Enviar email de convite
 * 3. Verificar se o email foi enviado
 * 
 * Uso:
 *   npx tsx scripts/test/test-smtp-supabase.ts <email-de-teste>
 * 
 * Exemplo:
 *   npx tsx scripts/test/test-smtp-supabase.ts teste@exemplo.com
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carregar variáveis de ambiente
const envPath = path.join(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que .env.local contém:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Criar cliente Supabase Admin
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testSMTP(email: string) {
  console.log('🧪 Testando SMTP do Supabase...\n')
  console.log(`📧 Email de teste: ${email}\n`)

  try {
    // Passo 1: Verificar se o email já existe
    console.log('1️⃣ Verificando se o email já existe...')
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = usersList?.users?.find(u => 
      u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()
    )
    
    if (existingUser) {
      console.log('⚠️  Email já existe. Vamos deletar para criar um novo teste...')
      await supabaseAdmin.auth.admin.deleteUser(existingUser.user.id)
      console.log('✅ Usuário antigo removido\n')
    } else {
      console.log('✅ Email não existe, podemos criar novo usuário\n')
    }

    // Passo 2: Criar usuário de teste
    console.log('2️⃣ Criando usuário de teste...')
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false, // Não confirmar automaticamente para testar o email
      user_metadata: {
        nome: 'Teste SMTP',
        role: 'equipe',
      },
    })

    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError.message)
      return false
    }

    if (!newUser.user) {
      console.error('❌ Usuário não foi criado')
      return false
    }

    console.log('✅ Usuário criado com sucesso!')
    console.log(`   ID: ${newUser.user.id}\n`)

    // Passo 3: Enviar email de convite
    console.log('3️⃣ Enviando email de convite...')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SUPABASE_URL.replace(/\/$/, '')
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/login?reset=true`,
      data: {
        nome: 'Teste SMTP',
        role: 'equipe',
      },
    })

    if (inviteError) {
      console.error('❌ Erro ao enviar email de convite:', inviteError.message)
      console.error('\n📋 Possíveis causas:')
      console.error('   1. SMTP não está configurado no Supabase Dashboard')
      console.error('   2. Credenciais SMTP estão incorretas')
      console.error('   3. Provedor SMTP está bloqueando o envio')
      console.error('   4. Limite de envio atingido')
      console.error('\n💡 Verifique:')
      console.error('   - Supabase Dashboard > Settings > Auth > SMTP Settings')
      console.error('   - Logs do Supabase: Dashboard > Logs > Auth Logs')
      
      // Tentar gerar link como fallback
      console.log('\n🔄 Tentando gerar link de recovery como fallback...')
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: `${siteUrl}/login?reset=true`,
        },
      })

      if (linkError) {
        console.error('❌ Erro ao gerar link:', linkError.message)
        return false
      }

      if (linkData?.properties?.action_link) {
        console.log('✅ Link de recovery gerado (mas email pode não ter sido enviado):')
        console.log(`   ${linkData.properties.action_link}\n`)
        console.log('⚠️  NOTA: Este link foi gerado, mas o email pode não ter sido enviado.')
        console.log('   Configure SMTP no Supabase para envio automático de emails.\n')
        return false
      }
    } else {
      console.log('✅ Email de convite enviado com sucesso!')
      console.log('\n📧 Verifique sua caixa de entrada:')
      console.log(`   - Email: ${email}`)
      console.log('   - Pasta de spam/lixo eletrônico')
      console.log('   - Aguarde alguns minutos (pode haver delay)\n')
    }

    // Passo 4: Verificar logs (se possível)
    console.log('4️⃣ Verificando status...')
    console.log('💡 Dica: Verifique os logs do Supabase:')
    console.log('   - Dashboard > Logs > Auth Logs')
    console.log('   - Procure por "invite_user" ou erros SMTP\n')

    // Passo 5: Limpeza (opcional)
    console.log('5️⃣ Limpeza...')
    console.log('⚠️  Usuário de teste foi criado. Deseja removê-lo?')
    console.log('   Execute manualmente no Supabase Dashboard se necessário.\n')

    return true
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error.message)
    return false
  }
}

// Executar teste
const email = process.argv[2]

if (!email) {
  console.error('❌ Erro: Email não fornecido!')
  console.error('\nUso:')
  console.error('  npx tsx scripts/test/test-smtp-supabase.ts <email-de-teste>')
  console.error('\nExemplo:')
  console.error('  npx tsx scripts/test/test-smtp-supabase.ts teste@exemplo.com')
  process.exit(1)
}

// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  console.error('❌ Erro: Email inválido!')
  process.exit(1)
}

testSMTP(email)
  .then((success) => {
    if (success) {
      console.log('✅ Teste concluído com sucesso!')
      process.exit(0)
    } else {
      console.log('⚠️  Teste concluído com avisos. Verifique os logs acima.')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })







