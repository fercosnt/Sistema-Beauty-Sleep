/**
 * Script de Diagnóstico: Sincronização Automática de Exames
 * 
 * Este script verifica:
 * 1. Status do cron job sync-biologix-daily
 * 2. Últimas execuções do cron
 * 3. Secrets configurados no Vault
 * 4. Status da Edge Function
 * 5. Respostas HTTP recentes
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔍 Diagnóstico: Sincronização Automática de Exames\n');
  console.log('='.repeat(60));
  console.log('');

  // 1. Verificar Status do Cron Job
  console.log('📅 1. Verificando Status do Cron Job...');
  console.log('   Execute no SQL Editor do Supabase:');
  console.log('');
  console.log('   SELECT');
  console.log('     jobid,');
  console.log('     jobname,');
  console.log('     schedule,');
  console.log('     active,');
  console.log('     nodename,');
  console.log('     nodeport');
  console.log('   FROM cron.job');
  console.log('   WHERE jobname = \'sync-biologix-daily\';');
  console.log('');
  console.log('   ⚠️  Se active = false, reative com:');
  console.log('   SELECT cron.alter_job(');
  console.log('     job_id := (SELECT jobid FROM cron.job WHERE jobname = \'sync-biologix-daily\'),');
  console.log('     active := true');
  console.log('   );');
  console.log('');

  console.log('');

  // 2. Verificar Últimas Execuções
  console.log('🕐 2. Verificando Últimas Execuções do Cron...');
  console.log('   Execute no SQL Editor do Supabase:');
  console.log('');
  console.log('   SELECT');
  console.log('     runid,');
  console.log('     job_pid,');
  console.log('     status,');
  console.log('     return_message,');
  console.log('     start_time,');
  console.log('     end_time,');
  console.log('     (end_time - start_time) as duration');
  console.log('   FROM cron.job_run_details');
  console.log('   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = \'sync-biologix-daily\')');
  console.log('   ORDER BY start_time DESC');
  console.log('   LIMIT 10;');
  console.log('');
  console.log('   Status possíveis:');
  console.log('   - succeeded = ✅ Executado com sucesso');
  console.log('   - failed = ❌ Falhou (ver return_message)');
  console.log('   - running = ⏳ Em execução');
  console.log('');

  console.log('');

  // 3. Verificar Secrets no Vault
  console.log('🔐 3. Verificando Secrets no Vault...');
  console.log('   Execute no SQL Editor do Supabase:');
  console.log('');
  console.log('   SELECT name FROM vault.decrypted_secrets');
  console.log('   WHERE name IN (\'project_url\', \'anon_key\');');
  console.log('');
  console.log('   ⚠️  Se faltar algum secret, execute:');
  console.log('   npx tsx scripts/utils/setup-cron-secrets.ts');
  console.log('');
  console.log('   Ou configure manualmente:');
  console.log('   SELECT vault.create_secret(\'project_url\', \'https://seu-projeto.supabase.co\');');
  console.log('   SELECT vault.create_secret(\'anon_key\', \'sua-anon-key\');');
  console.log('');

  console.log('');

  // 4. Verificar Respostas HTTP Recentes
  console.log('🌐 4. Verificando Respostas HTTP Recentes...');
  console.log('   Execute no SQL Editor do Supabase:');
  console.log('');
  console.log('   SELECT');
  console.log('     id,');
  console.log('     status_code,');
  console.log('     content_type,');
  console.log('     timed_out,');
  console.log('     error_msg,');
  console.log('     created');
  console.log('   FROM extensions.net._http_response');
  console.log('   WHERE created > NOW() - INTERVAL \'24 hours\'');
  console.log('   ORDER BY created DESC');
  console.log('   LIMIT 5;');
  console.log('');
  console.log('   ⚠️  Se não houver resultados, tente sem o schema:');
  console.log('   SELECT * FROM net._http_response');
  console.log('   WHERE created > NOW() - INTERVAL \'24 hours\'');
  console.log('   ORDER BY created DESC LIMIT 5;');
  console.log('');

  console.log('');

  // 5. Verificar Extensões
  console.log('🔧 5. Verificando Extensões Necessárias...');
  console.log('   Execute no SQL Editor do Supabase:');
  console.log('');
  console.log('   SELECT extname FROM pg_extension');
  console.log('   WHERE extname IN (\'pg_cron\', \'pg_net\');');
  console.log('');
  console.log('   ⚠️  Se faltar alguma extensão, execute:');
  console.log('   CREATE EXTENSION IF NOT EXISTS pg_cron;');
  console.log('   CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;');
  console.log('');

  console.log('');
  console.log('='.repeat(60));
  console.log('');

  // Resumo e Próximos Passos
  console.log('📋 PRÓXIMOS PASSOS:');
  console.log('');
  console.log('1. Execute os comandos SQL acima no SQL Editor do Supabase');
  console.log('   https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new');
  console.log('');
  console.log('2. Verifique os logs da Edge Function:');
  console.log('   https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs');
  console.log('');
  console.log('3. Teste a sincronização manualmente:');
  console.log('   npx supabase functions invoke sync-biologix');
  console.log('');
  console.log('4. Verifique se os secrets da Biologix estão configurados:');
  console.log('   Dashboard → Edge Functions → sync-biologix → Settings → Secrets');
  console.log('   Secrets necessários:');
  console.log('   - BIOLOGIX_USERNAME');
  console.log('   - BIOLOGIX_PASSWORD');
  console.log('   - BIOLOGIX_SOURCE');
  console.log('   - BIOLOGIX_PARTNER_ID');
  console.log('');
  console.log('5. Se o cron job estiver inativo, reative com:');
  console.log('   SELECT cron.alter_job(');
  console.log('     job_id := (SELECT jobid FROM cron.job WHERE jobname = \'sync-biologix-daily\'),');
  console.log('     active := true');
  console.log('   );');
  console.log('');
  console.log('📚 Documentação:');
  console.log('   - docs/guias/CRON_JOB_MONITORAMENTO.md');
  console.log('   - docs/deploy/EXECUTAR_SINCRONIZACAO_MANUAL.md');
  console.log('');
}

main().catch(console.error);

