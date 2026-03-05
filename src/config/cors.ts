import cors from "@elysiajs/cors";

export const allowOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  // add your deployed PWA domains here, e.g.:
  // "https://rockon.yourdomain.com",
];

const corsOptions = cors({
  origin: (request: Request) => {
    const origin = request.headers.get("origin");

    // Allow non-browser requests (Postman, server-to-server)
    if (!origin) return true;

    return allowOrigins.includes(origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Api-Key"],
});

export default corsOptions;