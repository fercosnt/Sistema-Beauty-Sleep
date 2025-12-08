/**
 * LoginAdminTemplate Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { LoginAdminTemplate } from './LoginAdminTemplate'

const meta: Meta<typeof LoginAdminTemplate> = {
  title: 'Templates/Admin/LoginAdminTemplate',
  component: LoginAdminTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pre-built login template for admin area with dark blue theme and glass morphism effect.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onLogin: { action: 'login' },
    onForgotPassword: { action: 'forgot-password' },
  },
}

export default meta
type Story = StoryObj<typeof LoginAdminTemplate>

/**
 * Default login admin template
 */
export const Default: Story = {
  args: {
    onLogin: (email, password, rememberMe) => {
      console.log('Login:', { email, password, rememberMe })
    },
    onForgotPassword: () => {
      console.log('Forgot password clicked')
    },
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}

/**
 * Custom labels
 */
export const CustomLabels: Story = {
  args: {
    ...Default.args,
    title: 'Beauty Smile RH',
    subtitle: 'Sistema de Gestão de Recursos Humanos',
    emailLabel: 'E-mail Corporativo',
    passwordLabel: 'Senha de Acesso',
    loginButtonText: 'Acessar Sistema',
  },
}

/**
 * With icon logo
 */
export const WithIconLogo: Story = {
  args: {
    ...Default.args,
    logoType: 'icon',
    logoSize: 'xl',
  },
}
