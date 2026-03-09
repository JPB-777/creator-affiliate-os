import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function isNeonUrl(url: string) {
  return url.includes(".neon.tech") || url.includes("neon.tech");
}

const databaseUrl = process.env.DATABASE_URL!;
const driver =
  process.env.DB_DRIVER || (isNeonUrl(databaseUrl) ? "neon" : "postgres");

function createDb() {
  if (driver === "neon") {
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const postgres = require("postgres");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/postgres-js");
    const sql = postgres(databaseUrl);
    return drizzle(sql, { schema }) as ReturnType<typeof drizzleNeon<typeof schema>>;
  }
}

export const db = createDb();
