import type { Context } from "elysia";
import { sendResponse, getPagination, paginate } from "@/utils/helper";
import { AppError } from "@/utils/appError";
import { listSongs, getSongById, deleteSong } from "@/modules/supabase/songsRepo";
import { supabase } from "@/config/supabase";
import env from "@/config/env";

export const listSongsController = async ({ query, set }: Context & { query: any }) => {
  const { search, page, limit, favoriteOnly } = query as any;
  const { offset, page: pageNum, limit: limitNum } = getPagination({ page, limit });

  let songsResult = await listSongs({ search, offset, limit: limitNum });

  if (favoriteOnly === "true") {
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("song_id");

    if (error) {
      throw new AppError(`Failed to load favorites: ${error.message}`, 500);
    }

    const favSet = new Set((favorites ?? []).map((f: any) => f.song_id));
    songsResult = {
      items: songsResult.items.filter((s) => favSet.has(s.id)),
      total: songsResult.total,
    };
  }

  const pagination = paginate(songsResult.total, pageNum, limitNum);

  return sendResponse(set, 200, {
    success: true,
    data: songsResult.items,
    pagination,
  });
};

export const getSongController = async ({ params, set }: Context & { params: any }) => {
  const id = params.id as string | undefined;
  if (!id) {
    throw new AppError("Song ID is required", 400);
  }

  const song = await getSongById(id);

  return sendResponse(set, 200, {
    success: true,
    data: song,
  });
};

export const deleteSongController = async ({ params, set }: Context & { params: any }) => {
  const id = params.id as string | undefined;
  if (!id) {
    throw new AppError("Song ID is required", 400);
  }

  const song = await getSongById(id);

  await deleteSong(id);

  if (env.SUPABASE_AUDIO_BUCKET && song.storage_path) {
    await supabase.storage
      .from(env.SUPABASE_AUDIO_BUCKET)
      .remove([song.storage_path])
      .catch(() => {});
  }

  return sendResponse(set, 200, {
    success: true,
    data: null,
    message: "Song deleted",
  });
};

