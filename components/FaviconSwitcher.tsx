'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface FaviconSwitcherProps {
  role: string | null
}

export default function FaviconSwitcher({ role }: FaviconSwitcherProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Função para atualizar o favicon sem remover elementos
    const updateFavicon = () => {
      if (typeof window === 'undefined' || !document.head) return

      try {
        // Determina qual favicon usar
        const faviconPath = role === 'admin' 
          ? '/favicon-admin.svg' 
          : '/favicon-equipe.svg'

        // Adiciona timestamp e pathname para forçar recarregamento e evitar cache
        const timestamp = Date.now()
        const faviconUrl = `${faviconPath}?v=${timestamp}&p=${pathname}`

        // Atualiza ou cria link para icon
        let linkIcon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
        if (!linkIcon) {
          linkIcon = document.createElement('link')
          linkIcon.rel = 'icon'
          linkIcon.type = 'image/svg+xml'
          document.head.appendChild(linkIcon)
        }
        // Força atualização mesmo se o href for o mesmo
        linkIcon.href = ''
        linkIcon.href = faviconUrl

        // Atualiza ou cria link para shortcut icon
        let linkShortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement
        if (!linkShortcut) {
          linkShortcut = document.createElement('link')
          linkShortcut.rel = 'shortcut icon'
          linkShortcut.type = 'image/svg+xml'
          document.head.appendChild(linkShortcut)
        }
        linkShortcut.href = ''
        linkShortcut.href = faviconUrl

        // Atualiza ou cria link para apple-touch-icon
        let linkApple = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
        if (!linkApple) {
          linkApple = document.createElement('link')
          linkApple.rel = 'apple-touch-icon'
          document.head.appendChild(linkApple)
        }
        linkApple.href = ''
        linkApple.href = faviconUrl

        // Força o navegador a recarregar o favicon
        // Alguns navegadores precisam disso para atualizar
        const faviconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
        faviconLinks.forEach((link) => {
          const linkEl = link as HTMLLinkElement
          const originalHref = linkEl.href
          linkEl.href = ''
          setTimeout(() => {
            linkEl.href = originalHref
          }, 10)
        })
      } catch (error) {
        // Silenciosamente ignora erros
        console.warn('Erro ao atualizar favicon:', error)
      }
    }

    // Executa imediatamente
    updateFavicon()

    // Executa após delays para garantir que funcione em todos os navegadores
    const timeoutId1 = setTimeout(updateFavicon, 50)
    const timeoutId2 = setTimeout(updateFavicon, 200)
    const timeoutId3 = setTimeout(updateFavicon, 500)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
    }
  }, [role, pathname]) // Adiciona pathname como dependência para atualizar ao navegar

  return null
}

