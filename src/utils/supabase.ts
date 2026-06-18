import { createClient } from "@supabase/supabase-js";

import { createCookieStorage } from "./cookieStorage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string;

// In production the session lives in a cookie scoped to ``.duri-ai.com``
// so it is shared with the web app at app.duri-ai.com (single sign-on).
// Local dev (localhost) keeps the default localStorage.
const host = typeof window !== "undefined" ? window.location.hostname : "";
const useCookieStorage = host === "duri-ai.com" || host.endsWith(".duri-ai.com");

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: useCookieStorage
    ? { storage: createCookieStorage(".duri-ai.com") }
    : {},
});

