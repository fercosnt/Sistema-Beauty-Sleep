/**
 * Mobile Detection Hook
 * Beauty Smile Design System
 *
 * Detects if the current viewport is mobile size
 */

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768 // md breakpoint

/**
 * Hook to detect if viewport is mobile size
 *
 * @returns true if viewport width is less than 768px (md breakpoint)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileView /> : <DesktopView />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
