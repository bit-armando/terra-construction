import { NextRequest, NextResponse } from "next/server";
import { getDbClient, isDbConfigured } from "@/lib/db/client";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

function mapRowToModel(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    priceFrom: Boolean(row.price_from),
    bedrooms: row.bedrooms as number,
    bathrooms: row.bathrooms as number,
    sqm: row.sqm as number,
    parking: row.parking as number,
    status: row.status as string,
    images: JSON.parse((row.images_json as string) || "[]"),
    thumbnail: row.thumbnail as string,
    location: row.location as string,
    development: row.development as string,
    features: JSON.parse((row.features_json as string) || "[]"),
    planUrl: row.plan_url as string | undefined,
    videoUrl: row.video_url as string | undefined,
    virtualTour: row.virtual_tour as string | undefined,
    similarModels: JSON.parse((row.similar_models_json as string) || "[]"),
  };
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  try {
    const db = getDbClient();
    const result = await db.execute("SELECT * FROM models ORDER BY price ASC");
    return NextResponse.json(result.rows.map(mapRowToModel));
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();

  try {
    const body = await request.json();
    const db = getDbClient();

    await db.execute({
      sql: `INSERT INTO models (
        id, slug, name, description, price, price_from, bedrooms, bathrooms,
        sqm, parking, status, images_json, thumbnail, location, development,
        features_json, plan_url, video_url, virtual_tour, similar_models_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
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
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json({ error: "Error al crear modelo" }, { status: 500 });
  }
}
