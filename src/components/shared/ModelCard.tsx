"use client";

import { useRouter } from "next/navigation";
import { SafeImage } from "./SafeImage";
import Link from "next/link";
import { Bed, Bath, Maximize, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HouseModel } from "@/lib/types";
import { useWhatsApp } from "@/hooks/useWhatsApp";

interface Props {
  model: HouseModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  viewMode: "grid" | "list";
}

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

export function ModelCard({ model, viewMode }: Props) {
  const { openWhatsApp } = useWhatsApp();
  const router = useRouter();
  const status = statusConfig[model.status];
  const href = `/modelos/${model.slug}`;

  const cardContent = (
    <>
      {/* Image */}
      <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-80 shrink-0" : ""}`}>
        <SafeImage
          src={model.thumbnail}
          alt={model.name}
          width={800}
          height={600}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${status.color} text-white border-0`}>
            {status.label}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
          {model.images.length} fotos
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-brand-700 transition-colors">
              {model.name}
            </h3>
            <p className="text-sm text-stone-500">{model.development}</p>
          </div>
        </div>

        <p className="text-sm text-stone-600 line-clamp-2 mb-3">
          {model.description}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-brand-500" />
            {model.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-brand-500" />
            {model.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-brand-500" />
            {model.sqm}m²
          </span>
          <span className="flex items-center gap-1">
            <Car className="w-4 h-4 text-brand-500" />
            {model.parking}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {model.priceFrom && (
                <span className="text-xs text-stone-500">Desde </span>
              )}
              <span className="text-2xl font-bold text-brand-700">
                {formatPrice(model.price)}
              </span>
            </div>
            <span className="text-xs text-stone-400">{model.location}</span>
          </div>

          <div className="flex gap-2">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 h-8 px-3 transition-colors relative z-10"
            >
              Ver detalle
            </Link>
            <Button
              size="sm"
              className="flex-1 bg-whatsapp hover:bg-whatsapp-dark text-white gap-1 text-xs relative z-10"
              onClick={(e) => {
                e.stopPropagation();
                openWhatsApp({
                  modelName: model.name,
                  modelPrice: model.price,
                  development: model.development,
                });
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Cotizar
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const sharedClass =
    "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100 cursor-pointer";

  if (viewMode === "list") {
    return (
      <div
        className={`${sharedClass} flex flex-col md:flex-row`}
        onClick={() => router.push(href)}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      className={`${sharedClass} flex flex-col h-full`}
      onClick={() => router.push(href)}
    >
      {cardContent}
    </div>
  );
}
