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
    icon: [
      { url: "/favicon-equipe.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon-equipe.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-equipe.svg", sizes: "16x16", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-equipe.svg",
    apple: [
      { url: "/favicon-equipe.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();

  return (
    <html lang="pt-BR" className={userRole === 'admin' ? 'theme-admin' : 'theme-equipe'}>
      <body className={userRole === 'admin' ? 'theme-admin' : 'theme-equipe'}>
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

