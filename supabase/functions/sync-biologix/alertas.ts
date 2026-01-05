/**
 * Utilitários para criação de alertas no sistema
 * Versão para Deno Edge Function
 */

export interface AlertaData {
  tipo: 'critico' | 'manutencao' | 'followup'
  urgencia: 'alta' | 'media' | 'baixa'
  titulo: string
  mensagem: string
  paciente_id?: string
  exame_id?: string
  status?: 'pendente' | 'resolvido' | 'ignorado'
  dados_extras?: Record<string, any>
}

/**
 * Cria um alerta crítico no banco de dados
 * @param supabase - Cliente Supabase com service role (bypassa RLS)
 * @param tipo - Tipo de alerta crítico
 * @param pacienteId - ID do paciente (opcional)
 * @param exameId - ID do exame (opcional)
 * @param dados - Dados do alerta (título, mensagem, urgência, dados extras)
 * @returns ID do alerta criado ou null em caso de erro
 */
export async function criarAlertaCritico(
  supabase: any,
  tipo: 'critico' | 'manutencao' | 'followup',
  pacienteId: string | undefined,
  exameId: string | undefined,
  dados: {
    titulo: string
    mensagem: string
    urgencia?: 'alta' | 'media' | 'baixa'
    dados_extras?: Record<string, any>
  }
): Promise<string | null> {
  try {
    const alertaData: AlertaData = {
      tipo,
      urgencia: dados.urgencia || 'alta',
      titulo: dados.titulo,
      mensagem: dados.mensagem,
      paciente_id: pacienteId,
      exame_id: exameId,
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

    console.log(`✅ Alerta ${tipo} criado: ${dados.titulo} (ID: ${data.id})`)
    return data.id
  } catch (error) {
    console.error(`Erro inesperado ao criar alerta ${tipo}:`, error)
    return null
  }
}

/**
 * Verifica se já existe um alerta pendente do mesmo tipo para o mesmo paciente/exame
 * @param supabase - Cliente Supabase
 * @param tipo - Tipo de alerta
 * @param pacienteId - ID do paciente (opcional)
 * @param exameId - ID do exame (opcional)
 * @returns true se existe alerta pendente, false caso contrário
 */
export async function existeAlertaPendente(
  supabase: any,
  tipo: 'critico' | 'manutencao' | 'followup',
  pacienteId?: string,
  exameId?: string
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

    if (exameId) {
      query = query.eq('exame_id', exameId)
    }

    const { data, error } = await query.limit(1)

    if (error) {
      console.error('Erro ao verificar alerta pendente:', error.message)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error('Erro inesperado ao verificar alerta pendente:', error)
    return false
  }
}

