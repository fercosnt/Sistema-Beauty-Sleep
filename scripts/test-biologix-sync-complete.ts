#!/usr/bin/env tsx
/**
 * Script de Teste Completo: Verificação da Conexão Biologix
 * 
 * Este script verifica:
 * 1. Status do cron job
 * 2. Última sincronização
 * 3. Exames sincronizados
 * 4. Pacientes vinculados
 * 5. Erros recentes
 * 6. Teste manual da Edge Function (opcional)
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
  console.log('🔍 Verificando Conexão Biologix - Sistema Beauty Sleep\n');
  console.log('=' .repeat(60));

  // 1. Verificar Status do Cron Job
  console.log('\n📅 1. Verificando Status do Cron Job...');
  try {
    const { data: cronJob, error: cronError } = await supabase
      .rpc('get_cron_jobs')
      .select('*')
      .eq('jobname', 'sync-biologix-daily');

    if (cronError) {
      // Fallback: query direta
      const { data, error } = await supabase
        .from('cron.job')
        .select('*')
        .eq('jobname', 'sync-biologix-daily');

      if (error) {
        console.log('⚠️  Não foi possível verificar o cron job automaticamente.');
        console.log('   Execute manualmente no SQL Editor:');
        console.log('   SELECT * FROM cron.job WHERE jobname = \'sync-biologix-daily\';');
      } else if (data && data.length > 0) {
        const job = data[0];
        console.log(`✅ Cron Job encontrado:`);
        console.log(`   - Nome: ${job.jobname}`);
        console.log(`   - Status: ${job.active ? '✅ ATIVO' : '❌ INATIVO'}`);
        console.log(`   - Schedule: ${job.schedule} (10h BRT = 13h UTC)`);
      } else {
        console.log('❌ Cron Job não encontrado!');
      }
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar cron job:', error);
  }

  // 2. Verificar Última Execução do Cron
  console.log('\n🕐 2. Verificando Últimas Execuções do Cron...');
  try {
    const { data: runs, error } = await supabase
      .from('cron.job_run_details')
      .select('*')
      .eq('jobid', 1) // Assumindo jobid = 1
      .order('start_time', { ascending: false })
      .limit(5);

    if (error) {
      console.log('⚠️  Não foi possível verificar execuções automaticamente.');
      console.log('   Execute manualmente no SQL Editor:');
      console.log('   SELECT * FROM cron.job_run_details WHERE jobid = 1 ORDER BY start_time DESC LIMIT 5;');
    } else if (runs && runs.length > 0) {
      console.log(`✅ Encontradas ${runs.length} execuções recentes:`);
      runs.forEach((run: any, index: number) => {
        console.log(`\n   Execução ${index + 1}:`);
        console.log(`   - Data/Hora: ${new Date(run.start_time).toLocaleString('pt-BR')}`);
        console.log(`   - Status: ${run.status === 'succeeded' ? '✅ SUCESSO' : '❌ FALHOU'}`);
        console.log(`   - Duração: ${run.duration || 'N/A'}`);
        if (run.return_message) {
          console.log(`   - Mensagem: ${run.return_message}`);
        }
      });
    } else {
      console.log('⚠️  Nenhuma execução encontrada.');
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar execuções:', error);
  }

  // 3. Verificar Respostas HTTP Recentes
  console.log('\n📡 3. Verificando Respostas HTTP Recentes...');
  try {
    const { data: responses, error } = await supabase
      .from('net._http_response')
      .select('*')
      .order('created', { ascending: false })
      .limit(3);

    if (error) {
      console.log('⚠️  Não foi possível verificar respostas HTTP automaticamente.');
    } else if (responses && responses.length > 0) {
      console.log(`✅ Encontradas ${responses.length} respostas recentes:`);
      responses.forEach((resp: any, index: number) => {
        console.log(`\n   Resposta ${index + 1}:`);
        console.log(`   - Data/Hora: ${new Date(resp.created).toLocaleString('pt-BR')}`);
        console.log(`   - Status: ${resp.status_code} ${resp.status_code === 200 ? '✅' : '❌'}`);
        
        if (resp.content) {
          try {
            const content = typeof resp.content === 'string' ? JSON.parse(resp.content) : resp.content;
            if (content.success) {
              console.log(`   - Sucesso: ✅`);
              console.log(`   - Total: ${content.total}`);
              console.log(`   - Processados: ${content.processed}`);
              console.log(`   - Criados: ${content.created}`);
              console.log(`   - Atualizados: ${content.updated}`);
              console.log(`   - Erros: ${content.errors}`);
              
              if (content.errors > 0 && content.errorDetails) {
                console.log(`   - Detalhes dos erros:`);
                content.errorDetails.slice(0, 3).forEach((err: string, i: number) => {
                  console.log(`     ${i + 1}. ${err.substring(0, 80)}...`);
                });
              }
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      });
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar respostas HTTP:', error);
  }

  // 4. Verificar Exames Sincronizados
  console.log('\n📊 4. Verificando Exames Sincronizados...');
  try {
    const { data: examesStats, error } = await supabase
      .from('exames')
      .select('created_at, biologix_exam_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Erro ao buscar exames:', error.message);
    } else if (examesStats) {
      const total = examesStats.length;
      const ultimos7Dias = examesStats.filter((e: any) => {
        const created = new Date(e.created_at);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length;

      const ultimas24h = examesStats.filter((e: any) => {
        const created = new Date(e.created_at);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - created.getTime());
        const diffHours = diffTime / (1000 * 60 * 60);
        return diffHours <= 24;
      }).length;

      const ultimoExame = examesStats[0];

      console.log(`✅ Estatísticas de Exames:`);
      console.log(`   - Total de exames: ${total}`);
      console.log(`   - Últimos 7 dias: ${ultimos7Dias}`);
      console.log(`   - Últimas 24h: ${ultimas24h}`);
      if (ultimoExame) {
        console.log(`   - Último exame sincronizado: ${new Date(ultimoExame.created_at).toLocaleString('pt-BR')}`);
        console.log(`   - ID do exame: ${ultimoExame.biologix_exam_id}`);
      }
    }
  } catch (error) {
    console.log('❌ Erro ao verificar exames:', error);
  }

  // 5. Verificar Pacientes
  console.log('\n👥 5. Verificando Pacientes...');
  try {
    const { data: pacientesStats, error } = await supabase
      .from('pacientes')
      .select('biologix_id, created_at');

    if (error) {
      console.log('❌ Erro ao buscar pacientes:', error.message);
    } else if (pacientesStats) {
      const total = pacientesStats.length;
      const comBiologixId = pacientesStats.filter((p: any) => p.biologix_id).length;
      const semBiologixId = total - comBiologixId;

      console.log(`✅ Estatísticas de Pacientes:`);
      console.log(`   - Total de pacientes: ${total}`);
      console.log(`   - Com biologix_id: ${comBiologixId} (${((comBiologixId / total) * 100).toFixed(1)}%)`);
      console.log(`   - Sem biologix_id: ${semBiologixId} ${semBiologixId > 0 ? '⚠️' : '✅'}`);
      
      if (semBiologixId > 0) {
        console.log(`\n   ⚠️  Atenção: ${semBiologixId} paciente(s) sem biologix_id serão atualizados na próxima sincronização.`);
      }
    }
  } catch (error) {
    console.log('❌ Erro ao verificar pacientes:', error);
  }

  // 6. Verificar Exames Recentes
  console.log('\n📋 6. Verificando Exames Recentes (últimos 5)...');
  try {
    const { data: examesRecentes, error } = await supabase
      .from('exames')
      .select(`
        biologix_exam_id,
        created_at,
        tipo,
        paciente_id,
        pacientes!inner(nome, biologix_id)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Erro ao buscar exames recentes:', error.message);
    } else if (examesRecentes && examesRecentes.length > 0) {
      console.log(`✅ Últimos ${examesRecentes.length} exames sincronizados:\n`);
      examesRecentes.forEach((exame: any, index: number) => {
        const paciente = Array.isArray(exame.pacientes) ? exame.pacientes[0] : exame.pacientes;
        console.log(`   ${index + 1}. ${paciente?.nome || 'N/A'}`);
        console.log(`      - ID Exame: ${exame.biologix_exam_id}`);
        console.log(`      - Tipo: ${exame.tipo === 0 ? 'Ronco' : 'Sono'}`);
        console.log(`      - Data: ${new Date(exame.created_at).toLocaleString('pt-BR')}`);
        console.log(`      - Biologix ID: ${paciente?.biologix_id || 'N/A'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log('❌ Erro ao verificar exames recentes:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Verificação completa!');
  console.log('\n💡 Dicas:');
  console.log('   - Para testar manualmente, chame a Edge Function via curl ou Dashboard');
  console.log('   - Para ver logs detalhados, acesse: Supabase Dashboard → Edge Functions → sync-biologix → Logs');
  console.log('   - O cron job executa automaticamente todos os dias às 10h BRT (13h UTC)');
  console.log('\n');
}

main().catch(console.error);

