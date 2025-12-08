/**
 * Landing Page Template
 * Beauty Smile Design System
 *
 * Template for public landing pages with hero section, features, and CTAs
 */

import * as React from 'react'
import { BackgroundImage } from '../../assets/components/BackgroundImage'
import { BeautySmileLogo } from '../../assets/components/BeautySmileLogo'
import { GlassCard } from '../../components/glass/GlassCard'
import { GlassButton } from '../../components/glass/GlassButton'
import { cn } from '../../utils/cn'

export interface FeatureItem {
  /**
   * Feature icon
   */
  icon?: React.ReactNode
  /**
   * Feature title
   */
  title: string
  /**
   * Feature description
   */
  description: string
}

export interface CTAButton {
  /**
   * Button label
   */
  label: string
  /**
   * Button variant
   */
  variant?: 'primary' | 'light' | 'accent'
  /**
   * Button click handler
   */
  onClick: () => void
}

export interface LandingPageTemplateProps {
  /**
   * Main headline
   */
  headline: string
  /**
   * Subheadline/tagline
   */
  subheadline?: string
  /**
   * Hero description
   */
  description?: string
  /**
   * CTA buttons for hero section
   */
  ctaButtons?: CTAButton[]
  /**
   * Features to display
   */
  features?: FeatureItem[]
  /**
   * Features section title
   * @default 'Recursos'
   */
  featuresTitle?: string
  /**
   * Background gradient to use
   * @default 'gradient2'
   */
  background?: 'gradient1' | 'gradient2'
  /**
   * Background overlay color
   * @default 'rgba(0, 120, 150, 0.6)'
   */
  overlayColor?: string
  /**
   * Background overlay opacity
   * @default 0.6
   */
  overlayOpacity?: number
  /**
   * Show logo in header
   * @default true
   */
  showLogo?: boolean
  /**
   * Additional content sections (below features)
   */
  children?: React.ReactNode
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Landing Page Template
 *
 * Pre-built landing page template for public websites with hero, features, and CTAs.
 *
 * @example
 * ```tsx
 * <LandingPageTemplate
 *   headline="Bem-vindo ao Beauty Smile"
 *   subheadline="A plataforma completa para gestão de RH"
 *   description="Gerencie candidatos, processos seletivos e testes psicométricos em um só lugar."
 *   ctaButtons={[
 *     { label: 'Começar Agora', variant: 'primary', onClick: () => {} },
 *     { label: 'Saiba Mais', variant: 'secondary', onClick: () => {} },
 *   ]}
 *   features={[
 *     {
 *       icon: <Icon />,
 *       title: 'Gestão de Candidatos',
 *       description: 'Centralize todos os candidatos em um só lugar',
 *     },
 *     // ...more features
 *   ]}
 * />
 * ```
 */
export const LandingPageTemplate: React.FC<LandingPageTemplateProps> = ({
  headline,
  subheadline,
  description,
  ctaButtons = [],
  features = [],
  featuresTitle = 'Recursos',
  background = 'gradient2',
  overlayColor = 'rgba(0, 120, 150, 0.6)',
  overlayOpacity = 0.6,
  showLogo = true,
  children,
  className,
}) => {
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section */}
      <BackgroundImage
        background={background}
        overlayColor={overlayColor}
        overlayOpacity={overlayOpacity}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          {showLogo && (
            <header className="flex justify-center mb-16">
              <BeautySmileLogo type="horizontal" size="lg" />
            </header>
          )}

          {/* Hero Content */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <GlassCard
              variant="light"
              blur="lg"
              className="max-w-4xl mx-auto p-12"
            >
              <GlassCard.Content className="space-y-6">
                {/* Subheadline */}
                {subheadline && (
                  <p className="text-lg text-accent-400 font-medium uppercase tracking-wide">
                    {subheadline}
                  </p>
                )}

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {headline}
                </h1>

                {/* Description */}
                {description && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                    {description}
                  </p>
                )}

                {/* CTA Buttons */}
                {ctaButtons.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    {ctaButtons.map((cta, index) => (
                      <GlassButton
                        key={index}
                        variant={cta.variant || 'primary'}
                        size="lg"
                        onClick={cta.onClick}
                      >
                        {cta.label}
                      </GlassButton>
                    ))}
                  </div>
                )}
              </GlassCard.Content>
            </GlassCard>
          </div>
        </div>
      </BackgroundImage>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
              {featuresTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {feature.icon && (
                    <div className="flex justify-center mb-4 text-accent-500">
                      <div className="text-4xl">{feature.icon}</div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Content */}
      {children}
    </div>
  )
}

LandingPageTemplate.displayName = 'LandingPageTemplate'
