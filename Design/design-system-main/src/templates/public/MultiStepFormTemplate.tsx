/**
 * Multi-Step Form Template
 * Beauty Smile Design System
 *
 * Template for multi-step forms with stepper/wizard and progress visualization
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export interface FormStep {
  /**
   * Step identifier
   */
  id: string
  /**
   * Step label
   */
  label: string
  /**
   * Step description (optional)
   */
  description?: string
  /**
   * Step content (form fields, etc.)
   */
  content: React.ReactNode
  /**
   * Custom validation function
   */
  validate?: () => boolean | Promise<boolean>
}

export interface MultiStepFormTemplateProps {
  /**
   * Form title
   */
  title: string
  /**
   * Form steps
   */
  steps: FormStep[]
  /**
   * Initial step index
   * @default 0
   */
  initialStep?: number
  /**
   * Show progress bar
   * @default true
   */
  showProgress?: boolean
  /**
   * Next button text
   * @default 'Próximo'
   */
  nextButtonText?: string
  /**
   * Previous button text
   * @default 'Anterior'
   */
  previousButtonText?: string
  /**
   * Submit button text
   * @default 'Concluir'
   */
  submitButtonText?: string
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Callback when form is completed
   */
  onComplete?: () => void
  /**
   * Callback when step changes
   */
  onStepChange?: (stepIndex: number) => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Multi-Step Form Template
 *
 * Pre-built template for multi-step forms with stepper navigation and progress tracking.
 *
 * @example
 * ```tsx
 * <MultiStepFormTemplate
 *   title="Cadastro de Candidato"
 *   steps={[
 *     {
 *       id: 'personal',
 *       label: 'Dados Pessoais',
 *       content: <div>Personal info fields...</div>,
 *     },
 *     {
 *       id: 'contact',
 *       label: 'Contato',
 *       content: <div>Contact fields...</div>,
 *     },
 *     {
 *       id: 'review',
 *       label: 'Revisão',
 *       content: <div>Review data...</div>,
 *     },
 *   ]}
 *   onComplete={() => console.log('Form completed!')}
 * />
 * ```
 */
export const MultiStepFormTemplate: React.FC<MultiStepFormTemplateProps> = ({
  title,
  steps,
  initialStep = 0,
  showProgress = true,
  nextButtonText = 'Próximo',
  previousButtonText = 'Anterior',
  submitButtonText = 'Concluir',
  isLoading = false,
  onComplete,
  onStepChange,
  className,
}) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep)

  const activeStep = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    // Validate current step
    if (activeStep?.validate) {
      const isValid = await activeStep.validate()
      if (!isValid) return
    }

    if (isLastStep) {
      onComplete?.()
    } else {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange?.(nextStep)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }

  return (
    <div className={cn('max-w-3xl mx-auto p-6', className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-neutral-600">
              Etapa {currentStep + 1} de {steps.length}
            </p>
            <p className="text-sm font-medium text-neutral-600">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors mb-2',
                    index < currentStep
                      ? 'bg-accent text-white'
                      : index === currentStep
                        ? 'bg-accent text-white ring-4 ring-accent/20'
                        : 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p
                  className={cn(
                    'text-xs text-center font-medium',
                    index <= currentStep
                      ? 'text-neutral-900'
                      : 'text-neutral-500'
                  )}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 transition-colors',
                    index < currentStep ? 'bg-accent' : 'bg-neutral-200'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {activeStep?.description && (
            <p className="text-sm text-neutral-600 mt-2">
              {activeStep.description}
            </p>
          )}
        </CardHeader>

        <CardContent>
          {/* Step Content */}
          <div className="mb-6">{activeStep?.content}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep || isLoading}
            >
              {previousButtonText}
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLastStep ? submitButtonText : nextButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

MultiStepFormTemplate.displayName = 'MultiStepFormTemplate'
