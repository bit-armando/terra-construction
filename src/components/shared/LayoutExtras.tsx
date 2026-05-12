"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function LayoutExtras() {
  const pathname = usePathname();
  const isModelDetail = pathname?.startsWith("/modelos/");

  if (isModelDetail) return null;

  return (
    <>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
