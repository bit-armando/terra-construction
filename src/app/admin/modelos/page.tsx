"use client";

import { useEffect, useState } from "react";
import { HouseModel } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pencil, Trash2, Plus, Loader2, AlertTriangle } from "lucide-react";

type FormData = Omit<HouseModel, "id"> & { id?: string };

const emptyForm: FormData = {
  slug: "",
  name: "",
  description: "",
  price: 0,
  priceFrom: false,
  bedrooms: 3,
  bathrooms: 2,
  sqm: 100,
  parking: 1,
  status: "available",
  images: [],
  thumbnail: "",
  location: "",
  development: "",
  features: [],
  planUrl: "",
  videoUrl: "",
  virtualTour: "",
  similarModels: [],
};

export default function AdminModelsPage() {
  const [models, setModels] = useState<HouseModel[]>([]);
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
      const res = await fetch("/api/models");
      const data = await res.json();
      setModels(Array.isArray(data) ? data : []);
    } catch {
      setModels([]);
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

  function openEdit(m: HouseModel) {
    setForm({ ...m });
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const url = form.id ? `/api/models/${form.id}` : "/api/models";
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
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/models/${deleteId}`, {
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
      alert("Error de conexión");
    } finally {
      setDeleting(false);
    }
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const statusLabels: Record<string, string> = {
    available: "Disponible",
    "last-units": "Últimas unidades",
    "pre-sale": "Pre-venta",
    "sold-out": "Vendido",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Modelos</h1>
          <p className="text-stone-600">Gestiona el catálogo de casas.</p>
        </div>
        <Button onClick={openNew} className="bg-brand-700 hover:bg-brand-800 gap-2">
          <Plus className="w-4 h-4" />
          Nuevo modelo
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
      ) : models.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          No hay modelos registrados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Precio</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Ubicación</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{m.name}</td>
                    <td className="px-4 py-3 text-stone-600">{m.slug}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {m.priceFrom ? "Desde " : ""}
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        maximumFractionDigits: 0,
                      }).format(m.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700">
                        {statusLabels[m.status] || m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{m.location}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-stone-500 hover:text-brand-700"
                          onClick={() => openEdit(m)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-stone-500 hover:text-red-600"
                          onClick={() => setDeleteId(m.id)}
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
              {form.id ? "Editar modelo" : "Nuevo modelo"}
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
                placeholder="modelo-ejemplo"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) => updateField("status", v as HouseModel["status"])}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="last-units">Últimas unidades</SelectItem>
                  <SelectItem value="pre-sale">Pre-venta</SelectItem>
                  <SelectItem value="sold-out">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Recámaras</Label>
              <Input
                id="bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={(e) => updateField("bedrooms", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input
                id="bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={(e) => updateField("bathrooms", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sqm">Metros cuadrados</Label>
              <Input
                id="sqm"
                type="number"
                value={form.sqm}
                onChange={(e) => updateField("sqm", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Estacionamientos</Label>
              <Input
                id="parking"
                type="number"
                value={form.parking}
                onChange={(e) => updateField("parking", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="development">Desarrollo</Label>
              <Input
                id="development"
                value={form.development}
                onChange={(e) => updateField("development", e.target.value)}
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
              <Label htmlFor="planUrl">URL de plano</Label>
              <Input
                id="planUrl"
                value={form.planUrl || ""}
                onChange={(e) => updateField("planUrl", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL de video</Label>
              <Input
                id="videoUrl"
                value={form.videoUrl || ""}
                onChange={(e) => updateField("videoUrl", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="virtualTour">Tour virtual URL</Label>
              <Input
                id="virtualTour"
                value={form.virtualTour || ""}
                onChange={(e) => updateField("virtualTour", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="images">
                Imágenes (JSON array de URLs)
              </Label>
              <textarea
                id="images"
                value={JSON.stringify(form.images, null, 2)}
                onChange={(e) => {
                  try {
                    updateField("images", JSON.parse(e.target.value));
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="features">
                Características (JSON array de strings)
              </Label>
              <textarea
                id="features"
                value={JSON.stringify(form.features, null, 2)}
                onChange={(e) => {
                  try {
                    updateField("features", JSON.parse(e.target.value));
                  } catch {
                    // ignore
                  }
                }}
                rows={3}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="similarModels">
                Modelos similares (JSON array de slugs)
              </Label>
              <textarea
                id="similarModels"
                value={JSON.stringify(form.similarModels || [], null, 2)}
                onChange={(e) => {
                  try {
                    updateField("similarModels", JSON.parse(e.target.value));
                  } catch {
                    // ignore
                  }
                }}
                rows={2}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="priceFrom"
                type="checkbox"
                checked={form.priceFrom}
                onChange={(e) => updateField("priceFrom", e.target.checked)}
                className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <Label htmlFor="priceFrom" className="font-normal">
                Mostrar &quot;Desde&quot; antes del precio
              </Label>
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
        title="¿Eliminar modelo?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
