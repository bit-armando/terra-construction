"use client";

import { motion } from "framer-motion";
import { Home, MessageSquare, FileCheck, Key } from "lucide-react";

const steps = [
  {
    icon: Home,
    step: "01",
    title: "Elige tu modelo",
    description:
      "Explora nuestro catálogo y selecciona la casa que se ajuste a tus necesidades y presupuesto.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Cotiza con asesor",
    description:
      "Contáctanos por WhatsApp o agenda una visita. Te ayudamos con simuladores de crédito y opciones de pago.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Firma contrato",
    description:
      "Revisa y firma tu contrato de compraventa. Te acompañamos en todo el proceso legal y notarial.",
  },
  {
    icon: Key,
    step: "04",
    title: "Recibe tu casa",
    description:
      "Hacemos la entrega formal de tu nuevo hogar con garantía de calidad y servicio post-venta.",
  },
];

export function ProcessTimeline() {
  return (
    <section className="py-20 lg:py-28 bg-brand-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-brand-400 uppercase tracking-wider">
            Proceso
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            De la decisión a tu nuevo hogar
          </h2>
          <p className="text-brand-200 max-w-2xl mx-auto">
            Un proceso claro y transparente para que adquieras tu casa con total confianza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-brand-700" />
              )}

              <div className="text-brand-500 text-5xl font-bold opacity-20 mb-4">
                {item.step}
              </div>
              <div className="w-12 h-12 bg-brand-800 rounded-xl flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-brand-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-brand-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
