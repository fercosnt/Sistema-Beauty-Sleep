/**
 * Script para testar a função de limpeza de alertas resolvidos
 * 
 * Este script:
 * 1. Cria alguns alertas de teste
 * 2. Marca alguns como resolvidos com datas antigas (mais de 3 dias)
 * 3. Testa a função cleanup_resolved_alerts()
 * 4. Verifica se os alertas antigos foram deletados
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n💡 Verifique se o arquivo .env.local existe e contém essas variáveis.')
  process.exit(1)
}

// Usar service role key para bypassar RLS e poder criar/deletar alertas
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testCleanup() {
  console.log('🧪 Testando limpeza de alertas resolvidos...\n')

  try {
    // 1. Buscar um paciente existente para criar alertas de teste
    const { data: pacientes, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nome')
      .limit(1)

    if (pacientesError || !pacientes || pacientes.length === 0) {
      console.error('❌ Erro ao buscar pacientes:', pacientesError)
      console.log('⚠️  Criando alertas sem paciente_id...')
    }

    const pacienteId = pacientes?.[0]?.id || null
    const pacienteNome = pacientes?.[0]?.nome || 'Teste'

    // 2. Criar alertas de teste com diferentes datas de resolução
    console.log('📝 Criando alertas de teste...')

    const alertasParaCriar = [
      {
        tipo: 'critico' as const,
        urgencia: 'alta' as const,
        titulo: 'Alerta para deletar (resolvido há 4 dias)',
        mensagem: 'Este alerta deve ser deletado pela função de limpeza',
        paciente_id: pacienteId,
        status: 'resolvido' as const,
        resolvido_em: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 dias atrás
        dados_extras: { teste: true, deve_ser_deletado: true }
      },
      {
        tipo: 'critico' as const,
        urgencia: 'media' as const,
        titulo: 'Alerta para deletar (resolvido há 5 dias)',
        mensagem: 'Este alerta também deve ser deletado',
        paciente_id: pacienteId,
        status: 'resolvido' as const,
        resolvido_em: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
        dados_extras: { teste: true, deve_ser_deletado: true }
      },
      {
        tipo: 'manutencao' as const,
        urgencia: 'baixa' as const,
        titulo: 'Alerta para manter (resolvido há 2 dias)',
        mensagem: 'Este alerta NÃO deve ser deletado (menos de 3 dias)',
        paciente_id: pacienteId,
        status: 'resolvido' as const,
        resolvido_em: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        dados_extras: { teste: true, deve_ser_mantido: true }
      },
      {
        tipo: 'followup' as const,
        urgencia: 'baixa' as const,
        titulo: 'Alerta pendente (não deve ser deletado)',
        mensagem: 'Este alerta está pendente e não deve ser deletado',
        paciente_id: pacienteId,
        status: 'pendente' as const,
        dados_extras: { teste: true, deve_ser_mantido: true }
      }
    ]

    const { data: alertasCriados, error: createError } = await supabase
      .from('alertas')
      .insert(alertasParaCriar)
      .select()

    if (createError) {
      console.error('❌ Erro ao criar alertas de teste:', createError)
      return
    }

    console.log(`✅ ${alertasCriados?.length || 0} alertas de teste criados\n`)

    // 3. Contar alertas antes da limpeza
    const { count: countAntes, error: countErrorAntes } = await supabase
      .from('alertas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolvido')

    console.log(`📊 Alertas resolvidos antes da limpeza: ${countAntes || 0}`)

    // 4. Executar função de limpeza
    console.log('🧹 Executando função de limpeza...')

    const { data: cleanupResult, error: cleanupError } = await supabase
      .rpc('cleanup_resolved_alerts')

    if (cleanupError) {
      console.error('❌ Erro ao executar função de limpeza:', cleanupError)
      console.log('\n💡 Dica: Certifique-se de que a migração 018 foi aplicada no Supabase')
      return
    }

    const deletedCount = cleanupResult?.[0]?.deleted_count || 0
    console.log(`✅ Função executada. Alertas deletados: ${deletedCount}\n`)

    // 5. Contar alertas depois da limpeza
    const { count: countDepois, error: countErrorDepois } = await supabase
      .from('alertas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolvido')

    console.log(`📊 Alertas resolvidos depois da limpeza: ${countDepois || 0}`)

    // 6. Verificar se os alertas de teste foram deletados corretamente
    const { data: alertasRestantes, error: restantesError } = await supabase
      .from('alertas')
      .select('id, titulo, status, resolvido_em, dados_extras')
      .or('dados_extras->>teste.eq.true')

    if (!restantesError && alertasRestantes) {
      console.log('\n📋 Alertas de teste restantes:')
      alertasRestantes.forEach(alerta => {
        const deveSerMantido = alerta.dados_extras?.deve_ser_mantido === true
        const deveSerDeletado = alerta.dados_extras?.deve_ser_deletado === true
        const status = deveSerMantido ? '✅ MANTIDO' : deveSerDeletado ? '❌ DEVERIA SER DELETADO' : '❓'
        console.log(`  ${status} - ${alerta.titulo} (${alerta.status})`)
      })
    }

    // 7. Limpar alertas de teste restantes
    console.log('\n🧹 Limpando alertas de teste restantes...')
    const { error: deleteError } = await supabase
      .from('alertas')
      .delete()
      .or('dados_extras->>teste.eq.true')

    if (deleteError) {
      console.error('⚠️  Erro ao limpar alertas de teste:', deleteError)
    } else {
      console.log('✅ Alertas de teste removidos\n')
    }

    // 8. Resumo
    console.log('📊 Resumo do teste:')
    console.log(`  - Alertas criados: ${alertasParaCriar.length}`)
    console.log(`  - Alertas deletados pela função: ${deletedCount}`)
    console.log(`  - Alertas resolvidos antes: ${countAntes || 0}`)
    console.log(`  - Alertas resolvidos depois: ${countDepois || 0}`)

    if (deletedCount >= 2) {
      console.log('\n✅ Teste PASSOU: A função está deletando alertas resolvidos há mais de 3 dias')
    } else {
      console.log('\n⚠️  Teste PARCIAL: A função pode não estar deletando corretamente')
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error)
  }
}

testCleanup()

