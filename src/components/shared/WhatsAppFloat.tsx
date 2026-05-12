"use client";

import { MessageCircle } from "lucide-react";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export function WhatsAppFloat() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <button
      onClick={() =>
        openWhatsApp({
          customMessage:
            "Hola, me interesa obtener información sobre sus casas en venta.",
        })
      }
      className="fixed bottom-6 right-6 z-50 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-slow group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
    </button>
  );
}
