'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { showSuccess, showError } from '@/components/ui/Toast'
import { startTour } from '@/components/OnboardingTour'
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
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-900">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="mt-2 text-gray-600">Gerencie suas informações pessoais e configurações</p>
      </div>

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
  )
}

