/**
 * Settings Template
 * Beauty Smile Design System
 *
 * Template for settings pages with multiple configuration sections
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { cn } from '../../utils/cn'

export interface SettingSection {
  /**
   * Section identifier
   */
  id: string
  /**
   * Section title
   */
  title: string
  /**
   * Section description
   */
  description?: string
  /**
   * Section icon
   */
  icon?: React.ReactNode
  /**
   * Section content (form fields, components, etc.)
   */
  content: React.ReactNode
}

export interface SettingsTemplateProps {
  /**
   * Page title
   * @default 'Configurações'
   */
  title?: string
  /**
   * Page description
   */
  description?: string
  /**
   * Settings sections
   */
  sections: SettingSection[]
  /**
   * Layout mode: 'tabs' or 'stacked'
   * @default 'stacked'
   */
  layout?: 'tabs' | 'stacked'
  /**
   * Show save button at bottom
   * @default true
   */
  showSaveButton?: boolean
  /**
   * Save button text
   * @default 'Salvar Alterações'
   */
  saveButtonText?: string
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Callback when save button is clicked
   */
  onSave?: () => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Settings Template
 *
 * Pre-built template for settings pages with multiple configuration sections.
 *
 * @example
 * ```tsx
 * <SettingsTemplate
 *   title="Configurações do Sistema"
 *   layout="stacked"
 *   sections={[
 *     {
 *       id: 'general',
 *       title: 'Geral',
 *       description: 'Configurações gerais do sistema',
 *       content: <div>Form fields here...</div>
 *     },
 *     {
 *       id: 'security',
 *       title: 'Segurança',
 *       description: 'Configurações de segurança',
 *       content: <div>Security settings...</div>
 *     },
 *   ]}
 *   onSave={() => console.log('Save settings')}
 * />
 * ```
 */
export const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  title = 'Configurações',
  description,
  sections,
  layout = 'stacked',
  showSaveButton = true,
  saveButtonText = 'Salvar Alterações',
  isLoading = false,
  onSave,
  className,
}) => {
  const [activeSection, setActiveSection] = React.useState(sections[0]?.id || null)

  const activeSectionData = sections.find((s) => s.id === activeSection)

  return (
    <div className={cn('p-6 space-y-6 max-w-6xl mx-auto', className)}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        {description && (
          <p className="text-lg text-neutral-600 mt-2">{description}</p>
        )}
      </div>

      {layout === 'tabs' ? (
        /* Tabs Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3',
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                {section.icon && <span className="text-lg">{section.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{section.title}</p>
                  {section.description && (
                    <p className="text-sm opacity-80 truncate">
                      {section.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {/* Active Section Content */}
          <div className="lg:col-span-3">
            {activeSectionData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {activeSectionData.icon && (
                      <span className="text-2xl">{activeSectionData.icon}</span>
                    )}
                    <div>
                      <CardTitle>{activeSectionData.title}</CardTitle>
                      {activeSectionData.description && (
                        <CardDescription className="mt-1">
                          {activeSectionData.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{activeSectionData.content}</CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Stacked Layout */
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {section.icon && (
                    <span className="text-2xl">{section.icon}</span>
                  )}
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    {section.description && (
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Save Button */}
      {showSaveButton && onSave && (
        <div className="flex justify-end pt-6 border-t">
          <Button
            variant="primary"
            size="lg"
            onClick={onSave}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {saveButtonText}
          </Button>
        </div>
      )}
    </div>
  )
}

SettingsTemplate.displayName = 'SettingsTemplate'
