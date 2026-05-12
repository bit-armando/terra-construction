"use client";

import { useEffect, useState } from "react";
import { Development } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pencil, Trash2, Plus, Loader2, AlertTriangle } from "lucide-react";

type FormData = Omit<Development, "id"> & { id?: string };

const emptyForm: FormData = {
  slug: "",
  name: "",
  description: "",
  location: "",
  thumbnail: "",
  images: [],
  amenities: [],
  progress: 0,
  availableModels: [],
  coordinates: undefined,
};

export default function AdminDevelopmentsPage() {
  const [items, setItems] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/developments");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(item: Development) {
    setForm({ ...item });
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const url = form.id ? `/api/developments/${form.id}` : "/api/developments";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDialogOpen(false);
        load();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/developments/${deleteId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setDeleteId(null);
        load();
      } else {
        alert("Error al eliminar");
      }
    } catch {
      alert("Error de conexion");
    } finally {
      setDeleting(false);
    }
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Desarrollos</h1>
          <p className="text-stone-600">Gestiona los fraccionamientos y desarrollos.</p>
        </div>
        <Button onClick={openNew} className="bg-brand-700 hover:bg-brand-800 gap-2">
          <Plus className="w-4 h-4" />
          Nuevo desarrollo
        </Button>
      </div>

      {error && !dialogOpen && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          No hay desarrollos registrados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Ubicacion</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Avance</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{item.name}</td>
                    <td className="px-4 py-3 text-stone-600">{item.slug}</td>
                    <td className="px-4 py-3 text-stone-600">{item.location}</td>
                    <td className="px-4 py-3 text-stone-600">{item.progress}%</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-stone-500 hover:text-brand-700"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-stone-500 hover:text-red-600"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {form.id ? "Editar desarrollo" : "Nuevo desarrollo"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="bosques-del-refugio"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descripcion</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicacion</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={form.thumbnail}
                onChange={(e) => updateField("thumbnail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Avance (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => updateField("progress", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">Latitud</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={form.coordinates?.lat ?? ""}
                onChange={(e) =>
                  updateField("coordinates", {
                    lat: Number(e.target.value),
                    lng: form.coordinates?.lng ?? 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitud</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={form.coordinates?.lng ?? ""}
                onChange={(e) =>
                  updateField("coordinates", {
                    lat: form.coordinates?.lat ?? 0,
                    lng: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="images">Imagenes (JSON array de URLs)</Label>
              <textarea
                id="images"
                value={JSON.stringify(form.images, null, 2)}
                onChange={(e) => {
                  try {
                    updateField("images", JSON.parse(e.target.value));
                  } catch {
                    // ignore
                  }
                }}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="amenities">Amenidades (JSON array de strings)</Label>
              <textarea
                id="amenities"
                value={JSON.stringify(form.amenities, null, 2)}
                onChange={(e) => {
                  try {
                    updateField("amenities", JSON.parse(e.target.value));
                  } catch {
                    // ignore
                  }
                }}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="availableModels">Modelos disponibles (JSON array de slugs)</Label>
              <textarea
                id="availableModels"
                value={JSON.stringify(form.availableModels, null, 2)}
                onChange={(e) => {
                  try {
                    updateField("availableModels", JSON.parse(e.target.value));
                  } catch {
                    // ignore
                  }
                }}
                rows={2}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-brand-700 hover:bg-brand-800">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar desarrollo?"
        description="Esta accion no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
