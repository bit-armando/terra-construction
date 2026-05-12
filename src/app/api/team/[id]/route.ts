import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();
  try {
    const body = await request.json();
    const db = getDbClient();
    await db.execute({
      sql: `UPDATE team_members SET name=?, role=?, photo=?, phone=?, zone=? WHERE id=?`,
      args: [body.name, body.role, body.photo || "", body.phone || "", body.zone || null, params.id],
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
    await db.execute({ sql: "DELETE FROM team_members WHERE id=?", args: [params.id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
