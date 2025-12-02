/**
 * Script para deletar usuários de teste do Supabase
 * 
 * Este script deleta usuários de teste tanto da tabela users quanto do Supabase Auth.
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente no .env.local:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY (necessário para deletar do Auth)
 * 
 * 2. Execute: tsx scripts/delete-test-users.ts
 * 
 * ATENÇÃO: Este script deleta usuários permanentemente!
 */

import { createClient } from '@supabase/supabase-js';

// Lista de emails de teste a serem deletados
const TEST_EMAILS = [
  'admin@test.com',
  'equipe@test.com',
  'recepcao@test.com',
  'test@test.com',
  'teste@teste.com',
  'user@test.com',
];

// Emails de produção que NÃO devem ser deletados
const PRODUCTION_EMAILS = [
  'admin@beautysmile.com',
  'dentista@beautysmile.com',
  'recepcao@beautysmile.com',
];

async function deleteTestUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configurados no .env.local');
    process.exit(1);
  }

  // Criar cliente Admin (service_role)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('🔍 Buscando usuários de teste...\n');

  let deletedFromUsers = 0;
  let deletedFromAuth = 0;
  let notFound = 0;

  for (const email of TEST_EMAILS) {
    // Verificar se é email de produção
    if (PRODUCTION_EMAILS.includes(email)) {
      console.log(`⚠️  Pulando email de produção: ${email}`);
      continue;
    }

    try {
      // 1. Deletar da tabela users
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, email, nome')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error(`❌ Erro ao buscar usuário ${email}:`, userError.message);
        continue;
      }

      if (userData) {
        const { error: deleteError } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('email', email);

        if (deleteError) {
          console.error(`❌ Erro ao deletar da tabela users: ${email}`, deleteError.message);
        } else {
          console.log(`✅ Deletado da tabela users: ${email} (${userData.nome || 'Sem nome'})`);
          deletedFromUsers++;
        }
      } else {
        console.log(`ℹ️  Usuário não encontrado na tabela users: ${email}`);
        notFound++;
      }

      // 2. Deletar do Supabase Auth
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

      if (authError) {
        console.error(`❌ Erro ao listar usuários do Auth:`, authError.message);
        continue;
      }

      const authUser = authUsers.users.find((u) => u.email === email);

      if (authUser) {
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);

        if (deleteAuthError) {
          console.error(`❌ Erro ao deletar do Auth: ${email}`, deleteAuthError.message);
        } else {
          console.log(`✅ Deletado do Supabase Auth: ${email}`);
          deletedFromAuth++;
        }
      } else {
        console.log(`ℹ️  Usuário não encontrado no Supabase Auth: ${email}`);
      }
    } catch (error) {
      console.error(`❌ Erro inesperado ao processar ${email}:`, error);
    }

    console.log(''); // Linha em branco para separar
  }

  // Resumo
  console.log('='.repeat(50));
  console.log('📊 RESUMO:');
  console.log(`✅ Deletados da tabela users: ${deletedFromUsers}`);
  console.log(`✅ Deletados do Supabase Auth: ${deletedFromAuth}`);
  console.log(`ℹ️  Não encontrados: ${notFound}`);
  console.log('='.repeat(50));

  // Listar usuários restantes
  console.log('\n👥 Usuários restantes na tabela users:');
  const { data: remainingUsers, error: listError } = await supabaseAdmin
    .from('users')
    .select('id, email, nome, role, ativo, created_at')
    .order('created_at', { ascending: false });

  if (listError) {
    console.error('❌ Erro ao listar usuários restantes:', listError.message);
  } else {
    if (remainingUsers && remainingUsers.length > 0) {
      remainingUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.nome || 'Sem nome'}) - ${user.role} - ${user.ativo ? 'Ativo' : 'Inativo'}`);
      });
    } else {
      console.log('  (Nenhum usuário encontrado)');
    }
  }
}

// Executar script
deleteTestUsers()
  .then(() => {
    console.log('\n✅ Script concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error);
    process.exit(1);
  });

