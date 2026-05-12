import { createClient, Client } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let client: Client | null = null;

export function getDbClient(): Client {
  if (client) return client;

  if (!TURSO_DATABASE_URL) {
    throw new Error(
      "TURSO_DATABASE_URL no está configurado. Usa el modo mock o configura Turso."
    );
  }

  client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  return client;
}

export function isDbConfigured(): boolean {
  return !!TURSO_DATABASE_URL;
}
