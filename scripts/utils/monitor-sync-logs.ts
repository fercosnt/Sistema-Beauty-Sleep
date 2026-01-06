#!/usr/bin/env tsx
/**
 * Script para Monitorar Logs da Sincronização Biologix
 * 
 * Este script verifica:
 * - Última execução do cron job
 * - Respostas HTTP recentes
 * - Estatísticas de exames sincronizados
 * - Erros e avisos
 * 
 * Uso:
 *   npx tsx scripts/monitor-sync-logs.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment variables
const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ Arquivo .env.local não encontrado!');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SyncStats {
  total: number;
  processed: number;
  created: number;
  updated: number;
  errors: number;
  timestamp: string;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
}

async function monitorSyncLogs() {
  console.log('🔍 Monitorando Logs da Sincronização Biologix\n');
  console.log('='.repeat(60));
  console.log('');

  // 1. Verificar última resposta HTTP
  console.log('📡 1. Última Execução da Edge Function...');
  try {
    const { data: lastResponse, error } = await supabase
      .from('net._http_response')
      .select('*')
      .order('created', { ascending: false })
      .limit(1)
      .single();

    if (error || !lastResponse) {
      console.log('   ⚠️  Nenhuma execução encontrada ainda.\n');
    } else {
      const content = typeof lastResponse.content === 'string' 
        ? JSON.parse(lastResponse.content) 
        : lastResponse.content;

      console.log(`   📅 Data/Hora: ${formatTime(lastResponse.created)}`);
      console.log(`   ⏰ ${getTimeAgo(lastResponse.created)}`);
      console.log(`   📊 Status: ${lastResponse.status_code} ${lastResponse.status_code === 200 ? '✅' : '❌'}`);
      
      if (content && typeof content === 'object') {
        if (content.success !== undefined) {
          console.log(`   ✅ Sucesso: ${content.success ? 'SIM' : 'NÃO'}`);
        }
        if (content.total !== undefined) {
          console.log(`   📋 Total encontrado: ${content.total} exames`);
        }
        if (content.processed !== undefined) {
          console.log(`   🔄 Processados: ${content.processed} exames`);
        }
        if (content.created !== undefined) {
          console.log(`   ➕ Criados: ${content.created} exames novos`);
        }
        if (content.updated !== undefined) {
          console.log(`   🔄 Atualizados: ${content.updated} exames existentes`);
        }
        if (content.errors !== undefined && content.errors > 0) {
          console.log(`   ⚠️  Erros: ${content.errors}`);
          if (content.errorDetails && Array.isArray(content.errorDetails)) {
            console.log(`   📝 Detalhes dos erros:`);
            content.errorDetails.slice(0, 3).forEach((err: string, i: number) => {
              console.log(`      ${i + 1}. ${err.substring(0, 100)}${err.length > 100 ? '...' : ''}`);
            });
          }
        }
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Erro ao buscar última execução: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // 2. Verificar últimas 5 execuções
  console.log('📊 2. Últimas 5 Execuções...');
  try {
    const { data: recentResponses, error } = await supabase
      .from('net._http_response')
      .select('*')
      .order('created', { ascending: false })
      .limit(5);

    if (error || !recentResponses || recentResponses.length === 0) {
      console.log('   ⚠️  Nenhuma execução encontrada.\n');
    } else {
      console.log(`   Encontradas ${recentResponses.length} execuções recentes:\n`);
      
      recentResponses.forEach((resp: any, index: number) => {
        const content = typeof resp.content === 'string' 
          ? JSON.parse(resp.content) 
          : resp.content;
        
        console.log(`   ${index + 1}. ${formatTime(resp.created)}`);
        console.log(`      Status: ${resp.status_code} ${resp.status_code === 200 ? '✅' : '❌'}`);
        
        if (content && typeof content === 'object') {
          if (content.processed !== undefined) {
            console.log(`      Processados: ${content.processed}/${content.total || 'N/A'}`);
          }
          if (content.errors !== undefined && content.errors > 0) {
            console.log(`      ⚠️  Erros: ${content.errors}`);
          }
        }
        console.log('');
      });
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // 3. Estatísticas de Exames
  console.log('📈 3. Estatísticas de Exames Sincronizados...');
  try {
    const { data: examesStats, error } = await supabase
      .from('exames')
      .select('created_at, biologix_exam_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(`   ❌ Erro: ${error.message}\n`);
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

      console.log(`   📊 Total de exames: ${total.toLocaleString('pt-BR')}`);
      console.log(`   📅 Últimos 7 dias: ${ultimos7Dias.toLocaleString('pt-BR')}`);
      console.log(`   🕐 Últimas 24h: ${ultimas24h.toLocaleString('pt-BR')}`);
      if (ultimoExame) {
        console.log(`   ⏰ Último exame sincronizado: ${formatTime(ultimoExame.created_at)}`);
        console.log(`      (${getTimeAgo(ultimoExame.created_at)})`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // 4. Verificar Pacientes
  console.log('👥 4. Status dos Pacientes...');
  try {
    const { data: pacientesStats, error } = await supabase
      .from('pacientes')
      .select('biologix_id');

    if (error) {
      console.log(`   ❌ Erro: ${error.message}\n`);
    } else if (pacientesStats) {
      const total = pacientesStats.length;
      const comBiologixId = pacientesStats.filter((p: any) => p.biologix_id).length;
      const semBiologixId = total - comBiologixId;

      console.log(`   📊 Total: ${total.toLocaleString('pt-BR')}`);
      console.log(`   ✅ Com biologix_id: ${comBiologixId} (${((comBiologixId / total) * 100).toFixed(1)}%)`);
      
      if (semBiologixId > 0) {
        console.log(`   ⚠️  Sem biologix_id: ${semBiologixId}`);
      } else {
        console.log(`   ✅ Todos os pacientes têm biologix_id`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // 5. Próxima Execução
  console.log('⏰ 5. Próxima Execução Automática...');
  const agora = new Date();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  // Cron executa às 10h BRT (13h UTC)
  const horaCron = 10; // 10h BRT
  
  let proximaExecucao: Date;
  if (horaAtual < horaCron || (horaAtual === horaCron && minutoAtual < 0)) {
    // Ainda não executou hoje, será hoje
    proximaExecucao = new Date();
    proximaExecucao.setHours(horaCron, 0, 0, 0);
  } else {
    // Já executou hoje, será amanhã
    proximaExecucao = new Date();
    proximaExecucao.setDate(proximaExecucao.getDate() + 1);
    proximaExecucao.setHours(horaCron, 0, 0, 0);
  }
  
  const diffMs = proximaExecucao.getTime() - agora.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  
  console.log(`   📅 Próxima execução: ${proximaExecucao.toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} (10h BRT)`);
  
  if (diffHours > 0) {
    console.log(`   ⏳ Falta: ${diffHours}h ${diffMins}min`);
  } else {
    console.log(`   ⏳ Falta: ${diffMins}min`);
  }
  console.log('');

  // 6. Links Úteis
  console.log('🔗 6. Links Úteis...');
  console.log(`   📊 Dashboard: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions`);
  console.log(`   📋 Logs: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs`);
  console.log('');

  console.log('='.repeat(60));
  console.log('✅ Monitoramento completo!\n');
}

// Executar
monitorSyncLogs().catch(error => {
  console.error('❌ Erro ao executar monitoramento:', error);
  process.exit(1);
});

