/**
 * Login Public Template
 * Beauty Smile Design System
 *
 * Template for public login/signup pages with turquoise theme and glass morphism
 */

import * as React from 'react'
import { BackgroundImage } from '../../assets/components/BackgroundImage'
import { BeautySmileLogo } from '../../assets/components/BeautySmileLogo'
import { GlassCard } from '../../components/glass/GlassCard'
import { GlassButton } from '../../components/glass/GlassButton'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Checkbox } from '../../components/ui/Checkbox'
import { cn } from '../../utils/cn'

export interface LoginPublicTemplateProps {
  /**
   * Page mode: 'login' or 'signup'
   * @default 'login'
   */
  mode?: 'login' | 'signup'
  /**
   * Page title
   */
  title?: string
  /**
   * Page subtitle
   */
  subtitle?: string
  /**
   * Show "Forgot password" link
   * @default true
   */
  showForgotPassword?: boolean
  /**
   * Show "Remember me" checkbox
   * @default true
   */
  showRememberMe?: boolean
  /**
   * Forgot password link text
   * @default 'Esqueceu sua senha?'
   */
  forgotPasswordText?: string
  /**
   * Remember me label
   * @default 'Lembrar de mim'
   */
  rememberMeLabel?: string
  /**
   * Submit button text
   */
  submitButtonText?: string
  /**
   * Toggle mode link text (e.g., "Ainda não tem conta? Cadastre-se")
   */
  toggleModeText?: string
  /**
   * Background gradient to use
   * @default 'gradient2'
   */
  background?: 'gradient1' | 'gradient2'
  /**
   * Callback when form is submitted
   */
  onSubmit?: (data: Record<string, any>) => void
  /**
   * Callback when forgot password is clicked
   */
  onForgotPassword?: () => void
  /**
   * Callback when toggle mode link is clicked
   */
  onToggleMode?: () => void
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Login Public Template
 *
 * Pre-built login/signup template for public websites with turquoise theme and glass morphism.
 *
 * @example
 * ```tsx
 * <LoginPublicTemplate
 *   mode="login"
 *   title="Bem-vindo de volta"
 *   subtitle="Entre para acessar sua conta"
 *   onSubmit={(data) => console.log('Login:', data)}
 *   onToggleMode={() => setMode('signup')}
 *   toggleModeText="Ainda não tem conta? Cadastre-se"
 * />
 * ```
 */
export const LoginPublicTemplate: React.FC<LoginPublicTemplateProps> = ({
  mode = 'login',
  title,
  subtitle,
  showForgotPassword = true,
  showRememberMe = true,
  forgotPasswordText = 'Esqueceu sua senha?',
  rememberMeLabel = 'Lembrar de mim',
  submitButtonText,
  toggleModeText,
  background = 'gradient2',
  onSubmit,
  onForgotPassword,
  onToggleMode,
  isLoading = false,
  className,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [rememberMe, setRememberMe] = React.useState(false)

  const isSignup = mode === 'signup'

  const defaultTitle = isSignup ? 'Criar Conta' : 'Bem-vindo de volta'
  const defaultSubtitle = isSignup
    ? 'Cadastre-se para começar'
    : 'Entre para acessar sua conta'
  const defaultSubmitText = isSignup ? 'Cadastrar' : 'Entrar'
  const defaultToggleText = isSignup
    ? 'Já tem uma conta? Entrar'
    : 'Ainda não tem conta? Cadastre-se'

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ ...formData, rememberMe })
  }

  return (
    <BackgroundImage
      background={background}
      overlayColor="rgba(0, 150, 180, 0.6)"
      overlayOpacity={0.6}
      className={cn('min-h-screen', className)}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <BeautySmileLogo type="horizontal" size="lg" />
          </div>

          {/* Glass Card */}
          <GlassCard variant="light" blur="lg" className="p-8">
            <GlassCard.Header className="space-y-2 text-center">
              <GlassCard.Title className="text-2xl font-bold text-white">
                {title || defaultTitle}
              </GlassCard.Title>
              <GlassCard.Description className="text-white/90">
                {subtitle || defaultSubtitle}
              </GlassCard.Description>
            </GlassCard.Header>

            <GlassCard.Content className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name (Signup only) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Confirm Password (Signup only) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirmar Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) =>
                        handleChange('confirmPassword', e.target.value)
                      }
                      required
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                )}

                {/* Remember Me & Forgot Password (Login only) */}
                {!isSignup && (
                  <div className="flex items-center justify-between">
                    {showRememberMe && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                          disabled={isLoading}
                          className="border-white/30"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-white/90 cursor-pointer"
                        >
                          {rememberMeLabel}
                        </Label>
                      </div>
                    )}

                    {showForgotPassword && onForgotPassword && (
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        disabled={isLoading}
                        className="text-sm text-white hover:text-white/80 transition-colors"
                      >
                        {forgotPasswordText}
                      </button>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <GlassButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {submitButtonText || defaultSubmitText}
                </GlassButton>

                {/* Toggle Mode */}
                {onToggleMode && (
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={onToggleMode}
                      disabled={isLoading}
                      className="text-sm text-white hover:text-white/80 transition-colors"
                    >
                      {toggleModeText || defaultToggleText}
                    </button>
                  </div>
                )}
              </form>
            </GlassCard.Content>
          </GlassCard>
        </div>
      </div>
    </BackgroundImage>
  )
}

LoginPublicTemplate.displayName = 'LoginPublicTemplate'
