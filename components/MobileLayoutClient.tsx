'use client'

import { usePathname } from 'next/navigation'
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { useMobileMenu } from "@/components/providers/MobileMenuProvider";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { cn } from "@/utils/cn";

interface MobileLayoutClientProps {
  children: React.ReactNode;
  userRole: string | null;
}

export default function MobileLayoutClient({ children, userRole }: MobileLayoutClientProps) {
  const pathname = usePathname()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();
  const { isCollapsed } = useSidebar();

  // Dashboard usa seu próprio template, mas precisa estar acima da sidebar
  if (pathname === '/dashboard') {
    return (
      <div className="relative z-[70]">
        {children}
      </div>
    )
  }

  // Determinar background baseado no role do usuário
  // Verificação estrita: apenas 'admin' (case-sensitive) é considerado admin
  const isAdmin = userRole?.toLowerCase() === 'admin'
  const backgroundImage = isAdmin 
    ? '/68a4d045b130b34b3614881d.jpeg'
    : '/68a4d05373c7b3161e742edd.png'

  return (
    <div 
      className="flex h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sidebar - visible on desktop, overlay on mobile */}
      <Sidebar
        userRole={userRole}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      {/* Main content - margin matches sidebar width exactly, no extra spacing */}
      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all duration-300 relative z-[70]",
        isCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {/* Header - only show if user is authenticated */}
        <Header
          userRole={userRole}
          onMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-[70]">
          {children}
        </main>
      </div>
    </div>
  );
}

