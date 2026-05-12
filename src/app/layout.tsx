import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Integraciones Templer | Casas en Querétaro y San Juan del Río",
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
    title: "Integraciones Templer | Tu nueva casa te está esperando",
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
    <html lang="es-MX" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
