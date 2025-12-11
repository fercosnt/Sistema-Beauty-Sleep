'use client'

import { useEffect } from 'react'

interface FaviconSwitcherProps {
  role: string | null
}

export default function FaviconSwitcher({ role }: FaviconSwitcherProps) {
  useEffect(() => {
    // Função para atualizar o favicon
    const updateFavicon = () => {
      if (typeof window === 'undefined' || !document.head) return

      try {
        // Remove todos os favicons existentes (incluindo os do metadata)
        const existingLinks = document.querySelectorAll(
          'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
        )
        existingLinks.forEach(link => {
          try {
            if (link.parentNode) {
              link.parentNode.removeChild(link)
            }
          } catch (e) {
            // Ignora erros ao remover links
          }
        })

        // Determina qual favicon usar
        const faviconPath = role === 'admin' 
          ? '/favicon-admin.svg' 
          : '/favicon-equipe.svg'

        // Adiciona timestamp para forçar recarregamento e evitar cache
        const timestamp = Date.now()
        const faviconUrl = `${faviconPath}?v=${timestamp}`

        // Cria novos links para o favicon
        const linkIcon = document.createElement('link')
        linkIcon.rel = 'icon'
        linkIcon.type = 'image/svg+xml'
        linkIcon.href = faviconUrl
        document.head.appendChild(linkIcon)

        const linkShortcut = document.createElement('link')
        linkShortcut.rel = 'shortcut icon'
        linkShortcut.type = 'image/svg+xml'
        linkShortcut.href = faviconUrl
        document.head.appendChild(linkShortcut)

        const linkApple = document.createElement('link')
        linkApple.rel = 'apple-touch-icon'
        linkApple.href = faviconUrl
        document.head.appendChild(linkApple)
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

