import type { Context } from "elysia";
import { sendResponse } from "@/utils/helper";
import {
  createPlaylist,
  listPlaylists,
  getPlaylistWithItems,
  addSongToPlaylist,
  reorderPlaylistItems,
  removePlaylistItem,
} from "@/modules/supabase/playlistsRepo";
import { AppError } from "@/utils/appError";

export const listPlaylistsController = async ({ set }: Context) => {
  const playlists = await listPlaylists();

  return sendResponse(set, 200, {
    success: true,
    data: playlists,
  });
};

export const createPlaylistController = async ({ body, set }: Context & { body: any }) => {
  const { name, description } = body ?? {};

  if (!name) {
    throw new AppError("Playlist name is required", 400);
  }

  const playlist = await createPlaylist({ name, description });

  return sendResponse(set, 201, {
    success: true,
    data: playlist,
  });
};

export const getPlaylistController = async ({ params, set }: Context & { params: any }) => {
  const id = params.id as string | undefined;

  if (!id) {
    throw new AppError("Playlist ID is required", 400);
  }

  const result = await getPlaylistWithItems(id);

  return sendResponse(set, 200, {
    success: true,
    data: result,
  });
};

export const addPlaylistItemController = async ({
  params,
  body,
  set,
}: Context & { params: any; body: any }) => {
  const playlistId = params.id as string | undefined;
  const { songId } = body ?? {};

  if (!playlistId || !songId) {
    throw new AppError("Playlist ID and songId are required", 400);
  }

  const item = await addSongToPlaylist(playlistId, songId);

  return sendResponse(set, 201, {
    success: true,
    data: item,
  });
};

export const reorderPlaylistItemsController = async ({
  params,
  body,
  set,
}: Context & { params: any; body: any }) => {
  const playlistId = params.id as string | undefined;
  const { itemIds } = body ?? {};

  if (!playlistId || !Array.isArray(itemIds)) {
    throw new AppError("Playlist ID and itemIds are required", 400);
  }

  await reorderPlaylistItems(playlistId, itemIds);

  return sendResponse(set, 200, {
    success: true,
    data: null,
    message: "Playlist reordered",
  });
};

export const removePlaylistItemController = async ({
  params,
  set,
}: Context & { params: any }) => {
  const playlistId = params.id as string | undefined;
  const itemId = params.itemId as string | undefined;

  if (!playlistId || !itemId) {
    throw new AppError("Playlist ID and itemId are required", 400);
  }

  await removePlaylistItem(playlistId, itemId);

  return sendResponse(set, 200, {
    success: true,
    data: null,
    message: "Playlist item removed",
  });
};

