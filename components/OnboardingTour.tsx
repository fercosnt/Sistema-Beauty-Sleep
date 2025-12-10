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
      text: 'Use a sidebar para navegar: Dashboard, Pacientes, Usuários (apenas Admin) e Logs (apenas Admin).',
      title: 'Navegação',
      attachTo: {
        element: 'aside',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
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
        element: 'a[href="/pacientes"]',
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
        element: 'a[href="/pacientes"]',
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
        element: 'a[href="/pacientes"]',
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
        element: 'a[href="/pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'evolution',
      text: 'Visualize a evolução dos principais indicadores: IDO, SpO2, ronco. Compare o primeiro exame com o último para ver a melhora percentual. (Será implementado na Fase 6)',
      title: 'Evolução Temporal',
      attachTo: {
        element: 'a[href="/pacientes"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'users-management',
      text: 'Como Admin, você pode criar e gerenciar usuários. Existem 3 roles: Admin (você), Equipe (dentistas) e Recepção (visualização).',
      title: 'Gestão de Usuários',
      attachTo: {
        element: 'a[href="/usuarios"]',
        on: 'right',
      },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'completion',
      text: 'Você já sabe o básico! Explore as outras abas do dashboard (Ronco, Apneia) e o histórico de status. Se precisar refazer o tour, vá em Configurações de Perfil.',
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
      attachTo: { element: 'main', on: 'top' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'navigation',
      text: 'Use a sidebar para navegar: Dashboard e Pacientes.',
      title: 'Navegação',
      attachTo: { element: 'aside', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'create-patient',
      text: 'Clique em "Novo Paciente" para pré-cadastrar um lead ou paciente. O sistema valida CPF automaticamente. (Será implementado na Fase 4)',
      title: 'Criar Paciente',
      attachTo: { element: 'a[href="/pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'patient-profile',
      text: 'O perfil mostra tudo sobre o paciente: dados, exames sincronizados automaticamente do Biologix, sessões de tratamento e gráficos de evolução. (Será implementado na Fase 5)',
      title: 'Perfil de Paciente',
      attachTo: { element: 'a[href="/pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'create-session',
      text: 'Registre cada sessão de tratamento aqui: data, protocolos usados e contadores de pulsos. Você pode editar suas próprias sessões, mas não de outros dentistas. (Será implementado na Fase 5)',
      title: 'Criar Sessão',
      attachTo: { element: 'a[href="/pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        { text: 'Próximo', action: function(this: any) { return this.next() } },
      ],
    },
    {
      id: 'evolution',
      text: 'Visualize a evolução dos principais indicadores: IDO, SpO2, ronco. Compare o primeiro exame com o último para ver a melhora percentual. (Será implementado na Fase 6)',
      title: 'Evolução Temporal',
      attachTo: { element: 'a[href="/pacientes"]', on: 'right' },
      buttons: [
        { text: 'Voltar', action: function(this: any) { return this.back() } },
        {
          text: 'Concluir Tour',
          action: function(this: any) { return this.complete() },
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

