#!/usr/bin/env tsx
/**
 * Script para testar geração de alertas de manutenção via cron
 * 
 * Este script simula a execução da função check-alerts que seria
 * executada via cron job para gerar alertas de manutenção.
 * 
 * Uso: npx tsx scripts/test-alertas-manutencao.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n💡 Verifique se o arquivo .env.local existe e contém essas variáveis.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function existeAlertaPendente(
  tipo: 'critico' | 'manutencao' | 'followup',
  pacienteId?: string
): Promise<boolean> {
  try {
    let query = supabase
      .from('alertas')
      .select('id')
      .eq('tipo', tipo)
      .eq('status', 'pendente')

    if (pacienteId) {
      query = query.eq('paciente_id', pacienteId)
    }

    const { data, error } = await query.limit(1)

    if (error) {
      return false
    }

    return data && data.length > 0
  } catch (error) {
    return false
  }
}

async function criarAlerta(
  tipo: 'critico' | 'manutencao' | 'followup',
  pacienteId: string | undefined,
  dados: {
    titulo: string
    mensagem: string
    urgencia: 'alta' | 'media' | 'baixa'
    dados_extras?: Record<string, any>
  }
): Promise<string | null> {
  try {
    const alertaData = {
      tipo,
      urgencia: dados.urgencia,
      titulo: dados.titulo,
      mensagem: dados.mensagem,
      paciente_id: pacienteId,
      exame_id: null,
      dados_extras: dados.dados_extras || {},
      status: 'pendente',
    }

    const { data, error } = await supabase
      .from('alertas')
      .insert(alertaData)
      .select('id')
      .single()

    if (error) {
      console.error(`Erro ao criar alerta ${tipo}:`, error.message)
      return null
    }

    return data.id
  } catch (error) {
    console.error(`Erro inesperado ao criar alerta ${tipo}:`, error)
    return null
  }
}

async function testarAlertasManutencao() {
  console.log('🔧 Testando geração de alertas de manutenção...\n')

  const hoje = new Date()
  const hojeStr = hoje.toISOString().split('T')[0]
  const hojeMenos7 = new Date(hoje)
  hojeMenos7.setDate(hoje.getDate() - 7)
  const hojeMenos7Str = hojeMenos7.toISOString().split('T')[0]
  const hojeMenos30 = new Date(hoje)
  hojeMenos30.setDate(hoje.getDate() - 30)
  const hojeMenos30Str = hojeMenos30.toISOString().split('T')[0]
  const hojeMais7 = new Date(hoje)
  hojeMais7.setDate(hoje.getDate() + 7)
  const hojeMais7Str = hojeMais7.toISOString().split('T')[0]
  const seisMesesAtras = new Date(hoje)
  seisMesesAtras.setMonth(hoje.getMonth() - 6)
  const seisMesesAtrasStr = seisMesesAtras.toISOString().split('T')[0]

  let alertasCriados = 0
  const erros: string[] = []

  // 1. Manutenção em 7 dias
  console.log('🔍 Verificando manutenções em 7 dias...')
  try {
    const { data: manutencoes7dias, error } = await supabase
      .from('pacientes')
      .select('id, nome, proxima_manutencao')
      .eq('status', 'ativo')
      .not('proxima_manutencao', 'is', null)
      .gte('proxima_manutencao', hojeStr)
      .lte('proxima_manutencao', hojeMais7Str)

    if (error) {
      throw error
    }

    if (manutencoes7dias && manutencoes7dias.length > 0) {
      for (const paciente of manutencoes7dias) {
        const jaExiste = await existeAlertaPendente('manutencao', paciente.id)

        if (!jaExiste) {
          const id = await criarAlerta('manutencao', paciente.id, {
            titulo: 'Manutenção Prevista em 7 Dias',
            mensagem: `Paciente ${paciente.nome} tem manutenção prevista para ${paciente.proxima_manutencao}. Preparar agendamento.`,
            urgencia: 'media',
            dados_extras: {
              tipo_verificacao: 'manutencao_7_dias',
              proxima_manutencao: paciente.proxima_manutencao,
            },
          })
          if (id) alertasCriados++
        }
      }
      console.log(`✅ Manutenções em 7 dias: ${manutencoes7dias.length} pacientes encontrados`)
    } else {
      console.log('ℹ️  Nenhuma manutenção em 7 dias encontrada')
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    erros.push(`Erro na verificação de manutenção em 7 dias: ${errorMsg}`)
    console.error('❌ Erro:', errorMsg)
  }

  // 2. Manutenção atrasada
  console.log('\n🔍 Verificando manutenções atrasadas...')
  try {
    const { data: manutencoesAtrasadas, error } = await supabase
      .from('pacientes')
      .select('id, nome, proxima_manutencao')
      .eq('status', 'ativo')
      .not('proxima_manutencao', 'is', null)
      .lt('proxima_manutencao', hojeStr)
      .gte('proxima_manutencao', hojeMenos30Str)

    if (error) {
      throw error
    }

    if (manutencoesAtrasadas && manutencoesAtrasadas.length > 0) {
      for (const paciente of manutencoesAtrasadas) {
        const jaExiste = await existeAlertaPendente('manutencao', paciente.id)

        if (!jaExiste) {
          const id = await criarAlerta('manutencao', paciente.id, {
            titulo: 'Manutenção Atrasada',
            mensagem: `Paciente ${paciente.nome} tem manutenção atrasada desde ${paciente.proxima_manutencao}. Contatar urgentemente.`,
            urgencia: 'alta',
            dados_extras: {
              tipo_verificacao: 'manutencao_atrasada',
              proxima_manutencao: paciente.proxima_manutencao,
            },
          })
          if (id) alertasCriados++
        }
      }
      console.log(`✅ Manutenções atrasadas: ${manutencoesAtrasadas.length} pacientes encontrados`)
    } else {
      console.log('ℹ️  Nenhuma manutenção atrasada encontrada')
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    erros.push(`Erro na verificação de manutenção atrasada: ${errorMsg}`)
    console.error('❌ Erro:', errorMsg)
  }

  // 3. Paciente sem sessão (> 7 dias)
  console.log('\n🔍 Verificando pacientes sem sessão...')
  try {
    const { data: pacientesSemSessao, error } = await supabase
      .from('pacientes')
      .select('id, nome, created_at, sessoes_utilizadas')
      .eq('status', 'ativo')
      .eq('sessoes_utilizadas', 0)
      .lte('created_at', hojeMenos7Str)

    if (error) {
      throw error
    }

    if (pacientesSemSessao && pacientesSemSessao.length > 0) {
      for (const paciente of pacientesSemSessao) {
        const jaExiste = await existeAlertaPendente('followup', paciente.id)

        if (!jaExiste) {
          const id = await criarAlerta('followup', paciente.id, {
            titulo: 'Paciente Sem Sessão',
            mensagem: `Paciente ${paciente.nome} está ativo há mais de 7 dias mas ainda não realizou nenhuma sessão. Verificar situação.`,
            urgencia: 'media',
            dados_extras: {
              tipo_verificacao: 'paciente_sem_sessao',
              data_criacao: paciente.created_at,
              sessoes_utilizadas: paciente.sessoes_utilizadas,
            },
          })
          if (id) alertasCriados++
        }
      }
      console.log(`✅ Pacientes sem sessão: ${pacientesSemSessao.length} pacientes encontrados`)
    } else {
      console.log('ℹ️  Nenhum paciente sem sessão encontrado')
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    erros.push(`Erro na verificação de pacientes sem sessão: ${errorMsg}`)
    console.error('❌ Erro:', errorMsg)
  }

  // 4. Follow-up 6 meses após finalizado
  console.log('\n🔍 Verificando follow-up 6 meses...')
  try {
    const { data: pacientesFinalizados, error } = await supabase
      .from('pacientes')
      .select('id, nome, updated_at')
      .eq('status', 'finalizado')
      .lte('updated_at', seisMesesAtrasStr)

    if (error) {
      throw error
    }

    if (pacientesFinalizados && pacientesFinalizados.length > 0) {
      for (const paciente of pacientesFinalizados) {
        const jaExiste = await existeAlertaPendente('followup', paciente.id)

        if (!jaExiste) {
          const id = await criarAlerta('followup', paciente.id, {
            titulo: 'Follow-up Após 6 Meses',
            mensagem: `Paciente ${paciente.nome} finalizou tratamento há mais de 6 meses. Considerar contato para follow-up.`,
            urgencia: 'baixa',
            dados_extras: {
              tipo_verificacao: 'followup_6_meses',
              data_finalizado: paciente.updated_at,
            },
          })
          if (id) alertasCriados++
        }
      }
      console.log(`✅ Follow-up 6 meses: ${pacientesFinalizados.length} pacientes encontrados`)
    } else {
      console.log('ℹ️  Nenhum paciente para follow-up 6 meses encontrado')
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    erros.push(`Erro na verificação de follow-up 6 meses: ${errorMsg}`)
    console.error('❌ Erro:', errorMsg)
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO - TESTE DE ALERTAS DE MANUTENÇÃO')
  console.log('='.repeat(60))
  console.log(`✅ Alertas criados: ${alertasCriados}`)
  if (erros.length > 0) {
    console.log(`❌ Erros: ${erros.length}`)
    erros.forEach((e) => console.log(`   - ${e}`))
  }

  if (alertasCriados > 0) {
    console.log('\n🎉 Alertas de manutenção criados com sucesso!')
    console.log('💡 Acesse a página /alertas para visualizar os alertas.')
  } else {
    console.log('\nℹ️  Nenhum alerta de manutenção foi criado.')
    console.log('   Isso pode ser normal se não houver pacientes nas condições verificadas.')
  }
}

// Executar
testarAlertasManutencao()
  .then(() => {
    console.log('\n✅ Script concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })

