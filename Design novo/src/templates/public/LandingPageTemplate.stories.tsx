/**
 * LandingPageTemplate Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { LandingPageTemplate } from './LandingPageTemplate'

const meta: Meta<typeof LandingPageTemplate> = {
  title: 'Templates/Public/LandingPageTemplate',
  component: LandingPageTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pre-built landing page template for public websites with hero section, features, and CTAs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ctaButtons: { control: 'object' },
  },
}

export default meta
type Story = StoryObj<typeof LandingPageTemplate>

/**
 * Default landing page
 */
export const Default: Story = {
  args: {
    headline: 'Bem-vindo ao Beauty Smile',
    subheadline: 'A plataforma completa para gestão de RH',
    description:
      'Gerencie candidatos, processos seletivos e testes psicométricos em um só lugar. Simplifique sua rotina e tome decisões baseadas em dados.',
    ctaButtons: [
      {
        label: 'Começar Agora',
        variant: 'primary',
        onClick: () => console.log('Get started'),
      },
      {
        label: 'Saiba Mais',
        variant: 'secondary',
        onClick: () => console.log('Learn more'),
      },
    ],
    features: [
      {
        title: 'Gestão de Candidatos',
        description:
          'Centralize todos os candidatos em um só lugar. Acompanhe o progresso de cada um em tempo real.',
        icon: '👥',
      },
      {
        title: 'Testes Psicométricos',
        description:
          'Aplique testes DISC, Big Five, Raven e mais. Resultados instantâneos e relatórios completos.',
        icon: '📊',
      },
      {
        title: 'Análise de Dados',
        description:
          'Dashboards interativos e relatórios customizáveis. Tome decisões baseadas em dados reais.',
        icon: '📈',
      },
      {
        title: 'Processos Seletivos',
        description:
          'Crie e gerencie processos seletivos completos. Automatize etapas e economize tempo.',
        icon: '⚙️',
      },
      {
        title: 'Comunicação',
        description:
          'Envie e-mails e notificações automáticas. Mantenha candidatos sempre informados.',
        icon: '📧',
      },
      {
        title: 'Segurança',
        description:
          'Dados criptografados e conformidade com LGPD. Sua informação sempre protegida.',
        icon: '🔒',
      },
    ],
  },
}

/**
 * Simple landing page (no features)
 */
export const SimpleHero: Story = {
  args: {
    headline: 'Transforme seu RH',
    subheadline: 'Tecnologia e Inovação',
    description: 'A solução completa para modernizar seus processos de RH.',
    ctaButtons: [
      {
        label: 'Começar Gratuitamente',
        variant: 'accent',
        onClick: () => console.log('Get started'),
      },
    ],
  },
}

/**
 * With dark background
 */
export const DarkBackground: Story = {
  args: {
    ...Default.args,
    background: 'gradient1',
    overlayColor: 'rgba(0, 20, 50, 0.7)',
    overlayOpacity: 0.7,
  },
}
