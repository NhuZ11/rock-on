import { $ } from "bun";
import * as path from "path";
import * as fs from "fs";
import env from "@/config/env";
import { AppError } from "@/utils/appError";
import { uploadSongFromFile } from "@/modules/supabase/storage";
import { createSong } from "@/modules/supabase/songsRepo";

interface YtDlpMetadata {
  id: string;
  title: string;
  uploader?: string;
  duration?: number;
}

const ensureTmpDir = async () => {
  try {
    await fs.promises.mkdir(env.DOWNLOAD_TMP_DIR, { recursive: true });
  } catch {
    // ignore if exists
  }
};

export const downloadAndStoreFromYoutube = async (url: string) => {
  if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
    throw new AppError("Invalid YouTube URL", 400);
  }

  await ensureTmpDir();

  const metaJsonPath = path.join(env.DOWNLOAD_TMP_DIR, "meta.json");
  const audioPath = path.join(env.DOWNLOAD_TMP_DIR, "audio.%(ext)s");

  try {
    // Fetch metadata and download audio in one go
    const cmd = [
      env.YT_DLP_PATH,
      "-o",
      audioPath,
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--print-json",
      "-o",
      path.join(env.DOWNLOAD_TMP_DIR, "%(id)s.%(ext)s"),
      url,
    ];

    const { stdout, stderr, exitCode } = await $`${cmd}`;

    if (exitCode !== 0) {
      throw new AppError(
        `yt-dlp failed: ${stderr.toString() || "unknown error"}`,
        500,
      );
    }

    const meta = JSON.parse(stdout.toString()) as YtDlpMetadata;
    const videoId = meta.id;

    const localFilePath = path.join(env.DOWNLOAD_TMP_DIR, `${videoId}.mp3`);

    const storagePath = `songs/${videoId}.mp3`;

    const uploadResult = await uploadSongFromFile(localFilePath, storagePath);

    const song = await createSong({
      title: meta.title,
      artist: meta.uploader ?? null,
      album: null,
      duration_sec: meta.duration ?? null,
      source: "youtube",
      source_id: videoId,
      youtube_url: url,
      storage_path: uploadResult.path,
      file_size: uploadResult.size,
      mime_type: "audio/mpeg",
    });

    await fs.promises.unlink(localFilePath).catch(() => {});

    return song;
  } catch (err: any) {
    throw err instanceof AppError
      ? err
      : new AppError(`Failed to import YouTube audio: ${err.message}`, 500);
  } finally {
    await fs.promises.unlink(metaJsonPath).catch(() => {});
  }
};

