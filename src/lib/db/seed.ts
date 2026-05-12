import { getDbClient } from "./client";
import { houseModels } from "@/data/models";
import { developments } from "@/data/developments";
import { testimonials } from "@/data/testimonials";
import { faqs } from "@/data/faq";
import { teamMembers } from "@/data/team";

export async function seedDatabase() {
  const db = getDbClient();

  for (const model of houseModels) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO models (
        id, slug, name, description, price, price_from, bedrooms, bathrooms,
        sqm, parking, status, images_json, thumbnail, location, development,
        features_json, plan_url, video_url, virtual_tour, similar_models_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        model.id,
        model.slug,
        model.name,
        model.description,
        model.price,
        model.priceFrom ? 1 : 0,
        model.bedrooms,
        model.bathrooms,
        model.sqm,
        model.parking,
        model.status,
        JSON.stringify(model.images),
        model.thumbnail,
        model.location,
        model.development,
        JSON.stringify(model.features),
        model.planUrl || null,
        model.videoUrl || null,
        model.virtualTour || null,
        JSON.stringify(model.similarModels || []),
      ],
    });
  }

  for (const dev of developments) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO developments (
        id, slug, name, description, location, thumbnail, images_json,
        amenities_json, progress, available_models_json, lat, lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        dev.id,
        dev.slug,
        dev.name,
        dev.description,
        dev.location,
        dev.thumbnail,
        JSON.stringify(dev.images),
        JSON.stringify(dev.amenities),
        dev.progress,
        JSON.stringify(dev.availableModels),
        dev.coordinates?.lat || null,
        dev.coordinates?.lng || null,
      ],
    });
  }

  for (const t of testimonials) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO testimonials (
        id, name, photo, model, review, rating, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [t.id, t.name, t.photo, t.model, t.review, t.rating, t.date],
    });
  }

  for (const faq of faqs) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO faqs (
        id, question, answer, category
      ) VALUES (?, ?, ?, ?)`,
      args: [faq.id, faq.question, faq.answer, faq.category],
    });
  }

  for (const member of teamMembers) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO team_members (
        id, name, role, photo, phone, zone
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [member.id, member.name, member.role, member.photo, member.phone, member.zone || null],
    });
  }

  return { success: true, message: "Base de datos sembrada correctamente" };
}
