'use client'

import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { useMobileMenu } from "@/components/providers/MobileMenuProvider";

interface MobileLayoutClientProps {
  children: React.ReactNode;
  userRole: string | null;
}

export default function MobileLayoutClient({ children, userRole }: MobileLayoutClientProps) {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - visible on desktop, overlay on mobile */}
      <Sidebar
        userRole={userRole}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-0">
        {/* Header - only show if user is authenticated */}
        <Header
          userRole={userRole}
          onMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

