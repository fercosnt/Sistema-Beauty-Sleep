import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API Route para buscar paciente na API Biologix pelo CPF
 * 
 * Esta rota busca nos exames já sincronizados do Biologix para encontrar
 * o biologix_id (patientUserId) de um paciente pelo CPF.
 */
export async function POST(request: NextRequest) {
  try {
    const { cpf } = await request.json()

    if (!cpf || typeof cpf !== 'string') {
      return NextResponse.json(
        { error: 'CPF é obrigatório' },
        { status: 400 }
      )
    }

    // Limpar CPF (remover caracteres não numéricos)
    const cpfLimpo = cpf.replace(/\D/g, '')

    if (cpfLimpo.length !== 11) {
      return NextResponse.json(
        { error: 'CPF deve ter 11 dígitos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Buscar paciente na tabela pacientes pelo CPF
    // Se encontrar e tiver biologix_id, retornar
    const { data: paciente, error } = await supabase
      .from('pacientes')
      .select('biologix_id, nome')
      .eq('cpf', cpfLimpo)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar paciente:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar na base de dados' },
        { status: 500 }
      )
    }

    if (!paciente) {
      // Paciente não encontrado no banco de dados
      // Isso significa que ele não foi sincronizado ainda da API Biologix
      return NextResponse.json(
        { error: 'Paciente não encontrado. Ele pode não ter sido sincronizado da API Biologix ainda.', biologixId: null },
        { status: 404 }
      )
    }

    // Paciente encontrado
    if (paciente.biologix_id) {
      return NextResponse.json({
        success: true,
        biologixId: paciente.biologix_id,
        nome: paciente.nome,
        message: `Paciente encontrado: ${paciente.nome}`
      })
    } else {
      // Paciente existe mas não tem biologix_id
      return NextResponse.json(
        { error: 'Paciente encontrado mas sem ID do Biologix. Este paciente foi criado manualmente.', biologixId: null },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Erro inesperado ao buscar paciente:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao buscar paciente' },
      { status: 500 }
    )
  }
}

