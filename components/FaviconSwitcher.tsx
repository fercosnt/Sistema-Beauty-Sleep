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
    // Função para atualizar o favicon de forma segura
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

        // Função auxiliar para remover elemento de forma segura
        const safeRemove = (element: Element | null) => {
          if (!element) return
          
          try {
            // Verifica se o elemento ainda está no DOM antes de remover
            if (element.isConnected && element.parentNode) {
              // Usa remove() que é mais seguro e moderno
              if (typeof element.remove === 'function') {
                element.remove()
              } else {
                // Fallback apenas se remove() não estiver disponível
                const parent = element.parentNode
                if (parent && parent.contains(element)) {
                  parent.removeChild(element)
                }
              }
            }
          } catch (error) {
            // Ignora erros silenciosamente - elemento pode já ter sido removido
          }
        }

        // Remove todos os links de favicon existentes de forma segura
        const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
        existingIcons.forEach((link) => {
          safeRemove(link)
        })

        // Aguarda um frame para garantir que a remoção foi processada
        requestAnimationFrame(() => {
          try {
            // Cria novos links com tamanhos específicos para melhor visibilidade
            const iconSizes = [
              { rel: 'icon', sizes: '32x32' },
              { rel: 'icon', sizes: '16x16' },
              { rel: 'icon', sizes: 'any' },
              { rel: 'shortcut icon' },
              { rel: 'apple-touch-icon', sizes: '180x180' },
            ]

            iconSizes.forEach(({ rel, sizes }) => {
              try {
                if (!document?.head) return
                
                const link = document.createElement('link')
                link.rel = rel
                link.type = 'image/svg+xml'
                link.href = faviconUrl
                if (sizes) {
                  link.setAttribute('sizes', sizes)
                }
                document.head.appendChild(link)
              } catch (error) {
                // Ignora erros ao criar links individuais
              }
            })
          } catch (error) {
            // Ignora erros ao criar novos links
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

