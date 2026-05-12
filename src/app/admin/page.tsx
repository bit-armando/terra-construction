"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Trees, Settings, Download } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ models: 0, developments: 0 });

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, models: data.length || 0 })))
      .catch(() => {});
    fetch("/api/developments")
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, developments: data.length || 0 })))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Administra el contenido de tu sitio web.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modelos
            </CardTitle>
            <Home className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.models}</div>
            <Link href="/admin/modelos" className="text-xs text-accent hover:underline mt-1 inline-block">
              Gestionar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Desarrollos
            </CardTitle>
            <Trees className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.developments}</div>
            <Link href="/admin/desarrollos" className="text-xs text-accent hover:underline mt-1 inline-block">
              Gestionar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Configuración
            </CardTitle>
            <Settings className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mt-1">Teléfono, email, meta tags...</div>
            <Link href="/admin/configuracion" className="text-xs text-accent hover:underline mt-1 inline-block">
              Editar →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exportar
            </CardTitle>
            <Download className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mt-1">JSON e importación</div>
            <Link href="/admin/exportar" className="text-xs text-accent hover:underline mt-1 inline-block">
              Ver →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
