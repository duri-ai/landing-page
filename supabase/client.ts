import { createClient } from "@supabase/supabase-js";

import { createCookieStorage } from "./cookieStorage";

/**
 * Shared Supabase browser client.
 *
 * Lives at the repository root (not under any single app's ``src``) so the
 * landing page and the forum app talk to the same project with identical
 * session handling. In production the session lives in a cookie scoped to
 * ``.duri-ai.com`` so it is shared across duri-ai.com and app.duri-ai.com
 * (single sign-on); local dev keeps the default localStorage.
 *
 * Both apps inject ``VITE_SUPABASE_URL`` /
 * ``VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`` through their own Vite env.
 */
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://placeholder.supabase.co";
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ??
  "public-anon-placeholder-key";

if (
  import.meta.env.DEV &&
  !import.meta.env.VITE_SUPABASE_URL
) {
  // Lets an app (e.g. the forum running on fake data) boot without a
  // configured project. Auth simply resolves to "signed out".
  console.warn(
    "[supabase] VITE_SUPABASE_URL is not set; using a placeholder client.",
  );
}

const host = typeof window !== "undefined" ? window.location.hostname : "";
const useCookieStorage = host === "duri-ai.com" || host.endsWith(".duri-ai.com");

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: useCookieStorage
    ? { storage: createCookieStorage(".duri-ai.com") }
    : {},
});
