import { supabase } from "@/config/supabase";
import { AppError } from "@/utils/appError";

export interface Favorite {
  id: string;
  song_id: string;
  created_at?: string;
}

export const isFavorite = async (songId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("song_id", songId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to check favorite: ${error.message}`, 500);
  }

  return !!data;
};

export const toggleFavorite = async (songId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("song_id", songId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to toggle favorite: ${error.message}`, 500);
  }

  if (data) {
    const { error: deleteError } = await supabase.from("favorites").delete().eq("id", data.id);

    if (deleteError) {
      throw new AppError(`Failed to remove favorite: ${deleteError.message}`, 500);
    }

    return { isFavorite: false };
  }

  const { data: created, error: createError } = await supabase
    .from("favorites")
    .insert({ song_id: songId })
    .select()
    .single();

  if (createError || !created) {
    throw new AppError(`Failed to add favorite: ${createError?.message ?? "Unknown error"}`, 500);
  }

  return { isFavorite: true };
};

