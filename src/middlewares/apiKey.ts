import type { Context } from "elysia";
import env from "@/config/env";
import { AppError } from "@/utils/appError";

export const apiKeyMiddleware = async (ctx: Context) => {
  const apiKeyHeader = ctx.request.headers.get("Api-Key") ?? ctx.request.headers.get("api-key");

  if (!env.ROCKON_API_KEY) {
    // If no API key is configured, allow all (useful for local dev)
    return;
  }

  if (!apiKeyHeader || apiKeyHeader !== env.ROCKON_API_KEY) {
    throw new AppError("Invalid API Key", 401);
  }
};

