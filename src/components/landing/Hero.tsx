import { useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../utils/supabase";
import HeroProductWindow from "./HeroProductWindow";

const APPLE_LOGO = `${import.meta.env.BASE_URL}misc_images/apple.png`;
const WINDOWS_LOGO = `${import.meta.env.BASE_URL}misc_images/windows.png`;

const MAC_DOWNLOAD =
    "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD =
    "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

// WEB_TEST: temporary web build of the desktop app. When the user is
// signed in we show a chat composer above the download buttons; on
// submit we redirect (same tab) to the web build, passing the
// supabase access + refresh tokens and the typed message in the URL
// fragment so the web app can hydrate the session and prefill the
// composer. See duri_desktop_app/src/web/README.md for cleanup.
const WEB_APP_URL = "https://releases.duri-ai.com/web/test/index.html";

export default function Hero() {
    const { user } = useAuth();
    return (
        <section className="relative w-full min-w-xs overflow-hidden">
            <div className="absolute inset-0 duri-grid-bg opacity-[0.55] pointer-events-none" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background-warm pointer-events-none" aria-hidden />

            <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 pt-12 md:pt-16 pb-20 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
                    <div className="lg:col-span-7">
                        <h1 className="duri-monument">
                            <span className="block">Automate your business</span>
                            <span className="block">
                                in <span className="text-brand">plain language</span>.
                            </span>
                        </h1>

                        {/* WEB_TEST: signed-in chat composer that hands off to the web build. */}
                        {user && <WebHandoffComposer />}

                        <div className="mt-9 md:mt-12">
                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href={MAC_DOWNLOAD}
                                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-on-brand bg-brand hover:bg-background hover:text-brand border border-brand hover:border-brand-variant rounded-xs text-base px-6 py-3.5 transition-colors duration-200"
                                >
                                    <img
                                        src={APPLE_LOGO}
                                        alt=""
                                        aria-hidden
                                        className="w-4 h-4 object-contain transition-[filter] duration-200 invert group-hover:invert-0"
                                    />
                                    Download for Mac
                                </a>
                                <a
                                    href={WIN_DOWNLOAD}
                                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-base px-6 py-3.5 transition-colors duration-200"
                                >
                                    <img
                                        src={WINDOWS_LOGO}
                                        alt=""
                                        aria-hidden
                                        className="w-4 h-4 object-contain transition-[filter] duration-200 group-hover:invert"
                                    />
                                    Download for Windows
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <HeroProductWindow />
                    </div>
                </div>
            </div>
        </section>
    );
}

// WEB_TEST: signed-in-only composer that redirects to the web build
// with session tokens + message in the URL fragment. Delete this
// component along with the rest of the WEB_TEST block when the web
// surface is removed.
function WebHandoffComposer() {
    const [message, setMessage] = useState("");
    const [isHandingOff, setIsHandingOff] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || isHandingOff) return;
        setIsHandingOff(true);

        // Pull the latest session right at submit so a stale state
        // doesn't ship an expired access token.
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const params = new URLSearchParams();
        if (session?.access_token) params.set("access_token", session.access_token);
        if (session?.refresh_token) params.set("refresh_token", session.refresh_token);
        params.set("q", trimmed);

        // Same-tab redirect (not window.open) so we don't end up with
        // two tabs sharing the same refresh token — the rotation on
        // first refresh would silently invalidate one of them.
        window.location.href = `${WEB_APP_URL}#${params.toString()}`;
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-9 md:mt-12 max-w-2xl"
        >
            <div className="flex items-stretch gap-2 rounded-xs border border-divider bg-background focus-within:border-brand transition-colors duration-200">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Duri to do something…"
                    disabled={isHandingOff}
                    className="flex-1 bg-transparent px-4 py-3.5 text-base text-on-background placeholder:text-on-background-secondary focus:outline-none disabled:opacity-50"
                    aria-label="Message Duri"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || isHandingOff}
                    className="inline-flex items-center justify-center whitespace-nowrap text-on-brand bg-brand hover:bg-brand-variant border border-brand rounded-xs text-sm px-5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 m-1"
                >
                    {isHandingOff ? "Opening…" : "Send"}
                </button>
            </div>
            <p className="mt-2 text-xs text-on-background-secondary">
                Or
            </p>
        </form>
    );
}
