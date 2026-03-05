import { supabase } from "@/config/supabase";
import env from "@/config/env";
import { AppError } from "@/utils/appError";
import * as fs from "fs";

const AUDIO_BUCKET = env.SUPABASE_AUDIO_BUCKET;

export const uploadSongFromFile = async (localPath: string, storagePath: string) => {
  if (!AUDIO_BUCKET) {
    throw new AppError("Supabase audio bucket is not configured", 500);
  }

  const fileBuffer = await fs.promises.readFile(localPath);

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) {
    throw new AppError(`Failed to upload audio to storage: ${error.message}`, 500);
  }

  const { data: publicUrlData } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(storagePath);

  return {
    path: data?.path ?? storagePath,
    publicUrl: publicUrlData.publicUrl,
    size: fileBuffer.byteLength,
  };
};

export const getSongSignedUrl = async (storagePath: string, expiresInSeconds = 60 * 60) => {
  if (!AUDIO_BUCKET) {
    throw new AppError("Supabase audio bucket is not configured", 500);
  }

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data) {
    throw new AppError(
      `Failed to generate signed URL for audio: ${error?.message ?? "Unknown error"}`,
      500,
    );
  }

  return data.signedUrl;
};

