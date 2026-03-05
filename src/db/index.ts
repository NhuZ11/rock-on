import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import env from "@/config/env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,

  // Pool sizing
  max: 50,
  min: 0,

  // Timeouts
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 15000,
  query_timeout: 30000,

  // Keepalive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

if (env.NODE_ENV === "development") {
  pool.on("connect", () => {
    console.log(
      `🔌 DB connected | Total: ${pool.totalCount}, Idle: ${pool.idleCount}`
    );
  });
}

pool.on("error", (err) => {
  console.error("❌ Database pool error:", err);
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n🔄 ${signal} received. Closing DB pool...`);
  try {
    await pool.end();
    console.log("✅ DB pool closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ DB shutdown failed:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === "development",
});
