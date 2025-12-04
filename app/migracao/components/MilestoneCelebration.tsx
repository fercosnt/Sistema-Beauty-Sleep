'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Trophy, PartyPopper, Sparkles } from 'lucide-react'

interface MilestoneCelebrationProps {
  percentualCompleto: number
  onClose?: () => void
}

export default function MilestoneCelebration({
  percentualCompleto,
  onClose,
}: MilestoneCelebrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [milestone, setMilestone] = useState<{
    message: string
    emoji: string
    color: string
  } | null>(null)

  useEffect(() => {
    checkMilestone(percentualCompleto)
  }, [percentualCompleto])

  const checkMilestone = (percentual: number) => {
    // Verificar se atingiu um marco (25%, 50%, 75%, 90%, 100%)
    const milestones = [
      { threshold: 100, message: '100% CONCLUÍDO!', emoji: '🎉🎊🎉', color: 'text-success-600' },
      { threshold: 90, message: '90% Concluído!', emoji: '🎊', color: 'text-success-600' },
      { threshold: 75, message: '75% Concluído!', emoji: '🎉', color: 'text-success-600' },
      { threshold: 50, message: '50% Concluído!', emoji: '🎉', color: 'text-primary-600' },
      { threshold: 25, message: '25% Concluído!', emoji: '📈', color: 'text-primary-600' },
    ]

    // Verificar se passou de algum marco
    for (const milestone of milestones) {
      if (percentual >= milestone.threshold) {
        // Verificar se já foi celebrado (usando localStorage)
        const lastCelebrated = localStorage.getItem(`milestone_${milestone.threshold}`)
        const currentPercentual = Math.floor(percentual)

        if (!lastCelebrated || parseInt(lastCelebrated) < currentPercentual) {
          setMilestone({
            message: milestone.message,
            emoji: milestone.emoji,
            color: milestone.color,
          })
          setIsOpen(true)
          localStorage.setItem(`milestone_${milestone.threshold}`, currentPercentual.toString())
          break
        }
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!milestone) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {percentualCompleto >= 100 ? (
                <Trophy className="h-12 w-12 text-yellow-500" />
              ) : (
                <Sparkles className="h-12 w-12 text-primary-600" />
              )}
            </div>
            <div className={`text-3xl font-bold ${milestone.color}`}>
              {milestone.emoji} {milestone.message} {milestone.emoji}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          {percentualCompleto >= 100 ? (
            <>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Parabéns a toda a equipe!
              </p>
              <p className="text-gray-600 mb-4">
                A migração de sessões foi concluída com sucesso! 🎊
              </p>
              <div className="flex items-center justify-center gap-2 text-4xl">
                <PartyPopper className="h-8 w-8 text-yellow-500" />
                <Sparkles className="h-8 w-8 text-yellow-500" />
                <PartyPopper className="h-8 w-8 text-yellow-500" />
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Excelente progresso!
              </p>
              <p className="text-gray-600">
                Vocês estão fazendo um trabalho incrível! Continue assim! 💪
              </p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentualCompleto}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {percentualCompleto.toFixed(1)}% completo
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

