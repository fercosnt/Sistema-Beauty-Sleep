import type { Metadata } from "next";
import ToastContainer from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Dashboard - Beauty Sleep",
  description: "Dashboard do sistema Beauty Sleep",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // O DashboardAdminTemplate já tem sua própria sidebar e header
  // O MobileLayoutClient não renderiza nada quando pathname === '/dashboard'
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}

