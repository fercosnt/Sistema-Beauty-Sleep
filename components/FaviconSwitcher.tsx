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

        // Remove todos os links de favicon existentes para evitar duplicatas
        const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
        existingIcons.forEach(link => link.remove())

        // Cria novos links com tamanhos específicos para melhor visibilidade
        const iconSizes = [
          { rel: 'icon', sizes: '32x32' },
          { rel: 'icon', sizes: '16x16' },
          { rel: 'icon', sizes: 'any' },
          { rel: 'shortcut icon' },
          { rel: 'apple-touch-icon', sizes: '180x180' },
        ]

        iconSizes.forEach(({ rel, sizes }) => {
          const link = document.createElement('link')
          link.rel = rel
          link.type = 'image/svg+xml'
          link.href = faviconUrl
          if (sizes) {
            link.setAttribute('sizes', sizes)
          }
          document.head.appendChild(link)
        })

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

