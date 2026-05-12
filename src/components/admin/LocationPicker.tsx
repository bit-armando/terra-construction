"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ExternalLink, Loader2 } from "lucide-react";

interface Coords {
  lat: number;
  lng: number;
}

interface Props {
  location: string;
  coordinates?: Coords;
  onLocationChange: (location: string) => void;
  onCoordinatesChange: (coords: Coords | undefined) => void;
}

// Dynamically load Leaflet only client-side
async function initMap(
  container: HTMLDivElement,
  coords: Coords,
  onMapClick: (c: Coords) => void,
  isCancelled: () => boolean
) {
  const L = (await import("leaflet")).default;

  // Check after the async boundary: if the effect was cleaned up while Leaflet
  // was loading (React StrictMode double-invoke), bail out so the second effect
  // cycle can create the map cleanly.
  if (isCancelled()) return null;

  // Fix default marker icon paths broken by webpack
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const map = L.map(container).setView([coords.lat, coords.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

  marker.on("dragend", () => {
    const pos = marker.getLatLng();
    onMapClick({ lat: +pos.lat.toFixed(6), lng: +pos.lng.toFixed(6) });
  });

  map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
    const c = { lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) };
    marker.setLatLng([c.lat, c.lng]);
    onMapClick(c);
  });

  return { map, marker, L };
}

export function LocationPicker({ location, coordinates, onLocationChange, onCoordinatesChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<{ map: any; marker: any; L: any } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [mapReady, setMapReady] = useState(false);

  const defaultCoords: Coords = coordinates ?? { lat: 20.5888, lng: -100.3899 }; // Querétaro

  // Load Leaflet CSS client-side only (avoids SSR import errors)
  useEffect(() => {
    const id = "leaflet-css";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }, []);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    let cancelled = false;

    initMap(mapRef.current, defaultCoords, (c) => {
      onCoordinatesChange(c);
    }, () => cancelled).then((instance) => {
      if (!instance || cancelled) {
        instance?.map.remove();
        return;
      }
      instanceRef.current = instance;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      instanceRef.current?.map.remove();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker when coordinates change externally (lat/lng inputs)
  useEffect(() => {
    if (!instanceRef.current || !coordinates) return;
    instanceRef.current.marker.setLatLng([coordinates.lat, coordinates.lng]);
    instanceRef.current.map.panTo([coordinates.lat, coordinates.lng]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates?.lat, coordinates?.lng]);

  async function handleSearch() {
    const q = location.trim();
    if (!q) return;
    setSearching(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      if (data.length === 0) {
        setSearchError("No se encontró la ubicación");
        return;
      }
      const c: Coords = { lat: +parseFloat(data[0].lat).toFixed(6), lng: +parseFloat(data[0].lon).toFixed(6) };
      onCoordinatesChange(c);
      if (instanceRef.current) {
        instanceRef.current.marker.setLatLng([c.lat, c.lng]);
        instanceRef.current.map.setView([c.lat, c.lng], 14);
      }
    } catch {
      setSearchError("Error al buscar");
    } finally {
      setSearching(false);
    }
  }

  const gmapsUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    : null;

  return (
    <div className="sm:col-span-2 space-y-3 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MapPin className="w-4 h-4 text-accent" />
        Ubicación
      </div>

      {/* Location name + search */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-xs text-muted-foreground">Nombre / zona</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ej. Querétaro, Centro"
            className="flex-1"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSearch}
            disabled={searching || !location.trim()}
            title="Buscar en mapa"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        {searchError && <p className="text-xs text-destructive">{searchError}</p>}
        <p className="text-xs text-muted-foreground">Escribe una dirección y presiona buscar, o haz clic en el mapa.</p>
      </div>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-border">
        <div
          ref={mapRef}
          className="w-full h-56"
          style={{ zIndex: 0 }}
        />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Lat / Lng inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Latitud</Label>
          <Input
            type="number"
            step="any"
            value={coordinates?.lat ?? ""}
            placeholder="20.5888"
            onChange={(e) =>
              onCoordinatesChange({
                lat: +parseFloat(e.target.value || "0").toFixed(6),
                lng: coordinates?.lng ?? 0,
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Longitud</Label>
          <Input
            type="number"
            step="any"
            value={coordinates?.lng ?? ""}
            placeholder="-100.3899"
            onChange={(e) =>
              onCoordinatesChange({
                lat: coordinates?.lat ?? 0,
                lng: +parseFloat(e.target.value || "0").toFixed(6),
              })
            }
          />
        </div>
      </div>

      {/* Google Maps link */}
      {gmapsUrl && (
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Ver en Google Maps
        </a>
      )}
    </div>
  );
}
