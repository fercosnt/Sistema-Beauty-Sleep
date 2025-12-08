'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { showSuccess, showError } from '@/components/ui/Toast'
import { startTour } from '@/components/OnboardingTour'
import ContentContainer from '@/components/ui/ContentContainer'
import { Lock, User, Mail, Shield, RefreshCw } from 'lucide-react'

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  // Format date to "Month Year" format
  const formatJoinedDate = (dateString: string | null | undefined) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // Get role display name
  const getRoleDisplayName = (role: string | null | undefined) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrador',
      equipe: 'Equipe Médica',
      recepcao: 'Recepção'
    }
    return roleMap[role || ''] || role || 'N/A'
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser?.email) {
          setUser(authUser)
          
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', authUser.email)
            .single()
          
          if (error) {
            console.error('Erro ao buscar dados do usuário:', error)
            showError('Erro ao carregar dados do perfil')
            return
          }
          
          if (data) {
            setUserData(data)
            setFormData({
              nome: data.nome || '',
              email: data.email || authUser.email || '',
            })
          }
        }
      } catch (error) {
        console.error('Erro inesperado:', error)
        showError('Erro inesperado ao carregar perfil')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  const handleSave = async () => {
    if (!user?.email) {
      showError('Usuário não encontrado')
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('users')
        .update({
          nome: formData.nome.trim() || null,
        })
        .eq('email', user.email)

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        showError('Erro ao salvar alterações')
        return
      }

      showSuccess('Perfil atualizado com sucesso!')
      // Recarregar dados
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      if (data) {
        setUserData(data)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao salvar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Validar campos
    const errors: Record<string, string> = {}
    
    if (!passwordData.oldPassword) {
      errors.oldPassword = 'Senha atual é obrigatória'
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Nova senha é obrigatória'
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'A senha deve ter pelo menos 6 caracteres'
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem'
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }
    
    setIsChangingPassword(true)
    setPasswordErrors({})
    
    try {
      const supabase = createClient()
      
      // Primeiro, verificar se a senha atual está correta fazendo login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.oldPassword,
      })
      
      if (signInError) {
        setPasswordErrors({ oldPassword: 'Senha atual incorreta' })
        setIsChangingPassword(false)
        return
      }
      
      // Se a senha atual está correta, atualizar para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })
      
      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError)
        showError('Erro ao alterar senha: ' + updateError.message)
        setIsChangingPassword(false)
        return
      }
      
      showSuccess('Senha alterada com sucesso!')
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao alterar senha')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleRefazerTour = () => {
    if (userData?.role) {
      startTour(userData.role as 'admin' | 'equipe' | 'recepcao')
    }
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-900">Carregando perfil...</p>
        </div>
      </ContentContainer>
    )
  }

  const userInitials = userData?.nome
    ? userData.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() || 'U'

  return (
    <ContentContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header - PublicProfileTemplate Style */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-600">
                    {userInitials}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-heading">
                  {userData?.nome || user?.email || 'Usuário'}
                </h1>

                <p className="text-lg text-neutral-600 mb-3">
                  {getRoleDisplayName(userData?.role)}
                </p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-neutral-500 mb-4">
                  {userData?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </span>
                  )}

                  {userData?.created_at && (
                    <span className="flex items-center gap-1">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Membro desde {formatJoinedDate(userData.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {userData?.role ? '1' : '0'}
              </p>
              <p className="text-sm text-neutral-600">Perfil</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {userData?.tour_completed ? '✓' : '○'}
              </p>
              <p className="text-sm text-neutral-600">Tour Completo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {userData?.ativo ? '✓' : '○'}
              </p>
              <p className="text-sm text-neutral-600">Status</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {getRoleDisplayName(userData?.role).charAt(0)}
              </p>
              <p className="text-sm text-neutral-600">Acesso</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome completo"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                Role
              </Label>
              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {userData?.role || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                disabled={isSaving || !formData.nome.trim()}
              >
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary-600" />
              Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Senha Atual</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  if (passwordErrors.oldPassword) {
                    setPasswordErrors({ ...passwordErrors, oldPassword: '' })
                  }
                }}
                placeholder="Digite sua senha atual"
                disabled={isChangingPassword}
                className={passwordErrors.oldPassword ? 'border-danger-500' : ''}
              />
              {passwordErrors.oldPassword && (
                <p className="text-xs text-danger-600">{passwordErrors.oldPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                  if (passwordErrors.newPassword) {
                    setPasswordErrors({ ...passwordErrors, newPassword: '' })
                  }
                }}
                placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                disabled={isChangingPassword}
                className={passwordErrors.newPassword ? 'border-danger-500' : ''}
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-danger-600">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors({ ...passwordErrors, confirmPassword: '' })
                  }
                }}
                placeholder="Confirme sua nova senha"
                disabled={isChangingPassword}
                className={passwordErrors.confirmPassword ? 'border-danger-500' : ''}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-danger-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleChangePassword}
                isLoading={isChangingPassword}
                disabled={
                  isChangingPassword ||
                  !passwordData.oldPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              >
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tour Guiado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary-600" />
              Tour Guiado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Revise o tour guiado para relembrar as funcionalidades do sistema e como utilizá-las.
            </p>
            <Button
              onClick={handleRefazerTour}
              variant="outline"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refazer Tour Guiado
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </ContentContainer>
  )
}

