'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Calendar, User, FileText, RefreshCw, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ContentContainer from '@/components/ui/ContentContainer'
import { showError } from '@/components/ui/Toast'

interface AuditLog {
  id: string
  user_id: string | null
  acao: 'INSERT' | 'UPDATE' | 'DELETE'
  entidade: string
  entidade_id: string | null
  detalhes: any
  created_at: string
  users?: {
    nome: string
    email: string
  } | null
}

interface RelatedData {
  paciente?: { id: string; nome: string; cpf: string } | null
  usuario?: { id: string; nome: string; email: string } | null
}

export default function LogDetalhesClient({ logId }: { logId: string }) {
  const router = useRouter()
  const [log, setLog] = useState<AuditLog | null>(null)
  const [relatedData, setRelatedData] = useState<RelatedData>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logId])

  const fetchRelatedData = async (logData: any, supabase: any) => {
    const related: RelatedData = {}

    // Buscar dados do paciente se houver paciente_id nos detalhes
    const detalhes = logData.detalhes
    let pacienteId = null

    if (detalhes?.paciente_id) {
      pacienteId = detalhes.paciente_id
    } else if (detalhes?.old?.paciente_id) {
      pacienteId = detalhes.old.paciente_id
    } else if (detalhes?.new?.paciente_id) {
      pacienteId = detalhes.new.paciente_id
    }

    if (pacienteId) {
      const { data: pacienteData } = await supabase
        .from('pacientes')
        .select('id, nome, cpf')
        .eq('id', pacienteId)
        .single()

      if (pacienteData) {
        related.paciente = pacienteData
      }
    }

    // Buscar dados do usuário se houver user_id nos detalhes
    let userId = null
    if (detalhes?.user_id) {
      userId = detalhes.user_id
    } else if (detalhes?.old?.user_id) {
      userId = detalhes.old.user_id
    } else if (detalhes?.new?.user_id) {
      userId = detalhes.new.user_id
    }

    if (userId && userId !== logData.user_id) {
      const { data: userData } = await supabase
        .from('users')
        .select('id, nome, email')
        .eq('id', userId)
        .single()

      if (userData) {
        related.usuario = userData
      }
    }

    setRelatedData(related)
  }

  const fetchLog = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, user_id, acao, entidade, entidade_id, detalhes, created_at')
        .eq('id', logId)
        .single()

      if (error) {
        console.error('Erro ao buscar log:', error)
        showError('Erro ao carregar detalhes do log')
        return
      }

      if (!data) {
        showError('Log não encontrado')
        router.push('/logs')
        return
      }

      // Buscar dados do usuário se houver
      if (data.user_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, nome, email')
          .eq('id', data.user_id)
          .single()

        if (userData) {
          setLog({
            ...data,
            users: { nome: userData.nome, email: userData.email },
          })
          setRelatedData((prev) => ({ ...prev, usuario: userData }))
        } else {
          setLog({ ...data, users: null })
        }
      } else {
        setLog({ ...data, users: null })
      }

      // Buscar dados relacionados baseado na entidade
      await fetchRelatedData(data, supabase)
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao carregar log')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const formatAction = (acao: string) => {
    const actions: Record<string, string> = {
      INSERT: 'Criar',
      UPDATE: 'Atualizar',
      DELETE: 'Deletar',
    }
    return actions[acao] || acao
  }

  const getActionColor = (acao: string) => {
    const colors: Record<string, string> = {
      INSERT: 'bg-success-100 text-success-800 border-success-200',
      UPDATE: 'bg-warning-100 text-warning-800 border-warning-200',
      DELETE: 'bg-danger-100 text-danger-800 border-danger-200',
    }
    return colors[acao] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Mapeamento de nomes de campos técnicos para nomes amigáveis
  const getFieldLabel = (key: string): { label: string; description?: string } => {
    const fieldMap: Record<string, { label: string; description?: string }> = {
      id: { label: 'ID do Registro' },
      paciente_id: { label: 'ID do Paciente', description: 'Identificador único do paciente no sistema' },
      user_id: { label: 'ID do Usuário', description: 'Identificador do usuário que realizou a ação' },
      contador_pulsos_inicial: {
        label: 'Contador de Pulsos Inicial',
        description: 'Número inicial de pulsos do aparelho antes da sessão de tratamento',
      },
      contador_pulsos_final: {
        label: 'Contador de Pulsos Final',
        description: 'Número final de pulsos do aparelho após a sessão de tratamento',
      },
      data_sessao: { label: 'Data da Sessão', description: 'Data em que a sessão de tratamento foi realizada' },
      protocolo: {
        label: 'Protocolo de Tratamento',
        description: 'Lista de protocolos ou tags aplicados na sessão (ex: Atropina, etc.)',
      },
      observacoes: { label: 'Observações', description: 'Anotações e observações sobre a sessão' },
      editado_por: { label: 'Editado Por', description: 'Usuário que realizou a última edição deste registro' },
      editado_em: { label: 'Data da Edição', description: 'Data e hora em que o registro foi editado pela última vez' },
      created_at: { label: 'Data de Criação', description: 'Data e hora em que o registro foi criado' },
      updated_at: { label: 'Data de Atualização', description: 'Data e hora da última atualização do registro' },
      nome: { label: 'Nome' },
      cpf: { label: 'CPF', description: 'Cadastro de Pessoa Física' },
      email: { label: 'E-mail' },
      telefone: { label: 'Telefone' },
      data_nascimento: { label: 'Data de Nascimento' },
      genero: { label: 'Gênero' },
      status: { label: 'Status', description: 'Status atual do paciente (Lead, Ativo, Finalizado, Inativo)' },
      biologix_id: { label: 'ID do Biologix', description: 'Identificador único do paciente no sistema Biologix' },
      biologix_exam_id: { label: 'ID do Exame Biologix' },
      biologix_exam_key: { label: 'Chave do Exame Biologix' },
      tipo: { label: 'Tipo', description: 'Tipo de exame (0 = Ronco, 1 = Sono)' },
      data_exame: { label: 'Data do Exame' },
      peso_kg: { label: 'Peso (kg)' },
      altura_cm: { label: 'Altura (cm)' },
      imc: { label: 'IMC', description: 'Índice de Massa Corporal' },
      score_ronco: { label: 'Score de Ronco', description: 'Pontuação calculada do ronco' },
      ido: { label: 'IDO', description: 'Índice de Dessaturação de Oxigênio' },
      ido_categoria: { label: 'Categoria IDO', description: 'Classificação do IDO (0=Normal, 1=Leve, 2=Moderado, 3=Acentuado)' },
      spo2_min: { label: 'SpO2 Mínimo', description: 'Saturação de oxigênio mínima registrada' },
      spo2_avg: { label: 'SpO2 Médio', description: 'Saturação de oxigênio média' },
      spo2_max: { label: 'SpO2 Máximo', description: 'Saturação de oxigênio máxima registrada' },
      sessoes_compradas: { label: 'Sessões Compradas', description: 'Quantidade de sessões de tratamento compradas pelo paciente' },
      sessoes_adicionadas: { label: 'Sessões Adicionadas', description: 'Quantidade de sessões adicionadas manualmente' },
      sessoes_utilizadas: { label: 'Sessões Utilizadas', description: 'Quantidade de sessões já realizadas' },
      proxima_manutencao: { label: 'Próxima Manutenção', description: 'Data prevista para a próxima manutenção do tratamento' },
      observacoes_gerais: { label: 'Observações Gerais', description: 'Observações e anotações gerais sobre o paciente' },
    }

    return fieldMap[key] || { label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }
  }

  const formatValue = (value: any, key?: string): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
    if (Array.isArray(value)) {
      if (value.length === 0) return '(vazio)'
      return value.join(', ')
    }
    if (typeof value === 'object') {
      // Se for um objeto simples, tentar formatar melhor
      if (Object.keys(value).length === 0) return '(objeto vazio)'
      return JSON.stringify(value, null, 2)
    }
    if (typeof value === 'string') {
      // Formatar datas
      if (key?.includes('data') || key?.includes('created') || key?.includes('updated') || key?.includes('editado')) {
        try {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            return date.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }
        } catch {
          // Se não for data válida, continuar
        }
      }
      if (value.length > 200) return value.substring(0, 200) + '...'
    }
    return String(value)
  }

  const shouldShowField = (key: string, value: any): boolean => {
    // Ocultar campos técnicos desnecessários ou sempre null
    const hiddenFields = ['id', 'created_at', 'updated_at']
    if (hiddenFields.includes(key) && value === null) return false
    return true
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-600 mr-2" />
              <p className="text-gray-900">Carregando detalhes do log...</p>
            </div>
          </CardContent>
        </Card>
      </ContentContainer>
    )
  }

  if (!log) {
    return (
      <ContentContainer>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Log não encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">O log solicitado não foi encontrado no sistema.</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => router.push('/logs')}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Voltar para Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </ContentContainer>
    )
  }

  const isUpdate = log.acao === 'UPDATE' && log.detalhes?.old && log.detalhes?.new
  const isInsert = log.acao === 'INSERT'
  const isDelete = log.acao === 'DELETE'

  return (
    <ContentContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/logs')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="mb-4"
        >
          Voltar para Logs
        </Button>
        <h1 className="text-3xl font-bold text-white font-heading">Detalhes do Log</h1>
        <p className="mt-2 text-white">Visualize todas as informações sobre esta ação de auditoria</p>
      </div>

      <div className="space-y-6">
        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data/Hora</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(log.created_at)}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usuário</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  {log.users ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.users.nome}</p>
                      <p className="text-xs text-gray-500">{log.users.email}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Sistema</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ação</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(
                      log.acao
                    )}`}
                  >
                    {formatAction(log.acao)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entidade</label>
                <p className="text-sm font-medium text-gray-900 mt-1">{log.entidade}</p>
              </div>
              {log.entidade_id && (
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID da Entidade</label>
                  <p className="text-xs font-mono text-gray-600 mt-1 bg-gray-50 p-2 rounded border">
                    {log.entidade_id}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Ação */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ação</CardTitle>
          </CardHeader>
          <CardContent>
            {isUpdate ? (
              <div className="space-y-4">
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-warning-800 mb-2">
                    Esta ação atualizou {Object.keys(log.detalhes.old).length} campo(s)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Anterior
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Novo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(log.detalhes.new)
                        .filter((key) => shouldShowField(key, log.detalhes.new[key]))
                        .map((key) => {
                          const oldValue = log.detalhes.old[key]
                          const newValue = log.detalhes.new[key]
                          const changed = oldValue !== newValue
                          const fieldInfo = getFieldLabel(key)
                          const isLinkField = key === 'paciente_id' && relatedData.paciente

                          return (
                            <tr key={key} className={changed ? 'bg-warning-50' : ''}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                <div className="flex items-start gap-2">
                                  <div>
                                    <div className="font-semibold">{fieldInfo.label}</div>
                                    {fieldInfo.description && (
                                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                        <Info className="h-3 w-3" />
                                        {fieldInfo.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {isLinkField && oldValue === relatedData.paciente?.id ? (
                                  <Link
                                    href={`/pacientes/${oldValue}`}
                                    className="text-primary-600 hover:text-primary-800 underline"
                                  >
                                    {relatedData.paciente.nome} ({relatedData.paciente.cpf})
                                  </Link>
                                ) : (
                                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded border max-w-md overflow-auto">
                                    {formatValue(oldValue, key)}
                                  </pre>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {isLinkField && newValue === relatedData.paciente?.id ? (
                                  <Link
                                    href={`/pacientes/${newValue}`}
                                    className="text-primary-600 hover:text-primary-800 underline"
                                  >
                                    {relatedData.paciente.nome} ({relatedData.paciente.cpf})
                                  </Link>
                                ) : (
                                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded border max-w-md overflow-auto">
                                    {formatValue(newValue, key)}
                                  </pre>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : isInsert ? (
              <div className="space-y-4">
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-success-800">
                    Este registro foi criado com {Object.keys(log.detalhes).filter((k) => shouldShowField(k, log.detalhes[k])).length} campo(s)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(log.detalhes)
                    .filter(([key, value]) => shouldShowField(key, value))
                    .map(([key, value]) => {
                      const fieldInfo = getFieldLabel(key)
                      const isLinkField = key === 'paciente_id' && relatedData.paciente

                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                {fieldInfo.label}
                              </label>
                              {fieldInfo.description && (
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  {fieldInfo.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {isLinkField && String(value) === relatedData.paciente?.id ? (
                            <Link
                              href={`/pacientes/${value}`}
                              className="text-primary-600 hover:text-primary-800 underline font-medium"
                            >
                              {relatedData.paciente.nome} ({relatedData.paciente.cpf})
                            </Link>
                          ) : (
                            <pre className="mt-1 text-sm font-mono text-gray-900 whitespace-pre-wrap break-words bg-gray-50 p-2 rounded border">
                              {formatValue(value, key)}
                            </pre>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            ) : isDelete ? (
              <div className="space-y-4">
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-danger-800">
                    Este registro foi deletado. Abaixo estão os dados que foram removidos:
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(log.detalhes)
                    .filter(([key, value]) => shouldShowField(key, value))
                    .map(([key, value]) => {
                      const fieldInfo = getFieldLabel(key)
                      const isLinkField = key === 'paciente_id' && relatedData.paciente

                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                {fieldInfo.label}
                              </label>
                              {fieldInfo.description && (
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  {fieldInfo.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {isLinkField && String(value) === relatedData.paciente?.id ? (
                            <Link
                              href={`/pacientes/${value}`}
                              className="text-primary-600 hover:text-primary-800 underline font-medium"
                            >
                              {relatedData.paciente.nome} ({relatedData.paciente.cpf})
                            </Link>
                          ) : (
                            <pre className="mt-1 text-sm font-mono text-gray-900 whitespace-pre-wrap break-words bg-gray-50 p-2 rounded border">
                              {formatValue(value, key)}
                            </pre>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-sm font-mono text-gray-900 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(log.detalhes, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentContainer>
  )
}

