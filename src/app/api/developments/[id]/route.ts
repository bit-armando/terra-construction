import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();

  try {
    const body = await request.json();
    const db = getDbClient();

    await db.execute({
      sql: `UPDATE developments SET
        slug = ?, name = ?, description = ?, location = ?, thumbnail = ?,
        images_json = ?, amenities_json = ?, progress = ?, available_models_json = ?,
        lat = ?, lng = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      args: [
        body.slug,
        body.name,
        body.description,
        body.location,
        body.thumbnail,
        JSON.stringify(body.images || []),
        JSON.stringify(body.amenities || []),
        body.progress,
        JSON.stringify(body.availableModels || []),
        body.lat || null,
        body.lng || null,
        params.id,
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating development:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();

  try {
    const db = getDbClient();
    await db.execute({
      sql: "DELETE FROM developments WHERE id = ?",
      args: [params.id],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting development:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
