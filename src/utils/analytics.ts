declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

export type GtagParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Fire a GA4 event. Safe to call before gtag.js has finished loading
 * (the snippet in index.html stubs window.dataLayer first), and a no-op
 * if the snippet was blocked by an ad-blocker.
 */
export function track(name: string, params?: GtagParams): void {
    if (typeof window === "undefined") return;
    try {
        window.gtag?.("event", name, params ?? {});
    } catch {
        // Swallow analytics errors. Never let GA take the page down.
    }
}

/**
 * Fire a page_view manually. Needed because GA4's gtag('config', ...)
 * only fires page_view on the first document load; React Router
 * navigations are SPA-only and never re-trigger it.
 */
export function trackPageView(path: string): void {
    if (typeof window === "undefined") return;
    try {
        window.gtag?.("event", "page_view", {
            page_path: path,
            page_location: window.location.href,
            page_title: document.title,
        });
    } catch {
        // ignore
    }
}
