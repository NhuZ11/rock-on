import type { Context } from "elysia";
import { sendResponse } from "@/utils/helper";
import { toggleFavorite } from "@/modules/supabase/favoritesRepo";
import { AppError } from "@/utils/appError";

export const toggleFavoriteController = async ({ params, set }: Context & { params: any }) => {
  const songId = params.songId as string | undefined;

  if (!songId) {
    throw new AppError("Song ID is required", 400);
  }

  const result = await toggleFavorite(songId);

  return sendResponse(set, 200, {
    success: true,
    data: result,
  });
};

