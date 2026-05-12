"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/hooks/useWhatsApp";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#modelos", label: "Modelos" },
  { href: "#desarrollos", label: "Desarrollos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">TC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-brand-900 leading-tight">
                TERRA
              </h1>
              <p className="text-[10px] tracking-[0.3em] text-brand-600 uppercase -mt-1">
                Construction
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-brand-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="default"
              className="bg-whatsapp hover:bg-whatsapp-dark text-white gap-2"
              onClick={() =>
                openWhatsApp({
                  customMessage:
                    "Hola, me interesa cotizar una casa. ¿Podrían ayudarme?",
                })
              }
            >
              <Phone className="w-4 h-4" />
              Cotiza por WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-stone-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button
              className="mt-2 bg-whatsapp hover:bg-whatsapp-dark text-white gap-2 w-full"
              onClick={() => {
                setIsOpen(false);
                openWhatsApp({
                  customMessage:
                    "Hola, me interesa cotizar una casa. ¿Podrían ayudarme?",
                });
              }}
            >
              <Phone className="w-4 h-4" />
              Cotiza por WhatsApp
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
