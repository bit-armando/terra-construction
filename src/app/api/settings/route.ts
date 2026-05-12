import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp_phone: "5214421234567",
  company_name: "Terra Construction",
  company_address: "Av. Constituyentes 123, Centro, Querétaro, Qro. 76000",
  company_phone: "442 123 4567",
  company_email: "contacto@terraconstruction.com",
  company_hours: "Lun - Vie: 9:00 - 18:00",
};

export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    const db = getDbClient();
    const result = await db.execute("SELECT key, value FROM settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
    }
    return NextResponse.json({ ...DEFAULT_SETTINGS, ...settings });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();

  try {
    const body = await request.json();
    const db = getDbClient();

    for (const [key, value] of Object.entries(body)) {
      await db.execute({
        sql: "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
        args: [key, value as string],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
