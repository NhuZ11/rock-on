import dotenv from "dotenv";

dotenv.config();

const env: any = {
  APP_NAME: process.env.APP_NAME || "rockon",
  MODE: process.env.MODE,
  PORT: process.env.PORT || "3000",
  JWT_SECRET: process.env.JWT_SECRET,
  RESPONSE_SECRET: process.env.RESPONSE_SECRET,
  API_KEY: process.env.API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  TIMEZONE: "Asia/Kathmandu",
  // Redis configuration for queue
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

  // Supabase configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_AUDIO_BUCKET:
    process.env.SUPABASE_AUDIO_BUCKET || "rockon-audio",

  // YouTube download configuration
  YT_DLP_PATH: process.env.YT_DLP_PATH || "yt-dlp",
  DOWNLOAD_TMP_DIR: process.env.DOWNLOAD_TMP_DIR || "/tmp/rockon",

  // RockOn API key for single-user protection
  ROCKON_API_KEY: process.env.ROCKON_API_KEY || process.env.API_KEY,
};

export default env;
