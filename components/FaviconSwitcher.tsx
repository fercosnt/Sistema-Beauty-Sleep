'use client'

import { useEffect } from 'react'

interface FaviconSwitcherProps {
  role: string | null
}

export default function FaviconSwitcher({ role }: FaviconSwitcherProps) {
  useEffect(() => {
    // Função para atualizar o favicon
    const updateFavicon = () => {
      if (typeof window === 'undefined') return

      // Remove todos os favicons existentes (incluindo os do metadata)
      const existingLinks = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel*="icon"]'
      )
      existingLinks.forEach(link => link.remove())

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

      // Força atualização do favicon (alguns navegadores precisam disso)
      // Tenta atualizar o favicon existente primeiro
      const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (existingFavicon) {
        existingFavicon.href = faviconUrl + '&force=' + Math.random()
      }

      // Força o navegador a recarregar o favicon
      const img = document.createElement('img')
      img.src = faviconUrl
      img.style.display = 'none'
      document.body.appendChild(img)
      setTimeout(() => document.body.removeChild(img), 100)
    }

    // Executa imediatamente
    updateFavicon()

    // Também executa após delays para garantir que o DOM está pronto
    const timeoutId1 = setTimeout(updateFavicon, 50)
    const timeoutId2 = setTimeout(updateFavicon, 200)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [role])

  return null
}

