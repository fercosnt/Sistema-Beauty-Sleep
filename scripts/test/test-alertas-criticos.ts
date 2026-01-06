#!/usr/bin/env tsx
/**
 * Script para testar geração de alertas críticos via sync
 * 
 * Este script simula a criação de alertas críticos que seriam gerados
 * durante a sincronização de exames.
 * 
 * Uso: npx tsx scripts/test-alertas-criticos.ts
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

async function testarAlertasCriticos() {
  console.log('🔴 Testando geração de alertas críticos...\n')

  // Buscar um paciente e exame para associar aos alertas
  const { data: pacientes, error: pacientesError } = await supabase
    .from('pacientes')
    .select('id, nome')
    .limit(1)

  if (pacientesError || !pacientes || pacientes.length === 0) {
    console.error('❌ Erro ao buscar paciente:', pacientesError)
    console.log('⚠️  Criando alertas sem paciente_id...\n')
  }

  const pacienteId = pacientes && pacientes.length > 0 ? pacientes[0].id : null
  const pacienteNome = pacientes && pacientes.length > 0 ? pacientes[0].nome : 'N/A'

  // Buscar um exame para associar aos alertas críticos
  const { data: exames, error: examesError } = await supabase
    .from('exames')
    .select('id, tipo, ido, spo2_min, fibrilacao_atrial')
    .limit(1)

  const exameId = exames && exames.length > 0 ? exames[0].id : null

  // Alertas críticos de teste (simulando o que seria criado durante sync)
  const alertasCriticos = [
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'IDO Acentuado Detectado',
      mensagem: `Paciente ${pacienteNome} apresentou IDO acentuado (35.5 eventos/hora) no exame. Requer atenção imediata.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        ido: 35.5,
        ido_categoria: 3, // Acentuado
        tipo_exame: 'Sono',
      },
    },
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'SpO2 Crítico Detectado',
      mensagem: `Paciente ${pacienteNome} apresentou SpO2 mínimo crítico (78%) no exame. Requer atenção médica imediata.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        spo2_min: 78,
        spo2_avg: 85,
        spo2_max: 92,
        tipo_exame: 'Sono',
      },
    },
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'Fibrilação Atrial Detectada',
      mensagem: `Fibrilação atrial foi detectada no exame do paciente ${pacienteNome}. Requer avaliação cardiológica imediata.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        fibrilacao_atrial: 1,
        tipo_exame: 'Sono',
      },
    },
    {
      tipo: 'critico',
      urgencia: 'media',
      titulo: 'Piora Significativa de IDO',
      mensagem: `IDO piorou significativamente: de 12.5 para 18.3 eventos/hora (46.4% de aumento) para o paciente ${pacienteNome}.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        ido_anterior: 12.5,
        ido_atual: 18.3,
        aumento_percentual: 46.4,
        categoria_anterior: 1,
        categoria_atual: 2,
        tipo_exame: 'Sono',
      },
    },
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'Piora de Score de Ronco',
      mensagem: `Score de ronco piorou: de 2.5 para 4.8 (92% de aumento) para o paciente ${pacienteNome}.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        score_anterior: 2.5,
        score_atual: 4.8,
        aumento_percentual: 92,
        aumento_absoluto: 2.3,
        tipo_exame: 'Ronco',
      },
    },
    {
      tipo: 'critico',
      urgencia: 'media',
      titulo: 'Eficiência do Sono Baixa',
      mensagem: `Eficiência do sono está abaixo do ideal (68.5% < 75%) para o paciente ${pacienteNome}. Pode indicar problemas de qualidade do sono.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        eficiencia_sono_pct: 68.5,
        tempo_sono_seg: 24500,
        tipo_exame: 'Sono',
      },
    },
  ]

  // Inserir alertas
  const resultados = []
  for (const alerta of alertasCriticos) {
    const { data, error } = await supabase
      .from('alertas')
      .insert(alerta)
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro ao criar alerta "${alerta.titulo}":`, error.message)
      resultados.push({ sucesso: false, titulo: alerta.titulo, erro: error.message })
    } else {
      console.log(`✅ Alerta crítico criado: "${alerta.titulo}" (${alerta.urgencia})`)
      resultados.push({ sucesso: true, titulo: alerta.titulo, id: data.id })
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO - TESTE DE ALERTAS CRÍTICOS')
  console.log('='.repeat(60))
  const sucessos = resultados.filter((r) => r.sucesso).length
  const falhas = resultados.filter((r) => !r.sucesso).length
  console.log(`✅ Sucessos: ${sucessos}`)
  console.log(`❌ Falhas: ${falhas}`)
  console.log(`📝 Total: ${resultados.length}`)

  if (sucessos > 0) {
    console.log('\n🎉 Alertas críticos de teste criados com sucesso!')
    console.log('💡 Acesse a página /alertas para visualizar os alertas.')
    console.log('💡 Verifique o centro de notificações no header.')
  }

  if (falhas > 0) {
    console.log('\n⚠️  Alguns alertas não puderam ser criados:')
    resultados
      .filter((r) => !r.sucesso)
      .forEach((r) => {
        console.log(`   - ${r.titulo}: ${r.erro}`)
      })
  }

  // Verificar se alertas aparecem na query
  console.log('\n🔍 Verificando se alertas foram criados corretamente...')
  const { data: alertasCriados, error: errorVerificacao } = await supabase
    .from('alertas')
    .select('id, tipo, urgencia, titulo, status')
    .eq('tipo', 'critico')
    .eq('status', 'pendente')
    .order('created_at', { ascending: false })
    .limit(10)

  if (errorVerificacao) {
    console.error('❌ Erro ao verificar alertas:', errorVerificacao.message)
  } else {
    console.log(`✅ Encontrados ${alertasCriados?.length || 0} alertas críticos pendentes no banco`)
    if (alertasCriados && alertasCriados.length > 0) {
      console.log('\n📋 Últimos alertas críticos:')
      alertasCriados.forEach((a) => {
        console.log(`   - ${a.titulo} (${a.urgencia})`)
      })
    }
  }
}

// Executar
testarAlertasCriticos()
  .then(() => {
    console.log('\n✅ Script concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })

