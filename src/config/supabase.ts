import { createClient } from "@supabase/supabase-js";
import env from "./env";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase environment variables are not configured correctly");
}

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
  },
});

