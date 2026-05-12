import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    photo: row.photo as string,
    model: row.model as string,
    review: row.review as string,
    rating: row.rating as number,
    date: row.date as string,
  };
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  try {
    const db = getDbClient();
    const result = await db.execute("SELECT * FROM testimonials ORDER BY created_at DESC");
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
      sql: `INSERT INTO testimonials (id, name, photo, model, review, rating, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        body.name,
        body.photo || "",
        body.model || "",
        body.review,
        body.rating ?? 5,
        body.date || new Date().toISOString().slice(0, 10),
      ],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
