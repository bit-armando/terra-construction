import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
  };
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  try {
    const db = getDbClient();
    const result = await db.execute("SELECT * FROM faqs ORDER BY created_at ASC");
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
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: [crypto.randomUUID(), body.question, body.answer, body.category || "general"],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
