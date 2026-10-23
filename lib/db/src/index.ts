import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. SHOPSHUD does not use a mock database.");
}

const { Pool } = pg;
export const pool = new Pool({
  connectionString,
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

export const db = drizzle(pool, { schema });
export * from "./schema";
