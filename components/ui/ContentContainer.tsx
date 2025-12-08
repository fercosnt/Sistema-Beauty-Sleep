'use client'

import { useSidebar } from '@/components/providers/SidebarProvider'
import { cn } from '@/utils/cn'

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ContentContainer({ children, className }: ContentContainerProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={cn(
      "pl-8 pr-4 md:pl-12 md:pr-8 pt-8 pb-4 md:pb-8",
      className
    )}>
      {children}
    </div>
  )
}

