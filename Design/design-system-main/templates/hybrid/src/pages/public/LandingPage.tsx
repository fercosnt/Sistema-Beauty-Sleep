import { LandingPageTemplate } from '@beautysmile/design-system'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <LandingPageTemplate
      headline="Transforme seu RH com Beauty Smile"
      subheadline="Plataforma Completa de Gestão"
      description="Gerencie candidatos, processos seletivos e testes psicométricos em um só lugar. Simplifique sua rotina e tome decisões baseadas em dados."
      background="gradient2"
      ctaButtons={[
        {
          label: 'Começar Gratuitamente',
          variant: 'primary',
          onClick: () => navigate('/login'),
        },
        {
          label: 'Saiba Mais',
          variant: 'secondary',
          onClick: () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }),
        },
      ]}
      features={[
        {
          title: 'Gestão de Candidatos',
          description: 'Centralize todos os candidatos. Acompanhe o progresso em tempo real.',
          icon: '👥',
        },
        {
          title: 'Testes Psicométricos',
          description: 'Aplique testes DISC, Big Five, Raven. Resultados instantâneos.',
          icon: '📊',
        },
        {
          title: 'Análise de Dados',
          description: 'Dashboards interativos e relatórios customizáveis.',
          icon: '📈',
        },
        {
          title: 'Processos Seletivos',
          description: 'Crie e gerencie processos completos. Automatize etapas.',
          icon: '⚙️',
        },
        {
          title: 'Comunicação',
          description: 'Envie e-mails e notificações automáticas.',
          icon: '📧',
        },
        {
          title: 'Segurança',
          description: 'Dados criptografados e conformidade com LGPD.',
          icon: '🔒',
        },
      ]}
    />
  )
}
