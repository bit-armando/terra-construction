"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/SafeImage";
import { Home, Calendar, Users, Award } from "lucide-react";
import { teamMembers } from "@/data/team";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Home, value: "500+", label: "Casas entregadas" },
  { icon: Calendar, value: "10+", label: "Años de experiencia" },
  { icon: Users, value: "2,000+", label: "Familias felices" },
  { icon: Award, value: "100%", label: "Garantía de calidad" },
];

export function About() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-stone-50 rounded-xl"
            >
              <stat.icon className="w-8 h-8 text-brand-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
              <div className="text-sm text-stone-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-brand-600 uppercase tracking-wider">
              Nosotros
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2 mb-6">
              Construimos más que casas,
              <br />
              <span className="text-brand-600">construimos hogares</span>
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Terra Construction nació con una visión clara: democratizar el acceso
                a vivienda de calidad en Querétaro. Desde 2014, hemos entregado más de 500
                hogares a familias que confiaron en nosotros para hacer realidad su sueño.
              </p>
              <p>
                Nuestro compromiso va más allá de la construcción. Acompañamos a cada
                cliente desde la primera visita hasta la entrega de llaves, brindando
                asesoría financiera, trámites de crédito y servicio post-venta que garantiza
                la tranquilidad de tu inversión.
              </p>
              <p>
                Creemos en la transparencia, la calidad y el trato humano. Cada casa que
                construimos lleva el sello de nuestro esfuerzo por crear espacios donde las
                familias crezcan y prosperen.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <SafeImage
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Equipo de Terra Construction"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-700 text-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm text-brand-200">Años de trayectoria</div>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Conoce a nuestros asesores
          </h3>
          <p className="text-stone-600 mt-2">
            Especialistas listos para guiarte en la compra de tu casa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-stone-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <SafeImage
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-semibold text-stone-900">{member.name}</h4>
              <p className="text-sm text-stone-500 mb-4">{member.role}</p>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-whatsapp border-whatsapp hover:bg-whatsapp hover:text-white"
                onClick={() =>
                  openWhatsApp({
                    customMessage: `Hola ${member.name}, me interesa obtener información sobre sus casas.`,
                  })
                }
              >
                WhatsApp
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
