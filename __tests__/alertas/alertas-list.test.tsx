/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import AlertasList from '@/app/alertas/components/AlertasList'

// Mock do Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null })),
    },
  })),
}))

// Mock do toast
jest.mock('@/components/ui/Toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}))

describe('AlertasList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve exibir loading state inicialmente', () => {
    render(<AlertasList />)
    expect(screen.getByText('Carregando alertas...')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não há alertas', async () => {
    const { createClient } = require('@/lib/supabase/client')
    createClient.mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })

    render(<AlertasList />)

    await waitFor(() => {
      expect(screen.getByText('Nenhum alerta encontrado')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deve exibir lista de alertas quando há dados', async () => {
    const mockAlertas = [
      {
        id: '1',
        tipo: 'critico',
        urgencia: 'alta',
        titulo: 'IDO Acentuado',
        mensagem: 'Paciente com IDO acima de 30 eventos/hora',
        status: 'pendente',
        paciente_id: 'paciente-1',
        exame_id: 'exame-1',
        created_at: new Date().toISOString(),
        pacientes: [{ id: 'paciente-1', nome: 'João Silva' }],
      },
    ]

    const { createClient } = require('@/lib/supabase/client')
    createClient.mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockAlertas, error: null })),
        })),
      })),
    })

    render(<AlertasList />)

    await waitFor(() => {
      expect(screen.getByText('IDO Acentuado')).toBeInTheDocument()
      expect(screen.getByText('Paciente com IDO acima de 30 eventos/hora')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deve exibir erro quando falha ao buscar alertas', async () => {
    const { showError } = require('@/components/ui/Toast')
    const { createClient } = require('@/lib/supabase/client')
    
    createClient.mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Erro ao buscar' } })),
        })),
      })),
    })

    render(<AlertasList />)

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Erro ao carregar alertas')
    }, { timeout: 3000 })
  })
})

