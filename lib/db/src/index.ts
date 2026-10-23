import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const { Pool } = pg;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pool: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on("error", (error: unknown) => {
      console.error("Unexpected PostgreSQL pool error", error);
    });
    db = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[AI Studio] Database pool failed to initialize — using mock", err);
  }
}

if (!pool) {
  console.warn("[AI Studio] DATABASE_URL not connected — mock active");
  pool = {
    query: async () => ({ rows: [], rowCount: 0 }),
    connect: async () => ({
      query: async () => ({ rows: [], rowCount: 0 }),
      release: () => {},
    }),
    on: () => {},
  };
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: unknown) => (d && typeof d === "object" && "data" in d ? (d as { data: unknown }).data : {}),
    update: async (d: unknown) => (d && typeof d === "object" && "data" in d ? (d as { data: unknown }).data : {}),
    delete: async () => ({}),
  };
  db = new Proxy({}, {
    get: (_, prop) => prop === "query" ? new Proxy({}, { get: () => noOp }) : async () => [],
  });
}

export { pool, db };
export * from "./schema";
