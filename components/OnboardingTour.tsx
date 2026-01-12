'use client'

import { useEffect, useRef } from 'react'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { createClient } from '@/lib/supabase/client'

// Type declaration for Shepherd.js
type ShepherdTour = typeof Shepherd.Tour extends new (...args: any[]) => infer T ? T : any
type ShepherdStepOptions = any // Shepherd.Step.StepOptions type

interface OnboardingTourProps {
  role: 'admin' | 'equipe' | 'recepcao'
  tourCompleted: boolean
  userId?: string
}

export function OnboardingTour({ role, tourCompleted, userId }: OnboardingTourProps) {
  const tourRef = useRef<ShepherdTour | null>(null)

  useEffect(() => {
    // Only start tour if not completed
    if (tourCompleted) return

    // Não iniciar tour se já houver um tourFlow ativo (tour guiado em andamento)
    const urlParams = new URLSearchParams(window.location.search)
    const tourFlow = urlParams.get('tourFlow')
    const showNotifications = urlParams.get('showNotifications')
    if (tourFlow || showNotifications) {
      // Já estamos em um fluxo de tour guiado, não iniciar o tour inicial
      return
    }

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const steps = getTourSteps(role)
      
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          scrollTo: true,
          cancelIcon: { enabled: true },
          classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
          buttons: [
            {
              text: 'Pular Tour',
              action: () => {
                tour.cancel()
                markTourAsCompleted(userId)
              },
            },
          ],
        },
      })

      steps.forEach((step) => tour.addStep(step))

      // Save tour_completed when tour completes
      tour.on('complete', () => {
        markTourAsCompleted(userId)
      })

      // Save tour_completed when tour is cancelled
      tour.on('cancel', () => {
        markTourAsCompleted(userId)
      })

      tourRef.current = tour
      tour.start()
    }, 500) // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
      if (tourRef.current) {
        tourRef.current.complete()
      }
    }
  }, [role, tourCompleted, userId])

  return null
}

// Function to mark tour as completed
async function markTourAsCompleted(userId?: string) {
  if (!userId) return

  try {
    const supabase = createClient()
    await supabase
      .from('users')
      .update({ tour_completed: true })
      .eq('id', userId)
  } catch (error) {
    console.error('Erro ao salvar tour_completed:', error)
  }
}

// Function to start tour manually (for "Refazer Tour" button)
export function startTour(role: 'admin' | 'equipe' | 'recepcao') {
  // Garante que nunca existam dois tours ativos ao mesmo tempo
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps = getTourSteps(role)
  
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()
  
  return tour
}

// Tour da página Perfil (admin/equipe)
export function startPerfilTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'perfil-header',
      text: 'Aqui você vê suas informações de perfil, role e status de acesso. Você pode atualizar seu nome e alterar sua senha.',
      title: 'Seu Perfil',
      attachTo: {
        element: 'main',
        on: 'top',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'perfil-dados',
      text: 'Atualize seu nome e email aqui. O email é usado para login e notificações.',
      title: 'Dados Pessoais',
      attachTo: {
        element: '[data-tour="perfil-dados"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'perfil-senha',
      text: 'Altere sua senha aqui quando necessário. A senha deve ter pelo menos 6 caracteres e conter letras maiúsculas, minúsculas, números e caracteres especiais.',
      title: 'Alterar Senha',
      attachTo: {
        element: '[data-tour="perfil-senha"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Concluir Tour',
          action: function (this: any) {
            return this.complete()
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  
  // Salvar tour_completed quando o tour de perfil é concluído
  tour.on('complete', async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()
        if (userData?.id) {
          await supabase
            .from('users')
            .update({ tour_completed: true })
            .eq('id', userData.id)
        }
      }
    } catch (error) {
      console.error('Erro ao salvar tour_completed:', error)
    }
  })
  
  tour.start()

  return tour
}

// Tour da página Configurações (admin/equipe)
export function startConfigTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'config-profile',
      text: 'Aqui você vê e ajusta informações básicas do seu perfil (nome, email, função).',
      title: 'Perfil',
      attachTo: {
        // Card inteira de Perfil (primeira card de configurações)
        element: '.rounded-lg.border-2.border-gray-300.bg-white.shadow-sm.p-6:nth-of-type(1)',
        on: 'bottom',
      },
      popperOptions: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 40], // Afasta mais para baixo
            },
          },
        ],
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'config-tour',
      text: 'Use esta seção para refazer o tour guiado sempre que quiser revisar o sistema.',
      title: 'Tour Guiado',
      attachTo: {
        element: '.rounded-lg.border-2.border-gray-300.bg-white.shadow-sm.p-6:nth-of-type(2)',
        on: 'top',
      },
      popperOptions: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [80, -60], // Afasta para a direita e mais para cima
            },
          },
        ],
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Concluir Tour',
          action: function (this: any) {
            this.complete()
            window.location.href = '/dashboard'
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Tour da página Logs (admin)
export function startLogsTour(role: 'admin') {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'logs-filters',
      text: 'Aqui você filtra os logs por usuário, entidade, ação e período.',
      title: 'Filtros de Logs',
      attachTo: {
        element: '[data-tour="logs-filtros"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'logs-table',
      text: 'A tabela mostra todas as ações registradas no sistema. Você pode ver detalhes de cada log.',
      title: 'Tabela de Logs',
      attachTo: {
        element: '[data-tour="logs-tabela"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            this.complete()
            window.location.href = '/configuracoes?tourFlow=admin'
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-admin',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Tour da página Usuários (admin)
export function startUsuariosTour(role: 'admin') {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'users-list',
      text: 'Aqui você vê todos os usuários do sistema, com role, status e última atividade.',
      title: 'Lista de Usuários',
      attachTo: {
        element: '[data-tour="usuarios-header"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'users-new',
      text: 'Use o botão "Novo Usuário" para criar acessos para a equipe. Apenas Admin pode fazer isso.',
      title: 'Criar Usuário',
      attachTo: {
        element: '[data-tour="usuarios-novo"]',
        on: 'left',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            this.complete()
            window.location.href = '/logs?tourFlow=admin'
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-admin',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Tour específico para a página de Pacientes (chamado via query string ?tourFlow=admin|equipe)
export function startPacientesTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'patients-list',
      text: 'Esta é a lista de pacientes. Você pode buscar por nome ou CPF e ver o status atual de cada um.',
      title: 'Lista de Pacientes',
      attachTo: {
        element: '[data-tour="pacientes-tabela"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'new-patient',
      text: 'Use o botão "Novo Paciente" para pré-cadastrar um lead ou paciente (apenas Admin/Equipe).',
      title: 'Criar Paciente',
      attachTo: {
        element: '[data-tour="pacientes-novo"]',
        on: 'left',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: async function (this: any) {
            this.complete()
            // Buscar um paciente aleatório para mostrar os dashboards
            try {
              const supabase = createClient()
              const { data: pacientes, error } = await supabase
                .from('pacientes')
                .select('id')
                .limit(1)
                .order('created_at', { ascending: false })
              
              if (!error && pacientes && pacientes.length > 0) {
                const pacienteAleatorio = pacientes[0]
                window.location.href = `/pacientes/${pacienteAleatorio.id}?tourFlow=${flow}`
              } else {
                // Se não houver pacientes, ir para alertas
                window.location.href = `/alertas?tourFlow=${flow}`
              }
            } catch (err) {
              console.error('Erro ao buscar paciente:', err)
              window.location.href = `/alertas?tourFlow=${flow}`
            }
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Get tour steps based on role
function getTourSteps(role: 'admin' | 'equipe' | 'recepcao'): ShepherdStepOptions[] {
  if (role === 'admin') {
    return getAdminTourSteps()
  } else if (role === 'equipe') {
    return getEquipeTourSteps()
  } else {
    return getRecepcaoTourSteps()
  }
}

// Admin Tour Steps (12 steps)
function getAdminTourSteps(): ShepherdStepOptions[] {
  return [
    {
      id: 'welcome',
      text: 'Bem-vindo ao Beauty Sleep System! 👋 Este tour vai te mostrar as principais funcionalidades do sistema.',
      title: 'Bem-vindo!',
      buttons: [
        {
          text: 'Pular Tour',
          action: function(this: any) { return this.cancel() },
        },
        {
          text: 'Começar Tour',
          action: function(this: any) { return this.next() },
        },
      ],
    },
    {
      id: 'dashboard-overview',
      text: 'Este é o Dashboard principal. Aqui você vê KPIs importantes: total de pacientes, exames realizados e leads para converter.',
      title: 'Dashboard - Visão Geral',
      attachTo: {
        element: 'main',
        on: 'top',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'actions-pending',
      text: 'O widget "Ações Pendentes" mostra leads sem follow-up, pacientes sem sessão e manutenções atrasadas. Clique para ver detalhes.',
      title: 'Widget Ações Pendentes',
      attachTo: {
        element: '[data-tour="actions-pending"]',
        on: 'bottom',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'navigation',
      text: 'Use a sidebar à esquerda para navegar: Dashboard, Pacientes, Usuários (apenas Admin) e Logs (apenas Admin).',
      title: 'Navegação',
      attachTo: {
        element: 'aside',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function (this: any) { return this.back() } },
        {
          text: 'Próximo',
          action: function (this: any) {
            // Termina o tour do Dashboard (admin) na sidebar e inicia fluxo em Pacientes
            this.complete()
            window.location.href = '/pacientes?tourFlow=admin'
          },
        },
      ],
    },
    {
      id: 'global-search',
      text: 'Busque qualquer paciente por CPF, nome ou telefone. A busca é instantânea e funciona com ou sem máscara.',
      title: 'Busca Global',
      attachTo: {
        element: 'input[placeholder*="Buscar paciente"]',
        on: 'bottom',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'create-patient',
      text: 'Clique em "Novo Paciente" para pré-cadastrar um lead ou paciente. O sistema valida CPF automaticamente. (Será implementado na Fase 4)',
      title: 'Criar Paciente',
      attachTo: {
        element: '[data-tour="nav-pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'patient-profile',
      text: 'O perfil mostra tudo sobre o paciente: dados, exames sincronizados automaticamente do Biologix, sessões de tratamento e gráficos de evolução. (Será implementado na Fase 5)',
      title: 'Perfil de Paciente',
      attachTo: {
        element: '[data-tour="nav-pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'create-session',
      text: 'Registre cada sessão de tratamento aqui: data, protocolos usados e contadores de pulsos (inicial e final). Sessões editadas ficam com histórico de auditoria. (Será implementado na Fase 5)',
      title: 'Criar Sessão',
      attachTo: {
        element: '[data-tour="nav-pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'tags',
      text: 'Use tags para organizar pacientes por protocolos (Atropina, Vonau, Nasal) ou categorias personalizadas. Crie novas tags em Configurações. (Será implementado na Fase 4)',
      title: 'Tags e Protocolos',
      attachTo: {
        element: '[data-tour="nav-pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        {
          text: 'Próximo',
          action: function(this: any) {
            this.complete()
            window.location.href = '/pacientes?tourFlow=admin'
          }
        },
      ],
    },
  ]
}

// Equipe Tour Steps (8 steps)
function getEquipeTourSteps(): ShepherdStepOptions[] {
  return [
    {
      id: 'welcome',
      text: 'Bem-vindo ao Beauty Sleep System! 👋 Este tour vai te mostrar as principais funcionalidades do sistema.',
      title: 'Bem-vindo!',
      buttons: [
        { text: 'Pular Tour', action: function(this: any) { return this.cancel() } },
        { text: 'Começar Tour', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'dashboard-overview',
      text: 'Este é o Dashboard principal. Aqui você vê KPIs importantes: total de pacientes, exames realizados e leads para converter.',
      title: 'Dashboard - Visão Geral',
      attachTo: { element: 'main', on: 'top' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'actions-pending',
      text: 'O widget "Ações Pendentes" mostra leads sem follow-up, pacientes sem sessão e manutenções atrasadas. Clique para ver detalhes. (Será implementado na Fase 3)',
      title: 'Widget Ações Pendentes',
      attachTo: { element: '[data-tour="actions-pending"]', on: 'bottom' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'navigation',
      text: 'Use a sidebar à esquerda para navegar: Dashboard e Pacientes.',
      title: 'Navegação',
      attachTo: { element: 'aside', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function (this: any) { return this.back() } },
        {
          text: 'Próximo',
          action: function (this: any) {
            // Termina o tour do Dashboard (equipe) na sidebar e inicia fluxo em Pacientes
            this.complete()
            window.location.href = '/pacientes?tourFlow=equipe'
          },
        },
      ],
    },
    {
      id: 'create-patient',
      text: 'Clique em "Novo Paciente" para pré-cadastrar um lead ou paciente. O sistema valida CPF automaticamente. (Será implementado na Fase 4)',
      title: 'Criar Paciente',
      attachTo: { element: '[data-tour="nav-pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'patient-profile',
      text: 'O perfil mostra tudo sobre o paciente: dados, exames sincronizados automaticamente do Biologix, sessões de tratamento e gráficos de evolução. (Será implementado na Fase 5)',
      title: 'Perfil de Paciente',
      attachTo: { element: '[data-tour="nav-pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'create-session',
      text: 'Registre cada sessão de tratamento aqui: data, protocolos usados e contadores de pulsos. Você pode editar suas próprias sessões, mas não de outros dentistas. (Será implementado na Fase 5)',
      title: 'Criar Sessão',
      attachTo: { element: '[data-tour="nav-pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'evolution',
      text: 'Visualize a evolução dos principais indicadores: IDO, SpO2, ronco. Compare o primeiro exame com o último para ver a melhora percentual. (Será implementado na Fase 6)',
      title: 'Evolução Temporal',
      attachTo: { element: '[data-tour="nav-pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        {
          text: 'Próximo',
          action: function(this: any) {
            this.complete()
            window.location.href = '/pacientes?tourFlow=equipe'
          },
        },
      ],
    },
  ]
}

// Recepção Tour Steps (5 steps)
function getRecepcaoTourSteps(): ShepherdStepOptions[] {
  return [
    {
      id: 'welcome',
      text: 'Bem-vindo ao Beauty Sleep System! 👋 Como Recepcionista, você pode visualizar pacientes, buscar por CPF/nome e acompanhar ações pendentes.',
      title: 'Bem-vindo!',
      buttons: [
        { text: 'Pular Tour', action: function(this: any) { return this.cancel() } },
        { text: 'Começar Tour', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'actions-pending',
      text: 'Este widget mostra leads que precisam de follow-up, pacientes sem sessão e manutenções atrasadas. Clique para ver detalhes.',
      title: 'Widget Ações Pendentes',
      attachTo: { element: '[data-tour="actions-pending"]', on: 'bottom' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'global-search',
      text: 'Busque qualquer paciente por CPF, nome ou telefone. A busca é instantânea.',
      title: 'Busca Global',
      attachTo: { element: 'input[placeholder*="Buscar paciente"]', on: 'bottom' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'patient-profile',
      text: 'Você pode visualizar todos os dados do paciente: exames, gráficos de evolução, status. Porém, apenas dentistas e admins podem editar. (Será implementado na Fase 5)',
      title: 'Perfil de Paciente (Read-only)',
      attachTo: { element: 'a[href="/pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'completion',
      text: 'Agora você sabe como buscar pacientes e acompanhar ações pendentes. Se precisar refazer o tour, vá em Configurações de Perfil.',
      title: 'Tudo pronto! 🎉',
      buttons: [
        {
          text: 'Concluir Tour',
          action: function(this: any) { return this.complete() },
        },
      ],
    },
  ]
}

// Tour específico para a página de Perfil de Paciente (chamado via query string ?tourFlow=admin|equipe)
export function startPacienteDetailTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'paciente-resumo',
      text: 'Aqui você vê o resumo do tratamento do paciente: sessões compradas, utilizadas, disponíveis e adesão ao tratamento.',
      title: 'Resumo de Tratamento',
      attachTo: {
        element: '[data-tour="paciente-resumo-tratamento"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'paciente-dashboards',
      text: 'Os dashboards mostram gráficos de evolução, exames, sessões e outras informações importantes do paciente. Use as abas para navegar entre diferentes visualizações.',
      title: 'Dashboards do Paciente',
      attachTo: {
        element: '[data-tour="paciente-dashboards"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'paciente-exames',
      text: 'Na aba "Exames", você vê todos os exames sincronizados do Biologix. Use os filtros para buscar por tipo (Ronco/Sono) ou período. Clique em "Ver Detalhes" para ver informações completas do exame, incluindo IDO, score de ronco e outros dados. Você também pode baixar o PDF do relatório quando disponível.',
      title: 'Detalhes dos Exames',
      attachTo: {
        element: '[data-tour="paciente-exames"]',
        on: 'top',
      },
      beforeShowPromise: function() {
        return new Promise((resolve) => {
          // Garantir que a aba de exames está ativa
          const examesTab = document.querySelector('button[data-tab="exames"]')
          if (examesTab) {
            (examesTab as HTMLElement).click()
          }
          setTimeout(() => {
            const checkElement = () => {
              const element = document.querySelector('[data-tour="paciente-exames"]')
              if (element) {
                resolve(undefined)
              } else {
                setTimeout(checkElement, 100)
              }
            }
            checkElement()
          }, 300)
        })
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            this.complete()
            window.location.href = `/alertas?tourFlow=${flow}`
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Tour específico para a página de Alertas (chamado via query string ?tourFlow=admin|equipe)
export function startAlertasTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'alertas-pagina-geral',
      text: 'Esta é a página de Alertas, onde você gerencia todos os alertas do sistema. Aqui você pode ver alertas críticos, de manutenção e follow-up, filtrá-los e resolvê-los.',
      title: 'Página de Alertas',
      attachTo: {
        element: 'main',
        on: 'top',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'alertas-filtros',
      text: 'Use os filtros para encontrar alertas específicos por tipo (Crítico, Manutenção, Follow-up), urgência (Alta, Média, Baixa) e status (Pendente, Resolvido, Ignorado).',
      title: 'Filtros de Alertas',
      attachTo: {
        element: '[data-tour="alertas-filtros"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'alertas-card-exemplo',
      text: 'Cada card representa um alerta. A borda colorida à esquerda indica a urgência: vermelho (alta), laranja (média) ou verde (baixa). O card mostra o título, descrição, tipo, urgência e paciente relacionado.',
      title: 'Card de Alerta',
      attachTo: {
        element: '[data-tour="alertas-card"]',
        on: 'bottom',
      },
      beforeShowPromise: function() {
        return new Promise((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('[data-tour="alertas-card"]')
            if (element) {
              resolve(undefined)
            } else {
              setTimeout(checkElement, 100)
            }
          }
          checkElement()
        })
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'alertas-metadados',
      text: 'Esta seção mostra os metadados do alerta: Tipo (Crítico, Manutenção ou Follow-up), Urgência (Alta, Média ou Baixa), tempo desde a criação e o paciente relacionado. Use essas informações para priorizar os alertas.',
      title: 'Metadados do Alerta',
      attachTo: {
        element: '[data-tour="alertas-card"] [data-tour="alerta-metadados"]',
        on: 'top',
      },
      beforeShowPromise: function() {
        return new Promise((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('[data-tour="alertas-card"] [data-tour="alerta-metadados"]') as HTMLElement
            if (element) {
              // Copiar border-radius do elemento para o highlight
              setTimeout(() => {
                const computedStyle = window.getComputedStyle(element)
                const borderRadius = computedStyle.borderRadius
                const highlight = document.querySelector('.shepherd-target') as HTMLElement
                if (highlight && borderRadius) {
                  highlight.style.borderRadius = borderRadius
                }
              }, 50)
              resolve(undefined)
            } else {
              setTimeout(checkElement, 100)
            }
          }
          checkElement()
        })
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            return this.next()
          },
        },
      ],
    },
    {
      id: 'alertas-acoes',
      text: 'Use os botões de ação: "Ver Paciente" para acessar o perfil completo do paciente relacionado ao alerta, e "Marcar como Resolvido" para resolver o alerta. Alertas resolvidos são automaticamente deletados após 3 dias.',
      title: 'Ações do Alerta',
      attachTo: {
        element: '[data-tour="alertas-card"] [data-tour="alerta-acoes"]',
        on: 'top',
      },
      beforeShowPromise: function() {
        return new Promise((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('[data-tour="alertas-card"] [data-tour="alerta-acoes"]') as HTMLElement
            if (element) {
              // Copiar border-radius do elemento para o highlight
              setTimeout(() => {
                const computedStyle = window.getComputedStyle(element)
                const borderRadius = computedStyle.borderRadius
                const highlight = document.querySelector('.shepherd-target') as HTMLElement
                if (highlight && borderRadius) {
                  highlight.style.borderRadius = borderRadius
                }
              }, 50)
              resolve(undefined)
            } else {
              setTimeout(checkElement, 100)
            }
          }
          checkElement()
        })
      },
      buttons: [
        {
          text: 'Voltar',
          action: function (this: any) {
            return this.back()
          },
        },
        {
          text: 'Próximo',
          action: function (this: any) {
            this.complete()
            // Voltar para dashboard e mostrar notificações
            window.location.href = `/dashboard?tourFlow=${flow}&showNotifications=true`
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: false, // Desabilitar scroll automático para manter página centralizada
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}

// Tour específico para Notificações (chamado via query string ?showNotifications=true)
export function startNotificationsTour(
  role: 'admin' | 'equipe' | 'recepcao',
  flow: 'admin' | 'equipe',
) {
  if (Shepherd.activeTour) {
    Shepherd.activeTour.cancel()
  }
  const steps: ShepherdStepOptions[] = [
    {
      id: 'notificacoes-botao',
      text: 'O ícone de sino mostra quantos alertas pendentes você tem. A cor do badge indica a urgência máxima: vermelho (alta), amarelo (média) ou verde (baixa). Clique para ver os alertas. Você também pode marcar alertas como resolvidos diretamente daqui, sem precisar ir até a página de alertas.',
      title: 'Centro de Notificações',
      attachTo: {
        element: '[data-tour="notificacoes-botao"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Próximo',
          action: function (this: any) {
            this.complete()
            // Continuar para Configurações (admin e equipe)
            window.location.href = `/configuracoes?tourFlow=${flow}`
          },
        },
      ],
    },
  ]

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: role === 'admin' ? 'shepherd-theme-admin' : 'shepherd-theme-light',
    },
  })

  steps.forEach((step) => tour.addStep(step))
  tour.start()

  return tour
}
