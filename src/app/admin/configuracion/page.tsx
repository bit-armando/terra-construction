"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

const defaultSettings: Record<string, string> = {
  whatsapp_phone: "",
  company_name: "",
  company_address: "",
  company_phone: "",
  company_email: "",
  company_hours: "",
  meta_title: "",
  meta_description: "",
};

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => setError("No se pudieron cargar los settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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

  function update(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Configuracion</h1>
        <p className="text-stone-600">Edita los datos de contacto y meta tags del sitio.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Configuracion guardada correctamente.
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Nombre de la empresa</Label>
          <Input id="company_name" value={settings.company_name || ""} onChange={(e) => update("company_name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_phone">Telefono</Label>
          <Input id="company_phone" value={settings.company_phone || ""} onChange={(e) => update("company_phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp_phone">WhatsApp (con lada, ej: 5214421234567)</Label>
          <Input id="whatsapp_phone" value={settings.whatsapp_phone || ""} onChange={(e) => update("whatsapp_phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_email">Email</Label>
          <Input id="company_email" type="email" value={settings.company_email || ""} onChange={(e) => update("company_email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_address">Direccion</Label>
          <Input id="company_address" value={settings.company_address || ""} onChange={(e) => update("company_address", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_hours">Horario</Label>
          <Input id="company_hours" value={settings.company_hours || ""} onChange={(e) => update("company_hours", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta title</Label>
          <Input id="meta_title" value={settings.meta_title || ""} onChange={(e) => update("meta_title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta description</Label>
          <textarea
            id="meta_description"
            value={settings.meta_description || ""}
            onChange={(e) => update("meta_description", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-700 hover:bg-brand-800">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Guardar configuracion
        </Button>
      </div>
    </div>
  );
}
