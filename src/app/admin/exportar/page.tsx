"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Loader2, AlertTriangle } from "lucide-react";

const exportOptions = [
  { key: "models", label: "Modelos", url: "/api/models" },
  { key: "developments", label: "Desarrollos", url: "/api/developments" },
  { key: "settings", label: "Configuracion", url: "/api/settings" },
];

export default function AdminExportPage() {
  const [importType, setImportType] = useState("models");
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  async function downloadJson(label: string, url: string) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${label.toLowerCase().replace(/\s+/g, "-")}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("Error al descargar");
    }
  }

  async function handleImport() {
    setImportError("");
    setImportSuccess("");
    setImporting(true);
    try {
      let payload;
      try {
        payload = JSON.parse(importText);
      } catch {
        setImportError("JSON invalido");
        setImporting(false);
        return;
      }

      const url = importType === "models" ? "/api/models" : "/api/developments";
      // Support single object or array
      const items = Array.isArray(payload) ? payload : [payload];
      let successCount = 0;

      for (const item of items) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(item),
        });
        if (res.ok) successCount++;
      }

      if (successCount === items.length) {
        setImportSuccess(`${successCount} elemento(s) importado(s) correctamente.`);
        setImportText("");
      } else {
        setImportError(`Se importaron ${successCount} de ${items.length}. Revisa que la BD este configurada.`);
      }
    } catch {
      setImportError("Error de conexion");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Exportar / Importar</h1>
        <p className="text-muted-foreground">Descarga plantillas JSON o importa datos.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Exportar datos</h2>
        <p className="text-sm text-muted-foreground">
          Descarga los datos actuales como JSON para respaldar o editar externamente.
        </p>
        <div className="flex flex-wrap gap-3">
          {exportOptions.map((opt) => (
            <Button
              key={opt.key}
              variant="outline"
              className="gap-2"
              onClick={() => downloadJson(opt.label, opt.url)}
            >
              <Download className="w-4 h-4" />
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Importar datos</h2>
        <p className="text-sm text-muted-foreground">
          Pega un JSON con uno o varios objetos para importar. Requiere base de datos configurada.
        </p>

        {importError && (
          <div className="flex items-center gap-2 text-red-700 bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200 text-sm">
            {importSuccess}
          </div>
        )}

        <div className="space-y-2">
          <Label>Tipo de dato</Label>
          <Select value={importType} onValueChange={(v) => v && setImportType(v)}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="models">Modelos</SelectItem>
              <SelectItem value="developments">Desarrollos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>JSON</Label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={10}
            placeholder={`[\n  {\n    "slug": "modelo-ejemplo",\n    "name": "Modelo Ejemplo",\n    ...\n  }\n]`}
            className="w-full rounded-md border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button
          onClick={handleImport}
          disabled={importing || !importText.trim()}
          className="gap-2"
        >
          {importing && <Loader2 className="w-4 h-4 animate-spin" />}
          <Upload className="w-4 h-4" />
          Importar
        </Button>
      </div>
    </div>
  );
}
