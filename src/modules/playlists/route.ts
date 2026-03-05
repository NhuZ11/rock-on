import type { IRoute } from "@/interface";
import {
  listPlaylistsController,
  createPlaylistController,
  getPlaylistController,
  addPlaylistItemController,
  reorderPlaylistItemsController,
  removePlaylistItemController,
} from "./controller";

const routes: IRoute[] = [
  {
    method: "get",
    path: "playlists",
    controller: listPlaylistsController,
    tags: ["playlists"],
  },
  {
    method: "post",
    path: "playlists",
    controller: createPlaylistController,
    tags: ["playlists"],
  },
  {
    method: "get",
    path: "playlists/:id",
    controller: getPlaylistController,
    tags: ["playlists"],
  },
  {
    method: "post",
    path: "playlists/:id/items",
    controller: addPlaylistItemController,
    tags: ["playlists"],
  },
  {
    method: "patch",
    path: "playlists/:id/reorder",
    controller: reorderPlaylistItemsController,
    tags: ["playlists"],
  },
  {
    method: "delete",
    path: "playlists/:id/items/:itemId",
    controller: removePlaylistItemController,
    tags: ["playlists"],
  },
];

export default routes;

