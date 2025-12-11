'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface FaviconSwitcherProps {
  role: string | null
}

export default function FaviconSwitcher({ role }: FaviconSwitcherProps) {
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Função para atualizar o favicon SEM remover elementos
    const updateFavicon = () => {
      if (typeof window === 'undefined' || !document?.head) return

      try {
        // Determina qual favicon usar
        const faviconPath = role === 'admin' 
          ? '/favicon-admin.svg' 
          : '/favicon-equipe.svg'

        // Adiciona timestamp e pathname para forçar recarregamento e evitar cache
        const timestamp = Date.now()
        const faviconUrl = `${faviconPath}?v=${timestamp}&p=${pathname}`

        // Define os tipos de favicon que precisamos
        const iconConfigs = [
          { rel: 'icon', sizes: '32x32' },
          { rel: 'icon', sizes: '16x16' },
          { rel: 'icon', sizes: 'any' },
          { rel: 'shortcut icon' },
          { rel: 'apple-touch-icon', sizes: '180x180' },
        ]

        // Atualiza ou cria cada tipo de favicon
        iconConfigs.forEach(({ rel, sizes }) => {
          try {
            if (!document?.head) return

            // Procura por um link existente com o mesmo rel e sizes
            const selector = sizes 
              ? `link[rel="${rel}"][sizes="${sizes}"]`
              : `link[rel="${rel}"]`
            
            let existingLink = document.querySelector(selector) as HTMLLinkElement

            if (existingLink) {
              // Se existe, apenas atualiza o href (evita removeChild completamente)
              existingLink.href = faviconUrl
            } else {
              // Se não existe, cria um novo
              const link = document.createElement('link')
              link.rel = rel
              link.type = 'image/svg+xml'
              link.href = faviconUrl
              if (sizes) {
                link.setAttribute('sizes', sizes)
              }
              document.head.appendChild(link)
            }
          } catch (error) {
            // Ignora erros silenciosamente
          }
        })
      } catch (error) {
        // Silenciosamente ignora erros gerais
      }
    }

    // Limpa timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Executa após um pequeno delay para garantir que o DOM está pronto
    timeoutRef.current = setTimeout(updateFavicon, 100)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [role, pathname])

  return null
}

