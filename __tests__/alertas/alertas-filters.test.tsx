/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import AlertasFilters, { AlertasFiltersState } from '@/app/alertas/components/AlertasFilters'

describe('AlertasFilters', () => {
  const mockFilters: AlertasFiltersState = {
    tipo: [],
    urgencia: [],
    status: [],
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar todos os filtros', () => {
    render(<AlertasFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Urgência')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('deve exibir opções de tipo', () => {
    render(<AlertasFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Crítico')).toBeInTheDocument()
    expect(screen.getByText('Manutenção')).toBeInTheDocument()
    expect(screen.getByText('Follow-up')).toBeInTheDocument()
  })

  it('deve exibir opções de urgência', () => {
    render(<AlertasFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText('Média')).toBeInTheDocument()
    expect(screen.getByText('Baixa')).toBeInTheDocument()
  })

  it('deve exibir opções de status', () => {
    render(<AlertasFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.getByText('Resolvido')).toBeInTheDocument()
    expect(screen.getByText('Ignorado')).toBeInTheDocument()
  })

  it('deve adicionar filtro quando clicado', () => {
    render(<AlertasFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const botaoCritico = screen.getByText('Crítico')
    fireEvent.click(botaoCritico)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      tipo: ['critico'],
      urgencia: [],
      status: [],
    })
  })

  it('deve remover filtro quando clicado novamente', () => {
    const filtersComTipo: AlertasFiltersState = {
      tipo: ['critico'],
      urgencia: [],
      status: [],
    }

    render(<AlertasFilters filters={filtersComTipo} onFiltersChange={mockOnFiltersChange} />)

    const botaoCritico = screen.getByText('Crítico')
    fireEvent.click(botaoCritico)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      tipo: [],
      urgencia: [],
      status: [],
    })
  })

  it('deve exibir contador de filtros ativos', () => {
    const filtersAtivos: AlertasFiltersState = {
      tipo: ['critico', 'manutencao'],
      urgencia: ['alta'],
      status: ['pendente'],
    }

    render(<AlertasFilters filters={filtersAtivos} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('deve exibir botão "Limpar" quando há filtros ativos', () => {
    const filtersAtivos: AlertasFiltersState = {
      tipo: ['critico'],
      urgencia: [],
      status: [],
    }

    render(<AlertasFilters filters={filtersAtivos} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Limpar')).toBeInTheDocument()
  })

  it('deve limpar todos os filtros quando botão "Limpar" é clicado', () => {
    const filtersAtivos: AlertasFiltersState = {
      tipo: ['critico', 'manutencao'],
      urgencia: ['alta'],
      status: ['pendente'],
    }

    render(<AlertasFilters filters={filtersAtivos} onFiltersChange={mockOnFiltersChange} />)

    const botaoLimpar = screen.getByText('Limpar')
    fireEvent.click(botaoLimpar)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      tipo: [],
      urgencia: [],
      status: [],
    })
  })
})

