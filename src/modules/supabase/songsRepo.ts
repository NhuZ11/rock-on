import { supabase } from "@/config/supabase";
import { AppError } from "@/utils/appError";

export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  album?: string | null;
  duration_sec?: number | null;
  source: string;
  source_id?: string | null;
  youtube_url?: string | null;
  storage_path: string;
  file_size?: number | null;
  mime_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const createSong = async (payload: Omit<Song, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("songs")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    throw new AppError(`Failed to create song: ${error?.message ?? "Unknown error"}`, 500);
  }

  return data as Song;
};

export const getSongById = async (id: string) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new AppError("Song not found", 404);
    }
    throw new AppError(`Failed to fetch song: ${error.message}`, 500);
  }

  if (!data) {
    throw new AppError("Song not found", 404);
  }

  return data as Song;
};

export const listSongs = async (params: {
  search?: string;
  offset?: number;
  limit?: number;
}) => {
  const { search, offset = 0, limit = 20 } = params;

  let query = supabase.from("songs").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    throw new AppError(`Failed to list songs: ${error.message}`, 500);
  }

  return {
    items: (data ?? []) as Song[],
    total: count ?? 0,
  };
};

export const deleteSong = async (id: string) => {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) {
    throw new AppError(`Failed to delete song: ${error.message}`, 500);
  }
};

