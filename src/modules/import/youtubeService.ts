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

  // Use a unique temp ID per request to avoid file collisions
  const tmpId = `${Date.now()}`;
  const outputTemplate = path.join(env.DOWNLOAD_TMP_DIR, `${tmpId}.%(ext)s`);
  const metaJsonPath = path.join(env.DOWNLOAD_TMP_DIR, `${tmpId}.info.json`);
  const cookiesPath = path.join(env.DOWNLOAD_TMP_DIR, `${tmpId}.cookies.txt`);

  // Write YouTube cookies to a temp file if available (required on cloud servers to bypass bot detection)
  let useCookies = false;
  if (env.YOUTUBE_COOKIES) {
    await fs.promises.writeFile(cookiesPath, env.YOUTUBE_COOKIES, "utf-8");
    useCookies = true;
  }

  try {
    const cmd = [
      env.YT_DLP_PATH,
      "-o",
      outputTemplate,
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--write-info-json",
      "--no-playlist",
      "--js-runtimes", "node", // use Node.js to solve YouTube's signature/n-challenge
      ...(useCookies ? ["--cookies", cookiesPath] : []),
      url,
    ];

    const { stderr, exitCode } = await $`${cmd}`;

    if (exitCode !== 0) {
      const errText = stderr.toString();
      console.error("[yt-dlp error]", errText);
      throw new AppError(
        `yt-dlp failed (exit ${exitCode}): ${errText || "unknown error"}`,
        500,
      );
    }

    // Read the metadata from the written .info.json file
    const metaRaw = await fs.promises.readFile(metaJsonPath, "utf-8");
    const meta = JSON.parse(metaRaw) as YtDlpMetadata;
    const videoId = meta.id;

    const localFilePath = path.join(env.DOWNLOAD_TMP_DIR, `${tmpId}.mp3`);

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

    await fs.promises.unlink(localFilePath).catch(() => { });

    return song;
  } catch (err: any) {
    throw err instanceof AppError
      ? err
      : new AppError(`Failed to import YouTube audio: ${err.message}`, 500);
  } finally {
    await fs.promises.unlink(metaJsonPath).catch(() => { });
    await fs.promises.unlink(cookiesPath).catch(() => { }); // clean up cookies temp file
  }
};

