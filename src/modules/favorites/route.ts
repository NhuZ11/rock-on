import type { IRoute } from "@/interface";
import { toggleFavoriteController } from "./controller";

const routes: IRoute[] = [
  {
    method: "post",
    path: "favorites/:songId/toggle",
    controller: toggleFavoriteController,
    tags: ["favorites"],
  },
];

export default routes;

