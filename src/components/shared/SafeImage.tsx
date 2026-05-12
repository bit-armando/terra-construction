"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fill,
  width,
  height,
  priority,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-stone-200 flex items-center justify-center ${className}`}
        style={fill ? { position: "absolute", inset: 0 } : { width, height }}
      >
        <span className="text-stone-400 text-xs">Imagen no disponible</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={() => setError(true)}
        sizes="100vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
