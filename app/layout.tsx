import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { getUserRole } from "@/lib/utils/get-user-role";
import { MobileMenuProvider } from "@/components/providers/MobileMenuProvider";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import MobileLayoutClient from "@/components/MobileLayoutClient";
import ToastContainer from "@/components/ui/Toast";
import FaviconSwitcher from "@/components/FaviconSwitcher";

export const metadata: Metadata = {
  title: "Beauty Sleep - Sistema de Tratamento",
  description: "Sistema de gestão de tratamento de ronco e apneia",
  icons: {
    icon: "/favicon-equipe.svg", // Favicon padrão (será substituído dinamicamente pelo FaviconSwitcher)
    shortcut: "/favicon-equipe.svg",
    apple: "/favicon-equipe.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();

  return (
    <html lang="pt-BR">
      <body>
        <FaviconSwitcher role={userRole} />
        <ToastContainer />
        {userRole ? (
          <SidebarProvider>
            <MobileMenuProvider>
              <MobileLayoutClient userRole={userRole}>
                {children}
              </MobileLayoutClient>
            </MobileMenuProvider>
          </SidebarProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}

