import { Development } from "@/lib/types";

export const developments: Development[] = [
  {
    id: "1",
    slug: "bosques-del-refugio",
    name: "Bosques del Refugio",
    description:
      "Un santuario residencial rodeado de naturaleza. Bosques del Refugio combina la tranquilidad de vivir entre árboles con la cercanía a los mejores servicios de Querétaro.",
    location: "Querétaro, Qro.",
    thumbnail:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Alberca semiolímpica",
      "Áreas verdes con juegos infantiles",
      "Gimnasio al aire libre",
      "Seguridad 24/7 con caseta de acceso",
      "Cancha de paddle",
      "Pista de jogging",
      "Salón de eventos",
      "Parque para mascotas",
    ],
    progress: 85,
    availableModels: ["modelo-aurora", "modelo-victoria", "modelo-serenidad"],
    coordinates: { lat: 20.5888, lng: -100.3899 },
  },
  {
    id: "2",
    slug: "valle-del-sol",
    name: "Valle del Sol",
    description:
      "El sol ilumina cada rincón de este desarrollo pensado para familias que crecen. Valle del Sol ofrece casas accesibles con plusvalía garantizada en la zona de mayor crecimiento.",
    location: "San Juan del Río, Qro.",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Alberca familiar",
      "Palapa con asadores",
      "Juegos infantiles",
      "Acceso controlado",
      "Cisterna comunitaria",
      "Amplias calles pavimentadas",
    ],
    progress: 60,
    availableModels: ["modelo-esperanza", "modelo-fortaleza", "modelo-libertad"],
    coordinates: { lat: 20.3875, lng: -99.9957 },
  },
];
