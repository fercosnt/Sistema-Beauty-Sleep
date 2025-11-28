import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { getUserRole } from "@/lib/utils/get-user-role";
import { MobileMenuProvider } from "@/components/providers/MobileMenuProvider";
import MobileLayoutClient from "@/components/MobileLayoutClient";
import ToastContainer from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Beauty Sleep - Sistema de Tratamento",
  description: "Sistema de gestão de tratamento de ronco e apneia",
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
        <ToastContainer />
        {userRole ? (
          <MobileMenuProvider>
            <MobileLayoutClient userRole={userRole}>
              {children}
            </MobileLayoutClient>
          </MobileMenuProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}

