/**
 * Profile Template
 * Beauty Smile Design System
 *
 * Template for user profile pages with avatar, info, and edit capabilities
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Label } from '../../components/ui/Label'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../utils/cn'

export interface ProfileData {
  /**
   * User's full name
   */
  name: string
  /**
   * User's email
   */
  email: string
  /**
   * User's role/position
   */
  role?: string
  /**
   * User's department
   */
  department?: string
  /**
   * User's phone number
   */
  phone?: string
  /**
   * User's bio/description
   */
  bio?: string
  /**
   * User's avatar URL
   */
  avatar?: string
  /**
   * User's status
   */
  status?: {
    label: string
    variant?: 'default' | 'success' | 'warning' | 'error'
  }
}

export interface ProfileTemplateProps {
  /**
   * Profile data
   */
  profile: ProfileData
  /**
   * Whether in edit mode
   * @default false
   */
  isEditMode?: boolean
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Additional profile fields to display
   */
  customFields?: Array<{
    label: string
    value: React.ReactNode
  }>
  /**
   * Callback when edit button is clicked
   */
  onEdit?: () => void
  /**
   * Callback when save button is clicked
   */
  onSave?: (data: Partial<ProfileData>) => void
  /**
   * Callback when cancel button is clicked
   */
  onCancel?: () => void
  /**
   * Callback when avatar change is requested
   */
  onAvatarChange?: (file: File) => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Profile Template
 *
 * Pre-built template for user profile pages with view and edit modes.
 *
 * @example
 * ```tsx
 * <ProfileTemplate
 *   profile={{
 *     name: 'João Silva',
 *     email: 'joao@example.com',
 *     role: 'Desenvolvedor Full Stack',
 *     department: 'TI',
 *     phone: '(11) 99999-9999',
 *     bio: 'Desenvolvedor com 5 anos de experiência...',
 *     avatar: 'https://...',
 *     status: { label: 'Ativo', variant: 'success' }
 *   }}
 *   onEdit={() => setEditMode(true)}
 *   onSave={(data) => console.log('Save:', data)}
 * />
 * ```
 */
export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  profile,
  isEditMode = false,
  isLoading = false,
  customFields = [],
  onEdit,
  onSave,
  onCancel,
  onAvatarChange,
  className,
}) => {
  const [formData, setFormData] = React.useState<Partial<ProfileData>>(profile)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  const handleAvatarClick = () => {
    if (isEditMode && !isLoading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarChange?.(file)
    }
  }

  return (
    <div className={cn('p-6 space-y-6 max-w-4xl mx-auto', className)}>
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className={cn(
                  'w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg',
                  isEditMode && !isLoading && 'cursor-pointer hover:opacity-80 transition-opacity'
                )}
              >
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600">
                      {formData.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!isEditMode || isLoading}
              />
              {isEditMode && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-neutral-900">
                  {formData.name}
                </h1>
                {profile.status && (
                  <Badge variant={profile.status.variant || 'default'}>
                    {profile.status.label}
                  </Badge>
                )}
              </div>
              {formData.role && (
                <p className="text-lg text-neutral-600">{formData.role}</p>
              )}
              {formData.department && (
                <p className="text-sm text-neutral-500 mt-1">
                  {formData.department}
                </p>
              )}

              {!isEditMode && onEdit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onEdit}
                  className="mt-4"
                  disabled={isLoading}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                {isEditMode ? (
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                ) : (
                  <p className="text-base text-neutral-900">{formData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditMode ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                ) : (
                  <p className="text-base text-neutral-900">{formData.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                {isEditMode ? (
                  <Input
                    id="role"
                    value={formData.role || ''}
                    onChange={(e) => handleChange('role', e.target.value)}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-base text-neutral-900">{formData.role || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {isEditMode ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-base text-neutral-900">{formData.phone || '-'}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              {isEditMode ? (
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
              ) : (
                <p className="text-base text-neutral-900 whitespace-pre-wrap">
                  {formData.bio || '-'}
                </p>
              )}
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && !isEditMode && (
              <div className="pt-6 border-t space-y-4">
                {customFields.map((field, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium text-neutral-600">
                      {field.label}
                    </p>
                    <div className="text-base text-neutral-900">{field.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {isEditMode && (
              <div className="flex justify-end gap-3 pt-6 border-t">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Salvar Alterações
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

ProfileTemplate.displayName = 'ProfileTemplate'
