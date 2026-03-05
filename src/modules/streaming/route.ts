import type { IRoute } from "@/interface";
import { streamSongController } from "./controller";

const routes: IRoute[] = [
  {
    method: "get",
    path: "stream/:songId",
    controller: streamSongController,
    tags: ["stream"],
  },
];

export default routes;

