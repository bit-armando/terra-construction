import { Metadata } from "next";
import { developments } from "@/data/developments";
import { houseModels } from "@/data/models";
import { SafeImage } from "@/components/shared/SafeImage";
import Link from "next/link";
import { MapPin, Trees, Shield, Waves, Dumbbell, PartyPopper, Dog, Route, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Desarrollos | Integraciones Templer",
  description: "Explora nuestros desarrollos inmobiliarios en Querétaro y San Juan del Río.",
};

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

export default function DevelopmentsPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4">
          Nuestros desarrollos
        </h1>
        <p className="text-stone-600 mb-12 max-w-2xl">
          Comunidades residenciales diseñadas con amenidades de calidad y ubicaciones estratégicas.
        </p>

        <div className="space-y-12">
          {developments.map((dev) => {
            const models = houseModels.filter((m) =>
              dev.availableModels.includes(m.slug)
            );

            return (
              <div
                key={dev.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm"
              >
                {/* Header image */}
                <div className="relative h-80 overflow-hidden">
                  <SafeImage
                    src={dev.thumbnail}
                    alt={dev.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge className="bg-white/90 text-stone-800 mb-3">
                      {dev.progress >= 100
                        ? "Entrega inmediata"
                        : `${dev.progress}% avance de obra`}
                    </Badge>
                    <h2 className="font-serif text-3xl font-bold text-white mb-2">
                      {dev.name}
                    </h2>
                    <p className="text-white/80 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dev.location}
                    </p>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <p className="text-stone-600 mb-6">{dev.description}</p>

                  {/* Amenities */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-stone-900 mb-4">
                      Amenidades
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {dev.amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-3 text-sm text-stone-600"
                          >
                            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-brand-500" />
                            </div>
                            <span className="leading-tight">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available models */}
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-4">
                      Modelos disponibles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {models.map((model) => (
                        <Link
                          key={model.id}
                          href={`/modelos/${model.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <SafeImage
                              src={model.thumbnail}
                              alt={model.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900 text-sm">
                              {model.name}
                            </p>
                            <p className="text-xs text-stone-500">
                              {model.bedrooms} rec • {model.sqm}m²
                            </p>
                            <p className="text-sm font-semibold text-brand-700">
                              ${(model.price / 1000000).toFixed(1)}M
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
