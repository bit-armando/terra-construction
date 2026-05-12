"use client";

import { motion } from "framer-motion";
import { ArrowDown, Phone, Home, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export function Hero() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 mb-6">
              <Home className="w-4 h-4" />
              Más de 500 hogares entregados
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Tu nueva casa
            <br />
            <span className="text-brand-300">te está esperando</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-lg"
          >
            Casas de calidad en Querétaro y San Juan del Río desde $1,190,000 MXN.
            Créditos INFONAVIT, FOVISSSTE y bancarios.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <a
              href="#modelos"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium h-10 px-8 transition-colors"
            >
              <Home className="w-5 h-5" />
              Ver modelos
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 px-8"
              onClick={() =>
                openWhatsApp({
                  customMessage:
                    "Hola, me interesa hablar con un asesor sobre sus casas.",
                })
              }
            >
              <Phone className="w-5 h-5" />
              Hablar con asesor
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { icon: Award, value: "10+", label: "Años de experiencia" },
              { icon: Home, value: "500+", label: "Casas entregadas" },
              { icon: Users, value: "2,000+", label: "Familias felices" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <stat.icon className="w-6 h-6 text-brand-300 mx-auto sm:mx-0 mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#modelos"
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Descubre</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
