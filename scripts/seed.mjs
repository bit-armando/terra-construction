import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  console.log("Limpiando tablas...");
  await client.batch([
    "DELETE FROM models",
    "DELETE FROM developments",
    "DELETE FROM testimonials",
    "DELETE FROM faqs",
    "DELETE FROM team_members",
  ], "write");

  console.log("Insertando desarrollos...");
  await client.batch([
    {
      sql: `INSERT INTO developments (id, slug, name, description, location, thumbnail, images_json, amenities_json, progress, available_models_json, lat, lng, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "dev-1",
        "villas-del-pedregal",
        "Villas del Pedregal",
        "Residencial privado al norte de Querétaro con acceso controlado, áreas verdes y una arquitectura contemporánea que combina confort y seguridad para toda la familia.",
        "Querétaro, Qro.",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        JSON.stringify([
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        ]),
        JSON.stringify(["Alberca", "Gimnasio", "Seguridad 24/7", "Juegos infantiles", "Mascotas permitidas", "Jogging track"]),
        85,
        JSON.stringify(["modelo-cedar", "modelo-maple", "modelo-oak"]),
        20.6597,
        -100.3748,
        1,
      ],
    },
    {
      sql: `INSERT INTO developments (id, slug, name, description, location, thumbnail, images_json, amenities_json, progress, available_models_json, lat, lng, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "dev-2",
        "parque-central-sjr",
        "Parque Central SJR",
        "Desarrollo habitacional en San Juan del Río con amplias áreas comunes, parque central y diseño urbano pensado para familias jóvenes con acceso a servicios y vías principales.",
        "San Juan del Río, Qro.",
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        JSON.stringify([
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        ]),
        JSON.stringify(["Parque central", "Seguridad 24/7", "Eventos comunitarios", "Juegos infantiles"]),
        100,
        JSON.stringify(["modelo-birch", "modelo-pine"]),
        20.3908,
        -99.9955,
        1,
      ],
    },
  ], "write");

  console.log("Insertando modelos...");
  await client.batch([
    {
      sql: `INSERT INTO models (id, slug, name, description, price, price_from, bedrooms, bathrooms, sqm, parking, status, images_json, thumbnail, location, development, features_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "mod-1", "modelo-cedar", "Modelo Cedar",
        "Casa de un nivel con diseño abierto, amplia sala-comedor integrada a jardín trasero. Ideal para parejas o familias pequeñas que buscan funcionalidad y comodidad.",
        1490000, 0, 2, 2, 72, 1, "available",
        JSON.stringify([
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        ]),
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        "Querétaro, Qro.", "villas-del-pedregal",
        JSON.stringify(["Cocina equipada", "Jardín trasero", "Closets en recámaras", "Piso de porcelanato", "Fraccionamiento privado"]),
      ],
    },
    {
      sql: `INSERT INTO models (id, slug, name, description, price, price_from, bedrooms, bathrooms, sqm, parking, status, images_json, thumbnail, location, development, features_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "mod-2", "modelo-maple", "Modelo Maple",
        "Casa de dos niveles con recámara principal en planta alta con baño completo. Sala, comedor y cocina integrados en planta baja con vista al jardín.",
        1890000, 0, 3, 2.5, 98, 2, "available",
        JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        ]),
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "Querétaro, Qro.", "villas-del-pedregal",
        JSON.stringify(["Recámara principal con baño y walk-in closet", "Terraza privada", "Cochera techada doble", "Cocina integral", "Fraccionamiento privado"]),
      ],
    },
    {
      sql: `INSERT INTO models (id, slug, name, description, price, price_from, bedrooms, bathrooms, sqm, parking, status, images_json, thumbnail, location, development, features_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "mod-3", "modelo-oak", "Modelo Oak",
        "Residencia de dos plantas con 4 recámaras, diseño premium y acabados de alta calidad. Cuenta con estudio en planta baja y amplio jardín con zona de asador.",
        2490000, 0, 4, 3, 135, 2, "last-units",
        JSON.stringify([
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
        ]),
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "Querétaro, Qro.", "villas-del-pedregal",
        JSON.stringify(["Estudio en PB", "Zona de asador", "Recámara principal con jacuzzi", "Paneles solares", "Smart home básico", "Fraccionamiento privado"]),
      ],
    },
    {
      sql: `INSERT INTO models (id, slug, name, description, price, price_from, bedrooms, bathrooms, sqm, parking, status, images_json, thumbnail, location, development, features_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "mod-4", "modelo-birch", "Modelo Birch",
        "Casa de un nivel perfecta para primeros compradores. Diseño eficiente con sala-comedor, dos recámaras y patio trasero. Compatible con crédito INFONAVIT.",
        1190000, 1, 2, 1, 58, 1, "available",
        JSON.stringify([
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
        ]),
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        "San Juan del Río, Qro.", "parque-central-sjr",
        JSON.stringify(["INFONAVIT y FOVISSSTE", "Patio trasero", "Cocina con muebles básicos", "Fraccionamiento con parque"]),
      ],
    },
    {
      sql: `INSERT INTO models (id, slug, name, description, price, price_from, bedrooms, bathrooms, sqm, parking, status, images_json, thumbnail, location, development, features_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "mod-5", "modelo-pine", "Modelo Pine",
        "Casa de dos niveles con 3 recámaras en San Juan del Río. Cocina abierta al área social, jardín y acceso directo al parque central del fraccionamiento.",
        1650000, 0, 3, 2, 85, 1, "pre-sale",
        JSON.stringify([
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
        ]),
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80",
        "San Juan del Río, Qro.", "parque-central-sjr",
        JSON.stringify(["Preventa con precio preferencial", "Frente al parque central", "Cocina abierta", "Crédito bancario e INFONAVIT"]),
      ],
    },
  ], "write");

  console.log("Insertando testimonios...");
  await client.batch([
    {
      sql: `INSERT INTO testimonials (id, name, photo, model, review, rating, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["test-1", "Laura Martínez", "https://randomuser.me/api/portraits/women/44.jpg", "Modelo Maple", "El proceso fue muy claro desde el inicio. Nos acompañaron en cada paso del crédito INFONAVIT y la casa quedó lista antes de lo prometido. Muy satisfechos.", 5, "Marzo 2025"],
    },
    {
      sql: `INSERT INTO testimonials (id, name, photo, model, review, rating, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["test-2", "Carlos Hernández", "https://randomuser.me/api/portraits/men/32.jpg", "Modelo Cedar", "Buscábamos algo funcional y bonito sin salirnos del presupuesto. El Modelo Cedar fue justo lo que necesitábamos. La atención del equipo de ventas fue excelente.", 5, "Enero 2025"],
    },
    {
      sql: `INSERT INTO testimonials (id, name, photo, model, review, rating, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["test-3", "Diana Flores", "https://randomuser.me/api/portraits/women/68.jpg", "Modelo Oak", "Invertimos en el Modelo Oak y superó nuestras expectativas. Los acabados son de primera, el fraccionamiento es muy seguro y la ubicación en Querétaro es inmejorable.", 5, "Febrero 2025"],
    },
    {
      sql: `INSERT INTO testimonials (id, name, photo, model, review, rating, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["test-4", "Roberto Sánchez", "https://randomuser.me/api/portraits/men/55.jpg", "Modelo Birch", "Primera casa propia. No sabíamos nada de créditos y el equipo de Terra nos explicó todo. El Modelo Birch es perfecto para empezar. 100% recomendado.", 5, "Abril 2025"],
    },
  ], "write");

  console.log("Insertando FAQs...");
  await client.batch([
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-1", "¿Qué tipos de crédito aceptan?", "Aceptamos crédito INFONAVIT, FOVISSSTE, bancario (Banamex, BBVA, Santander, HSBC) y cofinavit (combinación INFONAVIT + banco). Nuestros asesores te ayudan a determinar la mejor opción según tu perfil.", "financiamiento"],
    },
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-2", "¿Cuánto tiempo tarda el proceso de compra?", "El proceso completo, desde la reserva hasta la escrituración, toma entre 45 y 90 días hábiles dependiendo del tipo de crédito. Con crédito bancario puede ser más rápido.", "proceso"],
    },
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-3", "¿Cuál es el enganche mínimo requerido?", "Para crédito bancario el enganche mínimo es del 10% del valor de la casa. Para INFONAVIT y FOVISSSTE depende de tu subrogación y puntos acumulados. Contáctanos para un análisis personalizado.", "financiamiento"],
    },
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-4", "¿Los precios incluyen escrituración?", "Los precios publicados son el valor del inmueble. Los gastos de escrituración (notaría, impuestos) se calculan aparte y representan aproximadamente el 4-6% del valor de la propiedad.", "precios"],
    },
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-5", "¿Puedo visitar las casas muestra?", "Sí, contamos con casas muestra en nuestros dos desarrollos. El horario de visita es de lunes a sábado de 9:00 a 18:00 hrs. También ofrecemos tours virtuales en línea.", "visitas"],
    },
    {
      sql: `INSERT INTO faqs (id, question, answer, category) VALUES (?, ?, ?, ?)`,
      args: ["faq-6", "¿Las casas incluyen garantías?", "Sí, ofrecemos garantía de 1 año en impermeabilización, 3 años en instalaciones hidráulicas y eléctricas, y 5 años en estructura. Todo respaldado por nuestra empresa.", "garantías"],
    },
  ], "write");

  console.log("Insertando equipo...");
  await client.batch([
    {
      sql: `INSERT INTO team_members (id, name, role, photo, phone, zone) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ["team-1", "Ana García", "Asesora de Ventas", "https://randomuser.me/api/portraits/women/26.jpg", "4421234567", "Querétaro Norte"],
    },
    {
      sql: `INSERT INTO team_members (id, name, role, photo, phone, zone) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ["team-2", "Miguel Torres", "Asesor de Ventas", "https://randomuser.me/api/portraits/men/41.jpg", "4427654321", "Querétaro Sur"],
    },
    {
      sql: `INSERT INTO team_members (id, name, role, photo, phone, zone) VALUES (?, ?, ?, ?, ?, ?)`,
      args: ["team-3", "Sofía Ramírez", "Asesora de Crédito", "https://randomuser.me/api/portraits/women/52.jpg", "4271234321", "San Juan del Río"],
    },
  ], "write");

  console.log("✓ Seed completado.");
  await client.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
