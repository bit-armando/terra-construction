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
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ListInput } from "@/components/admin/ListInput";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { Pencil, Trash2, Plus, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";

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
  active: true,
};

export default function AdminDevelopmentsPage() {
  const [items, setItems] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
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

  async function handleToggleActive(item: Development) {
    setTogglingId(item.id);
    try {
      await fetch(`/api/developments/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...item, active: !item.active }),
      });
      load();
    } catch {
      // silently fail
    } finally {
      setTogglingId(null);
    }
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Desarrollos</h1>
          <p className="text-muted-foreground">Gestiona los fraccionamientos y desarrollos.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo desarrollo
        </Button>
      </div>

      {error && !dialogOpen && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No hay desarrollos registrados.
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ubicacion</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Avance</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className={`hover:bg-muted/50 ${!item.active ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.progress}%</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${item.active ? "text-green-600 hover:text-muted-foreground" : "text-muted-foreground hover:text-green-600"}`}
                          onClick={() => handleToggleActive(item)}
                          disabled={togglingId === item.id}
                          title={item.active ? "Desactivar" : "Activar"}
                        >
                          {togglingId === item.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
                          }
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Thumbnail</Label>
              <ImageUpload
                value={form.thumbnail}
                onChange={(v) => updateField("thumbnail", v as string)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Avance (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={form.progress === 0 ? "" : form.progress}
                placeholder="0"
                onChange={(e) => updateField("progress", e.target.value === "" ? 0 : Number(e.target.value))}
              />
            </div>
            <div className="sm:col-span-2" />
            <LocationPicker
              location={form.location}
              coordinates={form.coordinates}
              onLocationChange={(v) => updateField("location", v)}
              onCoordinatesChange={(v) => updateField("coordinates", v)}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label>Imágenes</Label>
              <ImageUpload
                value={form.images}
                onChange={(v) => updateField("images", v as string[])}
                multiple
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Amenidades</Label>
              <ListInput
                value={form.amenities}
                onChange={(v) => updateField("amenities", v)}
                placeholder="Ej. Alberca"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
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
