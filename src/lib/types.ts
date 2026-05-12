export interface HouseModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceFrom: boolean;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  parking: number;
  status: "available" | "last-units" | "pre-sale" | "sold-out";
  images: string[];
  thumbnail: string;
  location: string;
  development: string;
  features: string[];
  planUrl?: string;
  videoUrl?: string;
  virtualTour?: string;
  similarModels?: string[];
}

export interface Development {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  thumbnail: string;
  images: string[];
  amenities: string[];
  progress: number;
  availableModels: string[];
  coordinates?: { lat: number; lng: number };
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  model: string;
  review: string;
  rating: number;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
  zone?: string;
}

export interface FilterState {
  priceRange: [number, number];
  bedrooms: number | null;
  location: string | null;
  status: string | null;
  search: string;
}
