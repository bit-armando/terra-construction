"use client";

import { useCallback } from "react";

interface WhatsAppMessage {
  modelName?: string;
  modelPrice?: number;
  development?: string;
  customMessage?: string;
}

const PHONE_NUMBER = "5214421234567";

export function useWhatsApp() {
  const getWhatsAppUrl = useCallback(
    (message?: WhatsAppMessage) => {
      let text = "Hola, me interesa obtener más información";

      if (message?.modelName) {
        text = `Hola, me interesa el modelo ${message.modelName}`;
        if (message.modelPrice) {
          text += ` de ${formatPrice(message.modelPrice)}`;
        }
        if (message.development) {
          text += ` en ${message.development}`;
        }
        text += ". ¿Podrían darme más información?";
      } else if (message?.customMessage) {
        text = message.customMessage;
      } else {
        text += " sobre sus casas en venta.";
      }

      return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
    },
    []
  );

  const openWhatsApp = useCallback(
    (message?: WhatsAppMessage) => {
      const url = getWhatsAppUrl(message);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [getWhatsAppUrl]
  );

  return { getWhatsAppUrl, openWhatsApp };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
}
