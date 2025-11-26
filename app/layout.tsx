import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { getUserRole } from "@/lib/utils/get-user-role";
import { MobileMenuProvider } from "@/components/providers/MobileMenuProvider";
import MobileLayoutClient from "@/components/MobileLayoutClient";
import ToastContainer from "@/components/ui/Toast";
=======
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

export const metadata: Metadata = {
  title: "Beauty Sleep - Sistema de Tratamento",
  description: "Sistema de gestão de tratamento de ronco e apneia",
};

<<<<<<< HEAD
export default async function RootLayout({
=======
export default function RootLayout({
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
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
=======
  return (
    <html lang="pt-BR">
      <body>{children}</body>
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
    </html>
  );
}

