import type { Context } from "elysia";
import { getSongById } from "@/modules/supabase/songsRepo";
import { getSongSignedUrl } from "@/modules/supabase/storage";
import { AppError } from "@/utils/appError";

export const streamSongController = async ({ params, request }: Context & { params: any }) => {
  const songId = params.songId as string | undefined;

  if (!songId) {
    throw new AppError("Song ID is required", 400);
  }

  const song = await getSongById(songId);

  const signedUrl = await getSongSignedUrl(song.storage_path);

  const range = request.headers.get("range") ?? request.headers.get("Range") ?? undefined;

  const upstreamResponse = await fetch(signedUrl, {
    headers: range ? { Range: range } : undefined,
  });

  if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
    throw new AppError("Failed to stream audio", 502);
  }

  const headers = new Headers();
  const passthroughHeaders = [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "cache-control",
  ];

  passthroughHeaders.forEach((name) => {
    const value = upstreamResponse.headers.get(name);
    if (value) headers.set(name, value);
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
};

