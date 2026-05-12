import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    location: row.location as string,
    thumbnail: row.thumbnail as string,
    images: JSON.parse((row.images_json as string) || "[]"),
    amenities: JSON.parse((row.amenities_json as string) || "[]"),
    progress: row.progress as number,
    availableModels: JSON.parse((row.available_models_json as string) || "[]"),
    coordinates: row.lat ? { lat: row.lat as number, lng: row.lng as number } : undefined,
  };
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  try {
    const db = getDbClient();
    const result = await db.execute("SELECT * FROM developments ORDER BY name");
    return NextResponse.json(result.rows.map(mapRow));
  } catch (error) {
    console.error("Error fetching developments:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();
  try {
    const body = await request.json();
    const db = getDbClient();
    await db.execute({
      sql: `INSERT INTO developments (id, slug, name, description, location, thumbnail, images_json, amenities_json, progress, available_models_json, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [crypto.randomUUID(), body.slug, body.name, body.description, body.location, body.thumbnail, JSON.stringify(body.images || []), JSON.stringify(body.amenities || []), body.progress, JSON.stringify(body.availableModels || []), body.lat || null, body.lng || null],
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}
