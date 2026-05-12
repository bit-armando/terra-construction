import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();
  try {
    const body = await request.json();
    const db = getDbClient();
    await db.execute({
      sql: `UPDATE testimonials SET name=?, photo=?, model=?, review=?, rating=?, date=? WHERE id=?`,
      args: [body.name, body.photo || "", body.model || "", body.review, body.rating ?? 5, body.date, params.id],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();
  try {
    const db = getDbClient();
    await db.execute({ sql: "DELETE FROM testimonials WHERE id=?", args: [params.id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
