"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { LayoutExtras } from "./LayoutExtras";

export function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <LayoutExtras />
    </div>
  );
}
