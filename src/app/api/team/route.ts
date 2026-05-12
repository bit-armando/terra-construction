import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    role: row.role as string,
    photo: row.photo as string,
    phone: row.phone as string,
    zone: (row.zone as string | null) ?? undefined,
  };
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  try {
    const db = getDbClient();
    const result = await db.execute("SELECT * FROM team_members ORDER BY name ASC");
    return NextResponse.json(result.rows.map(mapRow));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();
  try {
    const body = await request.json();
    const db = getDbClient();
    await db.execute({
      sql: `INSERT INTO team_members (id, name, role, photo, phone, zone) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [crypto.randomUUID(), body.name, body.role, body.photo || "", body.phone || "", body.zone || null],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
