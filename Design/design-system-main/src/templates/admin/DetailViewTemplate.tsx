/**
 * Detail View Template
 * Beauty Smile Design System
 *
 * Template for detail pages with tabs/sections and actions
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

export interface DetailSection {
  /**
   * Section identifier
   */
  id: string
  /**
   * Section title
   */
  title: string
  /**
   * Section content
   */
  content: React.ReactNode
  /**
   * Section icon
   */
  icon?: React.ReactNode
}

export interface DetailField {
  /**
   * Field label
   */
  label: string
  /**
   * Field value (can be any React node)
   */
  value: React.ReactNode
  /**
   * Whether to render as full width
   * @default false
   */
  fullWidth?: boolean
}

export interface DetailAction {
  /**
   * Action identifier
   */
  id: string
  /**
   * Action label
   */
  label: string
  /**
   * Action icon
   */
  icon?: React.ReactNode
  /**
   * Action variant
   * @default 'outline'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  /**
   * Callback when action is clicked
   */
  onClick: () => void
}

export interface DetailViewTemplateProps {
  /**
   * Page title
   */
  title: string
  /**
   * Page subtitle/description
   */
  subtitle?: string
  /**
   * Status badge (optional)
   */
  status?: {
    label: string
    variant?: 'default' | 'success' | 'warning' | 'error'
  }
  /**
   * Header image URL (optional)
   */
  headerImage?: string
  /**
   * Detail fields to display in main info card
   */
  fields?: DetailField[]
  /**
   * Sections/tabs to display
   */
  sections?: DetailSection[]
  /**
   * Action buttons to display in header
   */
  actions?: DetailAction[]
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Back button callback
   */
  onBack?: () => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Detail View Template
 *
 * Pre-built template for detail pages with header, info cards, tabs/sections, and actions.
 *
 * @example
 * ```tsx
 * <DetailViewTemplate
 *   title="João Silva"
 *   subtitle="Desenvolvedor Full Stack"
 *   status={{ label: 'Ativo', variant: 'success' }}
 *   fields={[
 *     { label: 'Email', value: 'joao@example.com' },
 *     { label: 'Telefone', value: '(11) 99999-9999' },
 *     { label: 'Departamento', value: 'TI' },
 *   ]}
 *   sections={[
 *     { id: 'bio', title: 'Biografia', content: <p>...</p> },
 *     { id: 'history', title: 'Histórico', content: <div>...</div> },
 *   ]}
 *   actions={[
 *     { id: 'edit', label: 'Editar', variant: 'primary', onClick: () => {} },
 *     { id: 'delete', label: 'Deletar', variant: 'destructive', onClick: () => {} },
 *   ]}
 *   onBack={() => history.back()}
 * />
 * ```
 */
export const DetailViewTemplate: React.FC<DetailViewTemplateProps> = ({
  title,
  subtitle,
  status,
  headerImage,
  fields = [],
  sections = [],
  actions = [],
  isLoading = false,
  onBack,
  className,
}) => {
  const [activeSection, setActiveSection] = React.useState(
    sections[0]?.id || null
  )

  const activeSectionData = sections.find((s) => s.id === activeSection)

  return (
    <div className={cn('p-6 space-y-6 max-w-6xl mx-auto', className)}>
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Voltar
        </Button>
      )}

      {/* Header */}
      <div className="space-y-4">
        {/* Header Image */}
        {headerImage && (
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img
              src={headerImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
              {status && (
                <Badge variant={status.variant || 'default'}>
                  {status.label}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-lg text-neutral-600">{subtitle}</p>
            )}
          </div>

          {/* Action Buttons */}
          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  disabled={isLoading}
                  leftIcon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={cn(
                    'space-y-1',
                    field.fullWidth && 'md:col-span-2'
                  )}
                >
                  <p className="text-sm font-medium text-neutral-600">
                    {field.label}
                  </p>
                  <div className="text-base text-neutral-900">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections/Tabs */}
      {sections.length > 0 && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="border-b border-neutral-200">
            <div className="flex gap-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'pb-3 px-1 border-b-2 transition-colors flex items-center gap-2',
                    activeSection === section.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  {section.icon && <span>{section.icon}</span>}
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Section Content */}
          {activeSectionData && (
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  activeSectionData.content
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !sections.length && (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

DetailViewTemplate.displayName = 'DetailViewTemplate'
