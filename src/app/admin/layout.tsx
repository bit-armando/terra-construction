"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const { isAuth, logout } = useAdminAuth({ redirectOnFail: !isLoginPage });

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isAuth === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
