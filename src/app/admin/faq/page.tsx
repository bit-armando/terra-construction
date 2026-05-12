"use client";

import { useEffect, useState } from "react";
import { FAQ } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

type FormData = Omit<FAQ, "id"> & { id?: string };

const emptyForm: FormData = { question: "", answer: "", category: "general" };

export default function AdminFaqPage() {
  const [items, setItems] = useState<FAQ[]>([]);
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
      const res = await fetch("/api/faq");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setForm(emptyForm); setError(""); setDialogOpen(true); }
  function openEdit(item: FAQ) { setForm({ ...item }); setError(""); setDialogOpen(true); }

  async function handleSave() {
    setSaving(true); setError("");
    try {
      const url = form.id ? `/api/faq/${form.id}` : "/api/faq";
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
      const res = await fetch(`/api/faq/${deleteId}`, { method: "DELETE", credentials: "same-origin" });
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
          <h1 className="font-serif text-2xl font-bold text-foreground">Preguntas frecuentes</h1>
          <p className="text-muted-foreground">Gestiona el FAQ de la página principal.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Nueva pregunta
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No hay preguntas registradas.</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pregunta</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Categoría</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground max-w-md truncate">{item.question}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {item.category}
                      </span>
                    </td>
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
            <DialogTitle className="font-serif">{form.id ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Pregunta</Label>
              <Input value={form.question} onChange={(e) => upd("question", e.target.value)} placeholder="¿Cómo puedo obtener un crédito?" />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input value={form.category} onChange={(e) => upd("category", e.target.value)} placeholder="general, credito, proceso..." />
            </div>
            <div className="space-y-2">
              <Label>Respuesta</Label>
              <textarea
                value={form.answer}
                onChange={(e) => upd("answer", e.target.value)}
                rows={5}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Respuesta detallada..."
              />
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
        title="¿Eliminar pregunta?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
