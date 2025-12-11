'use client'

import { useEffect } from 'react'

interface FaviconSwitcherProps {
  role: string | null
}

export default function FaviconSwitcher({ role }: FaviconSwitcherProps) {
  useEffect(() => {
    // Função para atualizar o favicon sem remover elementos
    const updateFavicon = () => {
      if (typeof window === 'undefined' || !document.head) return

      try {
        // Determina qual favicon usar
        const faviconPath = role === 'admin' 
          ? '/favicon-admin.svg' 
          : '/favicon-equipe.svg'

        // Adiciona timestamp para forçar recarregamento e evitar cache
        const timestamp = Date.now()
        const faviconUrl = `${faviconPath}?v=${timestamp}`

        // Atualiza ou cria link para icon
        let linkIcon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
        if (!linkIcon) {
          linkIcon = document.createElement('link')
          linkIcon.rel = 'icon'
          linkIcon.type = 'image/svg+xml'
          document.head.appendChild(linkIcon)
        }
        linkIcon.href = faviconUrl

        // Atualiza ou cria link para shortcut icon
        let linkShortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement
        if (!linkShortcut) {
          linkShortcut = document.createElement('link')
          linkShortcut.rel = 'shortcut icon'
          linkShortcut.type = 'image/svg+xml'
          document.head.appendChild(linkShortcut)
        }
        linkShortcut.href = faviconUrl

        // Atualiza ou cria link para apple-touch-icon
        let linkApple = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
        if (!linkApple) {
          linkApple = document.createElement('link')
          linkApple.rel = 'apple-touch-icon'
          document.head.appendChild(linkApple)
        }
        linkApple.href = faviconUrl
      } catch (error) {
        // Silenciosamente ignora erros
        console.warn('Erro ao atualizar favicon:', error)
      }
    }

    // Executa após um pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(updateFavicon, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [role])

  return null
}

