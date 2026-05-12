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
      sql: `UPDATE models SET
        slug = ?, name = ?, description = ?, price = ?, price_from = ?,
        bedrooms = ?, bathrooms = ?, sqm = ?, parking = ?, status = ?,
        images_json = ?, thumbnail = ?, location = ?, development = ?,
        features_json = ?, plan_url = ?, video_url = ?, virtual_tour = ?,
        similar_models_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      args: [
        body.slug,
        body.name,
        body.description,
        body.price,
        body.priceFrom ? 1 : 0,
        body.bedrooms,
        body.bathrooms,
        body.sqm,
        body.parking,
        body.status,
        JSON.stringify(body.images || []),
        body.thumbnail,
        body.location,
        body.development,
        JSON.stringify(body.features || []),
        body.planUrl || null,
        body.videoUrl || null,
        body.virtualTour || null,
        JSON.stringify(body.similarModels || []),
        params.id,
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating model:", error);
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
    await db.execute({ sql: "DELETE FROM models WHERE id = ?", args: [params.id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting model:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
