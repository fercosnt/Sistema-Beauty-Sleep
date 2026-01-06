/**
 * Script de Monitoramento: Execução do Cron Job sync-biologix-daily
 * 
 * Este script permite:
 * 1. Verificar o status do cron job
 * 2. Ver últimas execuções
 * 3. Testar manualmente a execução
 * 4. Verificar respostas HTTP
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
  console.log('📊 Monitoramento: Cron Job sync-biologix-daily\n');
  console.log('='.repeat(60));
  console.log('');

  // 1. Status do Cron Job
  console.log('📅 1. Status do Cron Job');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT');
  console.log('     jobid,');
  console.log('     jobname,');
  console.log('     schedule,');
  console.log('     active,');
  console.log('     CASE');
  console.log('       WHEN command LIKE \'%public.net_http_post%\' THEN \'✅ Corrigido\'');
  console.log('       WHEN command LIKE \'%extensions.net.http_post%\' THEN \'❌ Com problema\'');
  console.log('       ELSE \'⚠️ Verificar\'');
  console.log('     END as status');
  console.log('   FROM cron.job');
  console.log('   WHERE jobname = \'sync-biologix-daily\';');
  console.log('');

  // 2. Últimas Execuções
  console.log('🕐 2. Últimas Execuções');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT');
  console.log('     runid,');
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
  console.log('   Status esperado:');
  console.log('   - ✅ succeeded = Executado com sucesso');
  console.log('   - ❌ failed = Falhou (ver return_message)');
  console.log('   - ⏳ running = Em execução');
  console.log('');

  // 3. Respostas HTTP Recentes
  console.log('🌐 3. Respostas HTTP Recentes (últimas 24h)');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT');
  console.log('     id,');
  console.log('     status_code,');
  console.log('     error_msg,');
  console.log('     timed_out,');
  console.log('     created');
  console.log('   FROM extensions.net._http_response');
  console.log('   WHERE created > NOW() - INTERVAL \'24 hours\'');
  console.log('   ORDER BY created DESC');
  console.log('   LIMIT 5;');
  console.log('');
  console.log('   Status codes esperados:');
  console.log('   - 200 = ✅ Sucesso');
  console.log('   - 500 = ❌ Erro na Edge Function');
  console.log('   - timeout = ⏱️ Timeout (verificar timeout_milliseconds)');
  console.log('');

  // 4. Testar Manualmente
  console.log('🧪 4. Testar Execução Manual');
  console.log('   Opção A - Executar via cron.run_job:');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT cron.run_job(');
  console.log('     (SELECT jobid FROM cron.job WHERE jobname = \'sync-biologix-daily\')');
  console.log('   );');
  console.log('');
  console.log('   Opção B - Invocar Edge Function diretamente:');
  console.log('   Execute no terminal:');
  console.log('');
  console.log('   npx supabase functions invoke sync-biologix');
  console.log('');

  // 5. Verificar Exames Sincronizados
  console.log('📊 5. Verificar Exames Sincronizados');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT');
  console.log('     COUNT(*) as total_exames,');
  console.log('     COUNT(DISTINCT paciente_id) as total_pacientes,');
  console.log('     MAX(data_exame) as ultimo_exame,');
  console.log('     MAX(created_at) as ultima_sincronizacao');
  console.log('   FROM exames;');
  console.log('');

  // 6. Verificar Exames Recentes
  console.log('📋 6. Exames Sincronizados Recentemente (últimas 24h)');
  console.log('   Execute no SQL Editor:');
  console.log('');
  console.log('   SELECT');
  console.log('     e.id,');
  console.log('     e.biologix_exam_id,');
  console.log('     e.data_exame,');
  console.log('     e.tipo,');
  console.log('     p.nome as paciente_nome,');
  console.log('     e.created_at');
  console.log('   FROM exames e');
  console.log('   JOIN pacientes p ON e.paciente_id = p.id');
  console.log('   WHERE e.created_at > NOW() - INTERVAL \'24 hours\'');
  console.log('   ORDER BY e.created_at DESC');
  console.log('   LIMIT 10;');
  console.log('');

  console.log('='.repeat(60));
  console.log('');
  console.log('📚 Links Úteis:');
  console.log('   - SQL Editor: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new');
  console.log('   - Logs Edge Function: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs');
  console.log('   - Settings Edge Function: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix');
  console.log('');
  console.log('💡 Dica: Execute os comandos SQL acima para monitorar a execução do cron job.');
  console.log('   A próxima execução automática será às 10h BRT (13h UTC) do dia seguinte.');
  console.log('');
}

main().catch(console.error);

