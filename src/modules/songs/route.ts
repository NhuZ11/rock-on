import type { IRoute } from "@/interface";
import {
  listSongsController,
  getSongController,
  deleteSongController,
} from "./controller";

const routes: IRoute[] = [
  {
    method: "get",
    path: "songs",
    controller: listSongsController,
    tags: ["songs"],
  },
  {
    method: "get",
    path: "songs/:id",
    controller: getSongController,
    tags: ["songs"],
  },
  {
    method: "delete",
    path: "songs/:id",
    controller: deleteSongController,
    tags: ["songs"],
  },
];

export default routes;

