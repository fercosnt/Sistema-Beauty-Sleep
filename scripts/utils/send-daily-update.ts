#!/usr/bin/env tsx
/**
 * Script para Enviar Atualização Diária de Migração
 * 
 * Este script gera uma mensagem de atualização diária sobre o progresso da migração.
 * Pode ser executado manualmente ou via cron job.
 * 
 * Uso:
 *   tsx scripts/send-daily-update.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Load environment variables
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config()
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function generateDailyUpdate() {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1)
    const ontemStr = ontem.toISOString().split('T')[0]

    // Buscar sessões de hoje
    const { count: sessoesHoje, error: errorHoje } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${hoje}T00:00:00`)
      .lt('created_at', `${hoje}T23:59:59`)

    if (errorHoje) {
      console.error('Erro ao buscar sessões de hoje:', errorHoje)
      return
    }

    // Buscar sessões de ontem (para comparação)
    const { count: sessoesOntem, error: errorOntem } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${ontemStr}T00:00:00`)
      .lt('created_at', `${ontemStr}T23:59:59`)

    if (errorOntem) {
      console.error('Erro ao buscar sessões de ontem:', errorOntem)
      return
    }

    // Buscar total de sessões registradas
    const { count: totalRegistrado, error: errorTotal } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })

    if (errorTotal) {
      console.error('Erro ao buscar total:', errorTotal)
      return
    }

    // Buscar total esperado
    const { data: pacientesData } = await supabase
      .from('pacientes')
      .select('sessoes_compradas')
      .in('status', ['ativo', 'finalizado'])

    const totalEsperado =
      pacientesData?.reduce((sum, p) => sum + (p.sessoes_compradas || 0), 0) || 0
    const sessoesRestantes = Math.max(0, totalEsperado - (totalRegistrado || 0))
    const percentualCompleto =
      totalEsperado > 0 ? ((totalRegistrado || 0) / totalEsperado) * 100 : 0

    // Buscar top 3 do dia
    const { data: sessoesHojeData } = await supabase
      .from('sessoes')
      .select('user_id')
      .gte('created_at', `${hoje}T00:00:00`)
      .lt('created_at', `${hoje}T23:59:59`)

    const contagemPorUsuario: Record<string, number> = {}
    sessoesHojeData?.forEach((s) => {
      if (s.user_id) {
        contagemPorUsuario[s.user_id] = (contagemPorUsuario[s.user_id] || 0) + 1
      }
    })

    const top3Ids = Object.entries(contagemPorUsuario)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id)

    const { data: top3Users } = await supabase
      .from('users')
      .select('nome')
      .in('id', top3Ids)

    // Gerar mensagem
    const variacao = (sessoesHoje || 0) - (sessoesOntem || 0)
    const variacaoTexto = variacao > 0 ? `+${variacao}` : variacao.toString()

    let mensagem = `📊 Atualização Diária - Migração de Sessões\n\n`
    mensagem += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`
    mensagem += `📈 Progresso:\n`
    mensagem += `   • Sessões registradas hoje: ${sessoesHoje || 0} ${variacao !== 0 ? `(${variacaoTexto} vs ontem)` : ''}\n`
    mensagem += `   • Total registrado: ${totalRegistrado || 0}\n`
    mensagem += `   • Total esperado: ${totalEsperado}\n`
    mensagem += `   • Sessões restantes: ${sessoesRestantes}\n`
    mensagem += `   • Percentual completo: ${percentualCompleto.toFixed(1)}%\n\n`

    if (top3Users && top3Users.length > 0) {
      mensagem += `🏆 Top 3 de Hoje:\n`
      top3Users.forEach((user, index) => {
        const count = contagemPorUsuario[top3Ids[index]] || 0
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
        mensagem += `   ${medal} ${user.nome}: ${count} sessões\n`
      })
      mensagem += `\n`
    }

    // Mensagem de marco
    if (percentualCompleto >= 100) {
      mensagem += `🎉🎊🎉 MIGRAÇÃO 100% COMPLETA! PARABÉNS A TODA A EQUIPE! 🎉🎊🎉\n`
    } else if (percentualCompleto >= 90) {
      mensagem += `🎊 90% Concluído! Quase lá! 🎊\n`
    } else if (percentualCompleto >= 75) {
      mensagem += `🎉 75% Concluído! Excelente progresso! 🎉\n`
    } else if (percentualCompleto >= 50) {
      mensagem += `🎉 50% Concluído! Metade do caminho! 🎉\n`
    } else if (percentualCompleto >= 25) {
      mensagem += `📈 25% Concluído! Continue assim! 📈\n`
    }

    console.log(mensagem)

    // Aqui você pode adicionar lógica para enviar via:
    // - Email
    // - Slack webhook
    // - WhatsApp API
    // - etc.

    return {
      sessoesHoje: sessoesHoje || 0,
      sessoesRestantes,
      percentualCompleto,
      mensagem,
    }
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return null
  }
}

generateDailyUpdate()
  .then((result) => {
    if (result) {
      console.log('\n✅ Atualização diária gerada com sucesso!')
      process.exit(0)
    } else {
      console.log('\n❌ Erro ao gerar atualização diária')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('Erro fatal:', error)
    process.exit(1)
  })

