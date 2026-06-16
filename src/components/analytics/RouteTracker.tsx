import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../utils/analytics";

/**
 * Fires a GA4 page_view on every React Router location change. The
 * initial document load already gets a page_view from the gtag.js
 * snippet in index.html, so we skip the first navigation effect to
 * avoid double-counting.
 */
export default function RouteTracker() {
    const location = useLocation();
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}
