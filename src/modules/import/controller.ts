import type { Context } from "elysia";
import { sendResponse } from "@/utils/helper";
import { downloadAndStoreFromYoutube } from "./youtubeService";

export const importFromYoutubeController = async ({ body, set }: Context & { body: any }) => {
  const { url } = body ?? {};

  if (!url) {
    set.status = 400;
    return { success: false, message: "URL is required" };
  }

  const song = await downloadAndStoreFromYoutube(url);

  return sendResponse(set, 201, {
    success: true,
    data: song,
  });
};

