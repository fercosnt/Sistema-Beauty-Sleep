/**
 * Script para criar alertas de teste no banco de dados
 * 
 * Uso: npx tsx scripts/criar-alerta-teste.ts
 */

import 'dotenv/config'
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

async function criarAlertaTeste() {
  console.log('🔵 Criando alertas de teste...\n')

  // Buscar um paciente para associar aos alertas
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
    .select('id')
    .limit(1)

  const exameId = exames && exames.length > 0 ? exames[0].id : null

  // Alertas de teste
  const alertasTeste = [
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'IDO Acentuado',
      mensagem: `Paciente ${pacienteNome} apresenta IDO acima de 30 eventos/hora, indicando apneia acentuada.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        ido_valor: 35.5,
        categoria: 'acentuado',
        exame_data: new Date().toISOString(),
      },
    },
    {
      tipo: 'critico',
      urgencia: 'alta',
      titulo: 'SpO2 Crítico',
      mensagem: `Paciente ${pacienteNome} apresentou SpO2 mínima abaixo de 80% durante o exame.`,
      paciente_id: pacienteId,
      exame_id: exameId,
      status: 'pendente',
      dados_extras: {
        spo2_min: 78,
        exame_data: new Date().toISOString(),
      },
    },
    {
      tipo: 'manutencao',
      urgencia: 'media',
      titulo: 'Manutenção em 7 dias',
      mensagem: `Paciente ${pacienteNome} tem manutenção agendada para os próximos 7 dias.`,
      paciente_id: pacienteId,
      exame_id: null,
      status: 'pendente',
      dados_extras: {
        proxima_manutencao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      tipo: 'manutencao',
      urgencia: 'alta',
      titulo: 'Manutenção Atrasada',
      mensagem: `Paciente ${pacienteNome} está com manutenção atrasada há mais de 30 dias.`,
      paciente_id: pacienteId,
      exame_id: null,
      status: 'pendente',
      dados_extras: {
        proxima_manutencao: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      tipo: 'followup',
      urgencia: 'baixa',
      titulo: 'Follow-up 6 meses',
      mensagem: `Paciente ${pacienteNome} finalizou tratamento há mais de 6 meses. Considerar follow-up.`,
      paciente_id: pacienteId,
      exame_id: null,
      status: 'pendente',
      dados_extras: {
        data_finalizacao: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      tipo: 'followup',
      urgencia: 'media',
      titulo: 'Paciente sem sessão',
      mensagem: `Paciente ${pacienteNome} está ativo há mais de 7 dias mas não possui sessões registradas.`,
      paciente_id: pacienteId,
      exame_id: null,
      status: 'pendente',
      dados_extras: {
        dias_sem_sessao: 10,
      },
    },
  ]

  // Inserir alertas
  const resultados = []
  for (const alerta of alertasTeste) {
    const { data, error } = await supabase
      .from('alertas')
      .insert(alerta)
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro ao criar alerta "${alerta.titulo}":`, error.message)
      resultados.push({ sucesso: false, titulo: alerta.titulo, erro: error.message })
    } else {
      console.log(`✅ Alerta criado: "${alerta.titulo}" (${alerta.tipo}, ${alerta.urgencia})`)
      resultados.push({ sucesso: true, titulo: alerta.titulo, id: data.id })
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO')
  console.log('='.repeat(60))
  const sucessos = resultados.filter((r) => r.sucesso).length
  const falhas = resultados.filter((r) => !r.sucesso).length
  console.log(`✅ Sucessos: ${sucessos}`)
  console.log(`❌ Falhas: ${falhas}`)
  console.log(`📝 Total: ${resultados.length}`)

  if (sucessos > 0) {
    console.log('\n🎉 Alertas de teste criados com sucesso!')
    console.log('💡 Acesse a página /alertas para visualizar os alertas.')
  }

  if (falhas > 0) {
    console.log('\n⚠️  Alguns alertas não puderam ser criados:')
    resultados
      .filter((r) => !r.sucesso)
      .forEach((r) => {
        console.log(`   - ${r.titulo}: ${r.erro}`)
      })
  }
}

// Executar
criarAlertaTeste()
  .then(() => {
    console.log('\n✅ Script concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error)
    process.exit(1)
  })

