import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";
import { verifyAdminToken, getAuthErrorResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return getAuthErrorResponse();

  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Error al sembrar datos" }, { status: 500 });
  }
}
