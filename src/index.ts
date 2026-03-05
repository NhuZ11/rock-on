import "dotenv/config";
import env from "./config/env";
import server from "@/config/server";
import routesInit from "./routes";

routesInit(server);

server.listen({ port: env.PORT }, () => {
  console.log(`✅ Server running at http://0.0.0.0:${env.PORT}`);
  console.log(`✅ Database URL: ${env.DATABASE_URL}`);
});
