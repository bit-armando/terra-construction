"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "@/lib/types";

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableBedrooms?: number[];
  availableLocations?: string[];
}

export function ModelFilters({
  filters,
  onChange,
  availableBedrooms = [],
  availableLocations = [],
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      <div className="relative flex-1 sm:flex-none sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input
          placeholder="Buscar modelo, ubicación..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      {availableBedrooms.length > 0 && (
        <Select
          value={filters.bedrooms?.toString() || ""}
          onValueChange={(v) =>
            onChange({ ...filters, bedrooms: v ? parseInt(v) : null })
          }
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Recámaras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {availableBedrooms.map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} recámaras
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {availableLocations.length > 0 && (
        <Select
          value={filters.location || ""}
          onValueChange={(v) => onChange({ ...filters, location: v || null })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Ubicación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {availableLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.status || ""}
        onValueChange={(v) => onChange({ ...filters, status: v || null })}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="last-units">Últimas unidades</SelectItem>
          <SelectItem value="pre-sale">Preventa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
