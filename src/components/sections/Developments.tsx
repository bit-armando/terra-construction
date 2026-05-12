"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/SafeImage";
import { MapPin, Trees, Shield, Waves, Dumbbell, PartyPopper, Dog, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { developments } from "@/data/developments";
import Link from "next/link";

const amenityIcons: Record<string, React.ElementType> = {
  Alberca: Waves,
  Gimnasio: Dumbbell,
  Seguridad: Shield,
  Juegos: PartyPopper,
  Mascotas: Dog,
  Jogging: Route,
  Eventos: PartyPopper,
  default: Trees,
};

function getAmenityIcon(name: string) {
  const key = Object.keys(amenityIcons).find((k) =>
    name.toLowerCase().includes(k.toLowerCase())
  );
  return amenityIcons[key || "default"] || Trees;
}

export function Developments() {
  return (
    <section id="desarrollos" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-brand-600 uppercase tracking-wider">
            Desarrollos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 mb-4">
            Comunidades diseñadas para vivir bien
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Espacios planificados con amenidades que enriquecen la vida diaria de tu familia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {developments.map((dev, index) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <SafeImage
                  src={dev.thumbnail}
                  alt={dev.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {dev.location}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {dev.name}
                  </h3>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-stone-800 backdrop-blur-sm">
                    {dev.progress >= 100 ? "Entrega inmediata" : `${dev.progress}% avance`}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {dev.description}
                </p>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-stone-900 mb-3">
                    Amenidades
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {dev.amenities.slice(0, 4).map((amenity) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-sm text-stone-600"
                        >
                          <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                          <span className="truncate">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Models available */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-stone-500">
                    <span className="font-semibold text-stone-900">
                      {dev.availableModels.length}
                    </span>{" "}
                    modelos disponibles
                  </div>
                  <Link
                    href={`/desarrollos/${dev.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white text-xs font-medium h-7 px-3 hover:bg-stone-50 transition-colors"
                  >
                    Ver desarrollo
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
