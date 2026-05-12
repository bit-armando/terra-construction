"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Trees,
  Settings,
  Download,
  Database,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ models: 0, developments: 0 });
  const [dbStatus, setDbStatus] = useState<boolean | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, models: data.length || 0 })))
      .catch(() => {});
    fetch("/api/developments")
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, developments: data.length || 0 })))
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => {
        setDbStatus(r.status !== 500);
      })
      .catch(() => setDbStatus(false));
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        alert("Base de datos poblada correctamente");
        window.location.reload();
      } else {
        alert("Error al poblar la base de datos");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600">Administra el contenido de tu sitio web.</p>
      </div>

      {dbStatus === false && (
        <div className="flex items-start gap-3 bg-amber-50 text-amber-800 px-4 py-3 rounded-lg border border-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Base de datos no configurada</p>
            <p className="mt-1">
              Las operaciones de escritura no funcionarán hasta que configures{" "}
              <code className="bg-amber-100 px-1 rounded">TURSO_DATABASE_URL</code>.
              Puedes usar el botón de abajo para poblar la BD una vez configurada.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={handleSeed}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              Poblar base de datos
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Modelos
            </CardTitle>
            <Home className="w-4 h-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{stats.models}</div>
            <Link href="/admin/modelos" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
              Gestionar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Desarrollos
            </CardTitle>
            <Trees className="w-4 h-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-900">{stats.developments}</div>
            <Link href="/admin/desarrollos" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
              Gestionar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Configuración
            </CardTitle>
            <Settings className="w-4 h-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-stone-500 mt-1">Teléfono, email, meta tags...</div>
            <Link href="/admin/configuracion" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
              Editar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Exportar
            </CardTitle>
            <Download className="w-4 h-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-stone-500 mt-1">JSON e importación</div>
            <Link href="/admin/exportar" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
              Ver →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
