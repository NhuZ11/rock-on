import type { Context } from "elysia";
import type { IRoute } from "../interface";
// import checkAuthentication from "@/middlewares/checkAuthentication";

import dummyRoutes from "@/modules/dummy/route";
import importRoutes from "@/modules/import/route";
import streamRoutes from "@/modules/streaming/route";
import songRoutes from "@/modules/songs/route";
import playlistRoutes from "@/modules/playlists/route";
import favoriteRoutes from "@/modules/favorites/route";
import { apiKeyMiddleware } from "@/middlewares/apiKey";


const routes: IRoute[] = [
  ...dummyRoutes,
  ...importRoutes,
  ...streamRoutes,
  ...songRoutes,
  ...playlistRoutes,
  ...favoriteRoutes,
];

const routesInit = (app: any) => {
  app.get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  }));

  routes.forEach((route) => {
    const {
      method,
      path,
      controller,
      authorization,
      authCheckType,
      body,
      tags,
    } = route as IRoute;

    const fullPath = path.startsWith("stream/")
      ? `/${path}`
      : `/api/${path}`;

    app[method](
      fullPath,
      async (ctx: Context) => {
        if (fullPath.startsWith("/api/")) {
          await apiKeyMiddleware(ctx);
        }
        return await controller(ctx);
      },
    //   {
    //     beforeHandle: authorization
    //       ? async (ctx: Context) => {
    //         await checkAuthentication(authCheckType)(ctx);
    //       }
    //       : undefined,
    //     body,
    //     detail: { tags },
    //   }
    );
  });
};

export default routesInit;
