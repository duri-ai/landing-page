/**
 * The forum is a section of the landing app, mounted at ``/forum`` (see
 * src/App.tsx). All forum navigation is prefixed with this base; auth and
 * marketing links resolve to the landing app's own routes.
 */
export const FORUM_BASE = "/forum";

export const forumHome = (): string => FORUM_BASE;
export const forumPost = (id: string): string => `${FORUM_BASE}/p/${id}`;
export const forumNew = (): string => `${FORUM_BASE}/new`;

/** Landing-app routes the forum links out to (same SPA). */
export const LOGIN_URL = "/login";
export const HOME_URL = "/";

/** Build a login URL that returns the user to ``redirectTo`` after sign-in. */
export function loginWithRedirect(redirectTo: string): string {
  return `${LOGIN_URL}?redirect=${encodeURIComponent(redirectTo)}`;
}

/** The one standard intro shown at the top of the feed. */
export const FORUM_INTRO = {
  title: "Talk with us",
  description:
    "Ask questions, request features, and share how you run your business on Duri. The team reads every post.",
} as const;
