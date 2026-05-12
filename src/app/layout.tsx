import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GlobalShell } from "@/components/shared/GlobalShell";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terra Construction | Casas en Querétaro y San Juan del Río",
  description:
    "Encuentra tu casa ideal en Querétaro. Modelos desde $1,190,000 MXN. Créditos INFONAVIT, FOVISSSTE y bancarios. Más de 10 años construyendo hogares.",
  keywords: [
    "casas en queretaro",
    "casas en san juan del rio",
    "casa credito infonavit",
    "constructora queretaro",
    "casas preventa queretaro",
  ],
  openGraph: {
    title: "Terra Construction | Tu nueva casa te está esperando",
    description: "Casas desde $1,190,000 MXN en Querétaro y San Juan del Río",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  );
}
