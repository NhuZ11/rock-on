import { Elysia } from "elysia";
import { logger } from "@/config/logger";

export const errorHandler = (app: Elysia) => {
  return app.onError(({ error, set, request }) => {
    let status = 500;
    let message = (error as any).message || "Internal Server Error";

    switch (message) {
      case "jwt expired":
      case "jwt malformed":
      case "Unauthorized":
      case "UNAUTHORIZED":
      case "Invalid API Key":   
        status = 401;
        break;
      case "NOT_FOUND":
      case "User not found":
        status = 404;
        break;
    }

    set.status = status;

    logger.error({
      method: request.method,
      path: request.url,
      status,
      message,
      stack: (error as any).stack,
    });

    return {
      success: false,
      statusCode: status,
      message,
    };
  });
};
