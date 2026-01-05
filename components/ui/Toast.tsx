'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastId = 0
const listeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function addToast(message: string, type: ToastType) {
  const id = `toast-${toastId++}`
  const newToast: Toast = { id, message, type }
  toasts = [...toasts, newToast]
  listeners.forEach((listener) => listener(toasts))

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  listeners.forEach((listener) => listener(toasts))
}

export function showToast(message: string, type: ToastType = 'info') {
  addToast(message, type)
}

export function showSuccess(message: string) {
  showToast(message, 'success')
}

export function showError(message: string) {
  showToast(message, 'error')
}

export function showInfo(message: string) {
  showToast(message, 'info')
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }
    listeners.push(listener)
    setCurrentToasts(toasts)

    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-2 pointer-events-none">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl min-w-[300px] max-w-md animate-in slide-in-from-top-5 pointer-events-auto ${
            toast.type === 'success'
              ? 'bg-success-50 text-success-800 border border-success-200'
              : toast.type === 'error'
              ? 'bg-error-50 text-error-800 border border-error-200' // Usando error do Design System
              : 'bg-primary-50 text-primary-800 border border-primary-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 flex-shrink-0" />}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

