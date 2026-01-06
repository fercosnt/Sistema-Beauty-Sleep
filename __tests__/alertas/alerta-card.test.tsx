/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import AlertaCard from '@/app/alertas/components/AlertaCard'

const mockAlerta = {
  id: '1',
  tipo: 'critico' as const,
  urgencia: 'alta' as const,
  titulo: 'IDO Acentuado',
  mensagem: 'Paciente com IDO acima de 30 eventos/hora',
  status: 'pendente' as const,
  paciente_id: 'paciente-1',
  exame_id: 'exame-1',
  created_at: new Date().toISOString(),
  pacientes: { id: 'paciente-1', nome: 'João Silva' },
}

describe('AlertaCard', () => {
  const mockOnSelect = jest.fn()
  const mockOnMarkAsResolved = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar título e mensagem do alerta', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('IDO Acentuado')).toBeInTheDocument()
    expect(screen.getByText('Paciente com IDO acima de 30 eventos/hora')).toBeInTheDocument()
  })

  it('deve exibir nome do paciente quando disponível', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('deve exibir botão "Ver Paciente" quando há paciente_id', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('Ver Paciente')).toBeInTheDocument()
  })

  it('deve exibir botão "Marcar como Resolvido" para alertas pendentes', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('Marcar como Resolvido')).toBeInTheDocument()
  })

  it('não deve exibir botão "Marcar como Resolvido" para alertas resolvidos', () => {
    const alertaResolvido = {
      ...mockAlerta,
      status: 'resolvido' as const,
    }

    render(
      <AlertaCard
        alerta={alertaResolvido}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.queryByText('Marcar como Resolvido')).not.toBeInTheDocument()
  })

  it('deve exibir checkbox selecionado quando isSelected é true', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={true}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('deve chamar onSelect quando checkbox é clicado', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    checkbox.click()

    expect(mockOnSelect).toHaveBeenCalledWith('1')
  })

  it('deve exibir badge de status correto', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('deve exibir tipo de alerta correto', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('Crítico')).toBeInTheDocument()
  })

  it('deve exibir urgência correta', () => {
    render(
      <AlertaCard
        alerta={mockAlerta}
        isSelected={false}
        onSelect={mockOnSelect}
        onMarkAsResolved={mockOnMarkAsResolved}
      />
    )

    expect(screen.getByText('Alta')).toBeInTheDocument()
  })
})

