"use client";

import { useEffect, useState } from "react";
import { Testimonial } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Pencil, Trash2, Plus, Loader2, Star } from "lucide-react";

type FormData = Omit<Testimonial, "id"> & { id?: string };

const emptyForm: FormData = {
  name: "", photo: "", model: "", review: "", rating: 5,
  date: new Date().toISOString().slice(0, 10),
};

export default function AdminTestimoniosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
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
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm(emptyForm); setError(""); setDialogOpen(true); }
  function openEdit(item: Testimonial) { setForm({ ...item }); setError(""); setDialogOpen(true); }

  async function handleSave() {
    setSaving(true); setError("");
    try {
      const url = form.id ? `/api/testimonials/${form.id}` : "/api/testimonials";
      const res = await fetch(url, {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });
      if (res.ok) { setDialogOpen(false); load(); }
      else { const d = await res.json().catch(() => ({})); setError(d.error || "Error al guardar"); }
    } catch { setError("Error de conexión"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE", credentials: "same-origin" });
      if (res.ok) { setDeleteId(null); load(); }
    } finally { setDeleting(false); }
  }

  function upd<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Testimonios</h1>
          <p className="text-muted-foreground">Reseñas de clientes en la página principal.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo testimonio
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No hay testimonios registrados.</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Modelo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Calificación</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.model}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(item.id)}>
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{form.id ? "Editar testimonio" : "Nuevo testimonio"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => upd("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={form.date} onChange={(e) => upd("date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Modelo / Casa comprada</Label>
              <Input value={form.model} onChange={(e) => upd("model", e.target.value)} placeholder="Ej. Modelo Roble" />
            </div>
            <div className="space-y-2">
              <Label>Calificación (1–5)</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => upd("rating", Number(e.target.value))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Reseña</Label>
              <textarea
                value={form.review}
                onChange={(e) => upd("review", e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Texto de la reseña..."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Foto</Label>
              <ImageUpload value={form.photo} onChange={(v) => upd("photo", v as string)} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="¿Eliminar testimonio?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
