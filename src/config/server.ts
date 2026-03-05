// server.ts
import { Elysia } from "elysia";
import type { Context } from "elysia";
import cors from "./cors";
import helmet from "@/config/helmet";
import { logger } from "@/config/logger";
import { AppError } from "@/utils/appError";


const server = new Elysia({
  serve: {
    maxRequestBodySize: 1024 * 1024 * 100, // 100MB
  },
});

// --------------------- Middlewares ---------------------
server
  .use(cors)
  .use(helmet)
  .onBeforeHandle(async ({ request }: Context) => {
    // Apply API key check only if route requires it
    // if (request.headers.has("Api-Key")) {
    //   await checkApiKey(request);
    // }
  })

// --------------------- Health Check ---------------------
server.get("/", () => ({
  message: "API is running",
  timestamp: new Date().toISOString(),
}));

// --------------------- Error Handler ---------------------
server.onError(({ error, set }: { error: any; set: any }) => {
  // Use AppError if thrown
  if (error instanceof AppError) {
    set.status = error.statusCode;
    logger.warn({ message: error.message, status: set.status }, "AppError");
    return { success: false, message: error.message };
  }

  // Handle Joi validation errors
  if (error && (error as any).isJoi) {
    set.status = 400;
    const errorDetails = (error as any).details.map((detail: any) => ({
      field: detail.context.key,
      message: detail.message,
    }));
    logger.warn({ message: "Validation error", errors: errorDetails }, "JoiValidationError");
    return { success: false, message: "Validation error", errors: errorDetails };
  }

  // JWT / Auth errors
  if (error instanceof Error) {
    if (
      ["jwt expired", "jwt malformed", "Unauthorized", "UNAUTHORIZED"].includes(
        error.message
      )
    ) {
      set.status = 401;
      logger.warn({ message: error.message }, "AuthError");
      return { success: false, message: "Unauthorized" };
    }

    if (["Invalid API Key"].includes(error.message)) {
      set.status = 401;
      logger.warn({ message: error.message }, "APIKeyError");
      return { success: false, message: "Invalid API Key" };
    }

    if (["NOT_FOUND", "User not found"].includes(error.message)) {
      set.status = 404;
      logger.warn({ message: error.message }, "NotFound");
      return { success: false, message: "Not Found" };
    }
  }

  // Default internal server error
  set.status = 500;
  logger.error({ err: error }, "UnhandledError");
  return { success: false, message: "Internal Server Error" };
});

export default server;