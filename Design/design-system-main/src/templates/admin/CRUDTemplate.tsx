/**
 * CRUD Template
 * Beauty Smile Design System
 *
 * Generic template for Create, Read, Update, Delete operations
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/utils/cn'

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'date'

export interface FormField {
  /**
   * Field identifier (used as key and name)
   */
  id: string
  /**
   * Field label
   */
  label: string
  /**
   * Field type
   * @default 'text'
   */
  type?: FieldType
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean
  /**
   * Field default value
   */
  defaultValue?: string | number
  /**
   * Custom validation function
   */
  validate?: (value: string | number) => string | null
}

export interface CRUDTemplateProps {
  /**
   * Form title
   * @default 'Formulário'
   */
  title?: string
  /**
   * Form description/subtitle
   */
  description?: string
  /**
   * Form fields configuration
   */
  fields: FormField[]
  /**
   * Mode: 'create', 'edit', or 'view'
   * @default 'create'
   */
  mode?: 'create' | 'edit' | 'view'
  /**
   * Initial form data (for edit mode)
   */
  initialData?: Record<string, string | number>
  /**
   * Save button text
   * @default 'Salvar'
   */
  saveButtonText?: string
  /**
   * Cancel button text
   * @default 'Cancelar'
   */
  cancelButtonText?: string
  /**
   * Delete button text
   * @default 'Deletar'
   */
  deleteButtonText?: string
  /**
   * Show delete button
   * @default false
   */
  showDeleteButton?: boolean
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Error message to display
   */
  errorMessage?: string
  /**
   * Success message to display
   */
  successMessage?: string
  /**
   * Callback when form is submitted
   */
  onSubmit?: (data: Record<string, string | number>) => void
  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void
  /**
   * Callback when delete is clicked
   */
  onDelete?: () => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * CRUD Template
 *
 * Generic template for Create, Read, Update, Delete operations with configurable form fields.
 *
 * @example
 * ```tsx
 * <CRUDTemplate
 *   title="Criar Usuário"
 *   mode="create"
 *   fields={[
 *     { id: 'name', label: 'Nome', type: 'text', required: true },
 *     { id: 'email', label: 'Email', type: 'email', required: true },
 *     { id: 'bio', label: 'Biografia', type: 'textarea' },
 *   ]}
 *   onSubmit={(data) => console.log('Submit:', data)}
 *   onCancel={() => console.log('Cancel')}
 * />
 * ```
 */
export const CRUDTemplate: React.FC<CRUDTemplateProps> = ({
  title = 'Formulário',
  description,
  fields,
  mode = 'create',
  initialData = {},
  saveButtonText = 'Salvar',
  cancelButtonText = 'Cancelar',
  deleteButtonText = 'Deletar',
  showDeleteButton = false,
  isLoading = false,
  errorMessage,
  successMessage,
  onSubmit,
  onCancel,
  onDelete,
  className,
}) => {
  const [formData, setFormData] = React.useState<Record<string, string | number>>(
    initialData
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const isViewMode = mode === 'view'

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      const value = formData[field.id]

      // Required validation
      if (field.required && (!value || value === '')) {
        newErrors[field.id] = `${field.label} é obrigatório`
        return
      }

      // Custom validation
      if (field.validate && value) {
        const error = field.validate(value)
        if (error) {
          newErrors[field.id] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit?.(formData)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? field.defaultValue ?? ''
    const error = errors[field.id]

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-error-600 ml-1">*</span>}
        </Label>

        {field.type === 'textarea' ? (
          <Textarea
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isViewMode || isLoading}
            required={field.required}
            className={cn(error && 'border-error-600 focus:ring-error-600')}
          />
        ) : (
          <Input
            id={field.id}
            name={field.id}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) =>
              handleFieldChange(
                field.id,
                field.type === 'number' ? Number(e.target.value) : e.target.value
              )
            }
            disabled={isViewMode || isLoading}
            required={field.required}
            className={cn(error && 'border-error-600 focus:ring-error-600')}
          />
        )}

        {error && <p className="text-sm text-error-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className={cn('max-w-2xl mx-auto p-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-sm text-neutral-600 mt-2">{description}</p>
          )}
        </CardHeader>

        <CardContent>
          {/* Success Message */}
          {successMessage && (
            <Alert variant="success" className="mb-6">
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">{fields.map(renderField)}</div>

            {/* Action Buttons */}
            {!isViewMode && (
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {showDeleteButton && onDelete && mode === 'edit' && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={onDelete}
                      disabled={isLoading}
                    >
                      {deleteButtonText}
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isLoading}
                    >
                      {cancelButtonText}
                    </Button>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {saveButtonText}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

CRUDTemplate.displayName = 'CRUDTemplate'
