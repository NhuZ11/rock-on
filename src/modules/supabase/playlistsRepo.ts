import { supabase } from "@/config/supabase";
import { AppError } from "@/utils/appError";

export interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PlaylistItem {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at?: string;
}

export const createPlaylist = async (payload: {
  name: string;
  description?: string | null;
}) => {
  const { data, error } = await supabase
    .from("playlists")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    throw new AppError(`Failed to create playlist: ${error?.message ?? "Unknown error"}`, 500);
  }

  return data as Playlist;
};

export const listPlaylists = async () => {
  const { data, error } = await supabase.from("playlists").select("*").order("created_at", {
    ascending: true,
  });

  if (error) {
    throw new AppError(`Failed to list playlists: ${error.message}`, 500);
  }

  return (data ?? []) as Playlist[];
};

export const getPlaylistWithItems = async (playlistId: string) => {
  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single();

  if (playlistError || !playlist) {
    throw new AppError("Playlist not found", 404);
  }

  const { data: items, error: itemsError } = await supabase
    .from("playlist_items")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (itemsError) {
    throw new AppError(`Failed to load playlist items: ${itemsError.message}`, 500);
  }

  return {
    playlist: playlist as Playlist,
    items: (items ?? []) as PlaylistItem[],
  };
};

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const { data: maxPosData, error: maxPosError } = await supabase
    .from("playlist_items")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  if (maxPosError && maxPosError.code !== "PGRST116") {
    throw new AppError(`Failed to determine playlist position: ${maxPosError.message}`, 500);
  }

  const nextPosition = (maxPosData?.position ?? 0) + 1;

  const { data, error } = await supabase
    .from("playlist_items")
    .insert({
      playlist_id: playlistId,
      song_id: songId,
      position: nextPosition,
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(`Failed to add song to playlist: ${error?.message ?? "Unknown error"}`, 500);
  }

  return data as PlaylistItem;
};

export const reorderPlaylistItems = async (playlistId: string, itemIds: string[]) => {
  const updates = itemIds.map((id, idx) => ({
    id,
    playlist_id: playlistId,
    position: idx + 1,
  }));

  const { error } = await supabase.from("playlist_items").upsert(updates, {
    onConflict: "id",
  });

  if (error) {
    throw new AppError(`Failed to reorder playlist items: ${error.message}`, 500);
  }
};

export const removePlaylistItem = async (playlistId: string, itemId: string) => {
  const { error } = await supabase
    .from("playlist_items")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("id", itemId);

  if (error) {
    throw new AppError(`Failed to remove playlist item: ${error.message}`, 500);
  }
};

