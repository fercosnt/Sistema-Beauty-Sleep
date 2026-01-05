/**
 * Script para Invocar a Edge Function sync-biologix Manualmente
 * 
 * Este script faz uma requisição HTTP direta para a Edge Function
 * para testar a sincronização sem esperar o cron job
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no .env.local');
  process.exit(1);
}

async function invokeSyncBiologix() {
  console.log('🚀 Invocando Edge Function sync-biologix...\n');
  console.log('='.repeat(60));
  console.log('');

  const functionUrl = `${supabaseUrl}/functions/v1/sync-biologix`;

  try {
    console.log(`📡 Fazendo requisição para: ${functionUrl}`);
    console.log('');

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ time: new Date().toISOString() }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('');

    // Ler resposta como texto primeiro
    const responseText = await response.text();
    
    let data: any = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      console.log('⚠️  Resposta não é JSON válido. Resposta recebida:');
      console.log(responseText || '(resposta vazia)');
      console.log('');
      
      if (response.ok) {
        console.log('✅ Status HTTP OK, mas resposta não é JSON.');
        console.log('   Isso pode indicar que a função está processando em background.');
        console.log('   Verifique os logs da Edge Function para mais detalhes.');
      } else {
        console.log('❌ Erro na requisição. Verifique:');
        console.log('   1. Se a Edge Function está deployada');
        console.log('   2. Se os secrets estão configurados');
        console.log('   3. Os logs da Edge Function');
      }
      console.log('');
      return;
    }

    if (response.ok) {
      console.log('✅ Sincronização executada com sucesso!');
      console.log('');
      console.log('📊 Resultado:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');

      if (data && data.success !== undefined) {
        console.log(`   - Total de exames: ${data.total || 'N/A'}`);
        console.log(`   - Processados: ${data.processed || 'N/A'}`);
        console.log(`   - Criados: ${data.created || 'N/A'}`);
        console.log(`   - Atualizados: ${data.updated || 'N/A'}`);
        console.log(`   - Erros: ${data.errors || 0}`);
        console.log('');
        
        if (data.errorDetails && data.errorDetails.length > 0) {
          console.log('⚠️  Detalhes de erros:');
          data.errorDetails.forEach((err: string, idx: number) => {
            console.log(`   ${idx + 1}. ${err}`);
          });
          console.log('');
        }
      }
    } else {
      console.log('❌ Erro na sincronização:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');
    }

    // Verificar exames sincronizados recentemente
    console.log('🔍 Verificando exames sincronizados recentemente...');
    console.log('   Execute no SQL Editor:');
    console.log('');
    console.log('   SELECT');
    console.log('     e.id,');
    console.log('     e.biologix_exam_id,');
    console.log('     e.data_exame,');
    console.log('     p.nome as paciente_nome,');
    console.log('     e.created_at');
    console.log('   FROM exames e');
    console.log('   JOIN pacientes p ON e.paciente_id = p.id');
    console.log('   WHERE e.created_at > NOW() - INTERVAL \'5 minutes\'');
    console.log('   ORDER BY e.created_at DESC');
    console.log('   LIMIT 10;');
    console.log('');

  } catch (error: any) {
    console.error('❌ Erro ao invocar Edge Function:');
    console.error(error.message);
    console.log('');
    console.log('💡 Alternativas:');
    console.log('');
    console.log('   1. Execute via SQL (RECOMENDADO):');
    console.log('      Abra: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new');
    console.log('      Execute:');
    console.log('      SELECT cron.run_job((SELECT jobid FROM cron.job WHERE jobname = \'sync-biologix-daily\'));');
    console.log('');
    console.log('   2. Verifique os logs da Edge Function:');
    console.log('      https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs');
    console.log('');
    console.log('   3. Verifique se a Edge Function está deployada:');
    console.log('      https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions');
    console.log('');
    console.log('   4. Verifique se os secrets estão configurados:');
    console.log('      Dashboard → Edge Functions → sync-biologix → Settings → Secrets');
    console.log('      Secrets necessários: BIOLOGIX_USERNAME, BIOLOGIX_PASSWORD, BIOLOGIX_SOURCE, BIOLOGIX_PARTNER_ID');
    console.log('');
    process.exit(1);
  }
}

invokeSyncBiologix().catch(console.error);

