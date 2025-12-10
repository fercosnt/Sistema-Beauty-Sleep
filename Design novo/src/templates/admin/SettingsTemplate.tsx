/**
 * Settings Template
 * Beauty Smile Design System
 *
 * Template for settings pages with multiple configuration sections
 */

import * as React from 'react'
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
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-lg text-white/90 mt-2">{description}</p>
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
                    ? 'bg-primary-100 text-primary-900 border border-primary-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {section.icon && <span className="text-lg">{section.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{section.title}</p>
                  {section.description && (
                    <p className="text-sm text-gray-600 truncate">
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
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex items-center gap-3">
                    {activeSectionData.icon && (
                      <span className="text-2xl text-gray-900">{activeSectionData.icon}</span>
                    )}
                    <div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 font-heading">
                        {activeSectionData.title}
                      </h3>
                      {activeSectionData.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {activeSectionData.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-900 [&_*]:text-gray-900 [&_label]:text-gray-900 [&_p]:text-gray-900 [&_span]:text-gray-900 [&_input]:border-gray-300 [&_input]:border [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2 [&_select]:border-gray-300 [&_select]:border [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2 [&_textarea]:border-gray-300 [&_textarea]:border [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2">{activeSectionData.content}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Stacked Layout */
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg border-2 border-gray-300 bg-white shadow-sm p-6"
            >
              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex items-center gap-3">
                  {section.icon && (
                    <span className="text-2xl text-gray-900">{section.icon}</span>
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 font-heading">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-gray-900 [&_*]:text-gray-900 [&_label]:text-gray-900 [&_p]:text-gray-900 [&_span]:text-gray-900 [&_input]:border-gray-300 [&_input]:border [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2 [&_select]:border-gray-300 [&_select]:border [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2 [&_textarea]:border-gray-300 [&_textarea]:border [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2">{section.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      {showSaveButton && onSave && (
        <div className="flex justify-end pt-6 border-t border-gray-200">
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
