"use client";

import { useParams } from "next/navigation";
import { SafeImage } from "@/components/shared/SafeImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Bed,
  Bath,
  Maximize,
  Car,
  MapPin,
  Home,
  Download,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { houseModels } from "@/data/models";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { MortgageCalculator } from "@/components/shared/MortgageCalculator";
import { ModelCard } from "@/components/shared/ModelCard";


const statusConfig = {
  available: { label: "Disponible", color: "bg-green-500" },
  "last-units": { label: "Últimas unidades", color: "bg-amber-500" },
  "pre-sale": { label: "Preventa", color: "bg-blue-500" },
  "sold-out": { label: "Vendido", color: "bg-stone-500" },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ModelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { openWhatsApp } = useWhatsApp();

  const model = houseModels.find((m) => m.slug === slug);
  const [currentImage, setCurrentImage] = useState(0);

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">
            Modelo no encontrado
          </h1>
          <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-stone-900 text-white text-sm font-medium h-9 px-4 hover:bg-stone-800 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const similarModels = houseModels.filter(
    (m) => model.similarModels?.includes(m.slug)
  );

  const status = statusConfig[model.status];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link
              href="/#modelos"
              className="hover:text-brand-600 transition-colors"
            >
              Modelos
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">{model.name}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="relative bg-stone-900">
        <div className="relative aspect-[16/9] lg:aspect-[21/9] max-h-[70vh]">
          <SafeImage
            src={model.images[currentImage]}
            alt={`${model.name} - Imagen ${currentImage + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Navigation */}
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? model.images.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === model.images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {model.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentImage
                    ? "border-white scale-110"
                    : "border-white/40 hover:border-white/70"
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={`${status.color} text-white border-0`}>
                  {status.label}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-stone-500">
                  <MapPin className="w-4 h-4" />
                  {model.location}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
                {model.name}
              </h1>
              <p className="text-stone-600 leading-relaxed text-lg">
                {model.description}
              </p>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Bed, label: "Recámaras", value: model.bedrooms },
                { icon: Bath, label: "Baños", value: model.bathrooms },
                { icon: Maximize, label: "Metros", value: `${model.sqm}m²` },
                { icon: Car, label: "Cajones", value: model.parking },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-white rounded-xl p-4 text-center border border-stone-100"
                >
                  <spec.icon className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{spec.value}</div>
                  <div className="text-xs text-stone-500">{spec.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">
                Características
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {model.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg border border-stone-100"
                  >
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm text-stone-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">
                Ubicación
              </h2>
              <div className="aspect-video bg-stone-200 rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734!2d-100.3899!3d20.5888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDM1JzE5LjciTiAxMDDCsDIzJzIzLjYiVw!5e0!3m2!1ses!2smx!4v1`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ubicación de ${model.name}`}
                />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Price card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <p className="text-sm text-stone-500 mb-1">
                  {model.priceFrom ? "Precio desde" : "Precio"}
                </p>
                <div className="text-3xl font-bold text-brand-700 mb-4">
                  {formatPrice(model.price)}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white gap-2"
                    size="lg"
                    onClick={() =>
                      openWhatsApp({
                        modelName: model.name,
                        modelPrice: model.price,
                        development: model.development,
                      })
                    }
                  >
                    <MessageCircle className="w-5 h-5" />
                    Cotizar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    size="lg"
                    onClick={() =>
                      openWhatsApp({
                        customMessage: `Hola, me interesa agendar una visita para ver el ${model.name} en ${model.development}.`,
                      })
                    }
                  >
                    <Home className="w-5 h-5" />
                    Agenda visita
                  </Button>
                </div>
              </div>

              {/* Plan */}
              {model.planUrl && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-900 mb-3">
                    Plano arquitectónico
                  </h3>
                  <Link
                    href={model.planUrl}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white text-sm font-medium h-9 px-4 hover:bg-stone-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </Link>
                </div>
              )}

              {/* Mortgage Calculator */}
              <MortgageCalculator price={model.price} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar models */}
      {similarModels.length > 0 && (
        <section className="bg-white py-16 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">
              Modelos similares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarModels.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                  viewMode="grid"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating CTA for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <Button
          className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white gap-2"
          onClick={() =>
            openWhatsApp({
              modelName: model.name,
              modelPrice: model.price,
              development: model.development,
            })
          }
        >
          <MessageCircle className="w-5 h-5" />
          Cotizar por WhatsApp
        </Button>
      </div>
    </div>
  );
}
