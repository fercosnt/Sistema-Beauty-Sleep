/**
 * Login Admin Template
 * Beauty Smile Design System
 *
 * Template for admin login page with dark blue background and glass morphism
 */

import * as React from 'react'
import { BackgroundImage } from '../../assets/components/BackgroundImage'
import { BeautySmileLogo } from '../../assets/components/BeautySmileLogo'
import { GlassCard } from '../../components/glass/GlassCard'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Checkbox } from '../../components/ui/Checkbox'
import { cn } from '../../utils/cn'

export interface LoginAdminTemplateProps {
  /**
   * Logo type to display
   * @default 'horizontal'
   */
  logoType?: 'icon' | 'horizontal' | 'vertical'
  /**
   * Logo size
   * @default 'lg'
   */
  logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /**
   * Page title
   * @default 'Beauty Smile Admin'
   */
  title?: string
  /**
   * Page subtitle
   * @default 'Faça login para acessar o painel administrativo'
   */
  subtitle?: string
  /**
   * Email input label
   * @default 'Email'
   */
  emailLabel?: string
  /**
   * Email input placeholder
   * @default 'seu@email.com'
   */
  emailPlaceholder?: string
  /**
   * Password input label
   * @default 'Senha'
   */
  passwordLabel?: string
  /**
   * Password input placeholder
   * @default '••••••••'
   */
  passwordPlaceholder?: string
  /**
   * Remember me checkbox label
   * @default 'Lembrar de mim'
   */
  rememberMeLabel?: string
  /**
   * Forgot password link text
   * @default 'Esqueceu sua senha?'
   */
  forgotPasswordText?: string
  /**
   * Login button text
   * @default 'Entrar'
   */
  loginButtonText?: string
  /**
   * Background overlay color
   * @default 'rgba(0, 20, 50, 0.7)'
   */
  overlayColor?: string
  /**
   * Background overlay opacity (0-1)
   * @default 0.7
   */
  overlayOpacity?: number
  /**
   * Callback when login button is clicked
   */
  onLogin?: (email: string, password: string, rememberMe: boolean) => void
  /**
   * Callback when forgot password is clicked
   */
  onForgotPassword?: () => void
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
 * Login Admin Template
 *
 * Pre-built login page template for admin area with dark blue theme and glass morphism effect.
 *
 * @example
 * ```tsx
 * <LoginAdminTemplate
 *   onLogin={(email, password, rememberMe) => {
 *     console.log('Login:', { email, password, rememberMe })
 *   }}
 *   onForgotPassword={() => {
 *     console.log('Forgot password clicked')
 *   }}
 * />
 * ```
 */
export const LoginAdminTemplate: React.FC<LoginAdminTemplateProps> = ({
  logoType = 'horizontal',
  logoSize = 'lg',
  title = 'Beauty Smile Admin',
  subtitle = 'Faça login para acessar o painel administrativo',
  emailLabel = 'Email',
  emailPlaceholder = 'seu@email.com',
  passwordLabel = 'Senha',
  passwordPlaceholder = '••••••••',
  rememberMeLabel = 'Lembrar de mim',
  forgotPasswordText = 'Esqueceu sua senha?',
  loginButtonText = 'Entrar',
  overlayColor = 'rgba(0, 20, 50, 0.7)',
  overlayOpacity = 0.7,
  onLogin,
  onForgotPassword,
  isLoading = false,
  className,
}) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin?.(email, password, rememberMe)
  }

  return (
    <BackgroundImage
      background="gradient1"
      overlayColor={overlayColor}
      overlayOpacity={overlayOpacity}
      className={cn('min-h-screen', className)}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <BeautySmileLogo type={logoType} size={logoSize} />
          </div>

          {/* Glass Card */}
          <GlassCard variant="dark" blur="lg" className="p-8">
            <GlassCard.Header className="space-y-2 text-center">
              <GlassCard.Title className="text-2xl font-bold text-white">
                {title}
              </GlassCard.Title>
              <GlassCard.Description className="text-white/80">
                {subtitle}
              </GlassCard.Description>
            </GlassCard.Header>

            <GlassCard.Content className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    {emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/50"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    {passwordLabel}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/50"
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      disabled={isLoading}
                      className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal text-white/90 cursor-pointer"
                    >
                      {rememberMeLabel}
                    </Label>
                  </div>

                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      disabled={isLoading}
                      className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                    >
                      {forgotPasswordText}
                    </button>
                  )}
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {loginButtonText}
                </Button>
              </form>
            </GlassCard.Content>
          </GlassCard>
        </div>
      </div>
    </BackgroundImage>
  )
}

LoginAdminTemplate.displayName = 'LoginAdminTemplate'
