"use client";

import { useRef, useState } from "react";
import { Loader2, X, ImagePlus, GripVertical } from "lucide-react";

interface Props {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

async function uploadFile(file: File): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al obtener URL de subida");
  }

  const { uploadUrl, publicUrl } = await res.json();

  const upload = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!upload.ok) throw new Error("Error al subir imagen a S3");

  return publicUrl;
}

export function ImageUpload({ value, onChange, multiple = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dropZoneActive, setDropZoneActive] = useState(false);

  // Drag-to-reorder state
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const urls: string[] = multiple
    ? (value as string[]) || []
    : value
    ? [value as string]
    : [];

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        uploaded.push(url);
      }
      if (multiple) {
        onChange([...(value as string[]), ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(idx: number) {
    if (multiple) {
      const next = [...(value as string[])];
      next.splice(idx, 1);
      onChange(next);
    } else {
      onChange("");
    }
  }

  // Reorder handlers
  function onDragStart(idx: number) {
    dragIndex.current = idx;
  }

  function onDragEnterItem(idx: number) {
    setDragOverIndex(idx);
  }

  function onDragEndItem() {
    if (dragIndex.current === null || dragOverIndex === null) {
      dragIndex.current = null;
      setDragOverIndex(null);
      return;
    }
    const from = dragIndex.current;
    const to = dragOverIndex;
    if (from !== to) {
      const next = [...(value as string[])];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(next);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-2">
      {/* Image grid */}
      {urls.length > 0 && (
        <div className={`grid gap-2 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1 max-w-xs"}`}>
          {urls.map((url, idx) => (
            <div
              key={url}
              draggable={multiple}
              onDragStart={multiple ? () => onDragStart(idx) : undefined}
              onDragEnter={multiple ? () => onDragEnterItem(idx) : undefined}
              onDragOver={multiple ? (e) => e.preventDefault() : undefined}
              onDragEnd={multiple ? onDragEndItem : undefined}
              className={`relative group aspect-video rounded-lg overflow-hidden border bg-muted transition-all
                ${multiple ? "cursor-grab active:cursor-grabbing" : ""}
                ${dragOverIndex === idx && dragIndex.current !== idx
                  ? "border-accent ring-2 ring-accent/40 scale-[0.97]"
                  : "border-border"
                }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />

              {/* Primer imagen = portada */}
              {multiple && idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Portada
                </span>
              )}

              {/* Grip handle */}
              {multiple && (
                <div className="absolute top-1 left-1 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3" />
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {multiple && urls.length > 1 && (
        <p className="text-xs text-muted-foreground">Arrastra para reordenar · La primera imagen es la portada</p>
      )}

      {/* Drop zone for new uploads */}
      {(multiple || urls.length === 0) && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDropZoneActive(true); }}
          onDragLeave={() => setDropZoneActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropZoneActive(false);
            // Only handle file drops (not image reorder drags)
            if (e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          disabled={uploading}
          className={`w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition-colors
            ${dropZoneActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-muted/40"}
            ${uploading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-muted-foreground">Subiendo...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {multiple ? "Añadir imágenes" : "Arrastra una imagen o haz clic"}
              </span>
              <span className="text-xs text-muted-foreground/60">JPG, PNG, WebP — máx. 10MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
