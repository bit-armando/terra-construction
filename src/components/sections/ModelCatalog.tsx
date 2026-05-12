"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { HouseModel, FilterState } from "@/lib/types";
import { ModelFilters } from "@/components/shared/ModelFilters";
import { ModelCard } from "@/components/shared/ModelCard";
import { LayoutGrid, List, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModelCatalog() {
  const [allModels, setAllModels] = useState<HouseModel[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 3000000],
    bedrooms: null,
    location: null,
    status: null,
    search: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => setAllModels(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Load favorites from localStorage on mount
  useState(() => {
    try {
      const saved = localStorage.getItem("terra-favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("terra-favorites", JSON.stringify(next));
      return next;
    });
  };

  const filteredModels = useMemo(() => {
    return allModels.filter((model) => {
      if (model.price < filters.priceRange[0] || model.price > filters.priceRange[1])
        return false;
      if (filters.bedrooms && model.bedrooms !== filters.bedrooms) return false;
      if (filters.location && !model.location.includes(filters.location)) return false;
      if (filters.status && model.status !== filters.status) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          model.name.toLowerCase().includes(search) ||
          model.location.toLowerCase().includes(search) ||
          model.development.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [filters, allModels]);

  return (
    <section id="modelos" className="py-20 lg:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-brand-600 uppercase tracking-wider">
            Catálogo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 mb-4">
            Encuentra tu modelo ideal
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explora nuestra colección de casas diseñadas para diferentes estilos de vida y presupuestos.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <ModelFilters filters={filters} onChange={setFilters} />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-brand-600" : ""}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-brand-600" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 ml-2">
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-stone-500 mb-6">
          {filteredModels.length} modelo{filteredModels.length !== 1 ? "s" : ""} encontrado
          {filteredModels.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ModelCard
                model={model}
                isFavorite={favorites.includes(model.id)}
                onToggleFavorite={() => toggleFavorite(model.id)}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">
              No encontramos modelos con esos filtros.
            </p>
            <Button
              variant="link"
              onClick={() =>
                setFilters({
                  priceRange: [0, 3000000],
                  bedrooms: null,
                  location: null,
                  status: null,
                  search: "",
                })
              }
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
