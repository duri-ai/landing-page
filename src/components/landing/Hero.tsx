import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, MonitorIcon, PlayIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { integrations } from "../../utils/marketingContent";
import { track, trackOutbound } from "../../utils/analytics";
import HeroProductWindow from "./HeroProductWindow";

const base = import.meta.env.BASE_URL;

const APPLE_LOGO = `${base}misc_images/apple.png`;
const WINDOWS_LOGO = `${base}misc_images/windows.png`;
const MAC_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";
const APP_URL = "https://app.duri-ai.com";

export default function Hero() {
    const [isMac, setIsMac] = useState(true);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const ua = navigator.userAgent;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (/Win/i.test(ua)) setIsMac(false);
        else if (/Mac/i.test(ua) && !/(iPhone|iPad|iPod)/i.test(ua)) setIsMac(true);
    }, []);

    useEffect(() => {
        if (!downloadOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
                setDownloadOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setDownloadOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [downloadOpen]);

    // Detected OS first in the desktop-download menu.
    const downloads = [
        { os: "mac", label: "Download for macOS", href: MAC_DOWNLOAD, logo: APPLE_LOGO },
        { os: "win", label: "Download for Windows", href: WIN_DOWNLOAD, logo: WINDOWS_LOGO },
    ];
    const orderedDownloads = isMac ? downloads : [downloads[1], downloads[0]];

    const scrollToDemo = () => {
        track("book_demo_click", { source: "hero_mobile" });
        document.getElementById("talk-to-us")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section className="relative w-full bg-background overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.4] pointer-events-none"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--brand) 8%, transparent) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, transparent, var(--background) 80%)",
                }}
            />
            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-16 md:pb-24">
                <div id="download" className="text-left sm:text-center">
                    <p className="text-sm sm:text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.45] text-on-background-secondary max-w-[40ch] mx-0 sm:mx-auto text-balance">
                        Automate your business in plain language.
                    </p>
                    <h1 className="mt-5 text-[clamp(2.5rem,6.4vw,5rem)] max-[375px]:text-[clamp(1.75rem,6.4vw,5rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background max-w-[16ch] max-[375px]:max-w-none mx-0 sm:mx-auto text-balance">
                        An <span className="text-brand">AI workspace</span>
                        <br className="hidden max-[375px]:inline" /> for small business.
                    </h1>
                </div>

                <div className="sm:hidden mt-7 flex flex-row items-center gap-2">
                    {user ? (
                        <a
                            href={APP_URL}
                            onClick={() => trackOutbound("start_now_web", { source: "hero_mobile" })}
                            className="inline-flex items-center text-white bg-black hover:bg-[#1a1a1a] border border-black hover:border-[#1a1a1a] rounded-xs text-base leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                        >
                            Open Duri
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="inline-flex items-center text-white bg-black hover:bg-[#1a1a1a] border border-black hover:border-[#1a1a1a] rounded-xs text-base leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                        >
                            Get started
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={scrollToDemo}
                        className="group inline-flex items-center gap-2 text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                    >
                        <span
                            aria-hidden
                            className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand group-hover:bg-brand-variant transition-colors duration-200 flex-none"
                        >
                            <PlayIcon className="w-2.5 h-2.5 text-white fill-current translate-x-[0.5px]" strokeWidth={0} />
                        </span>
                        See how it works
                    </button>
                </div>

                <div className="hidden sm:flex mt-11 flex-row items-center justify-center gap-3">
                    <a
                        href={APP_URL}
                        onClick={() => trackOutbound("start_now_web", { detected_os: isMac ? "mac" : "win", source: "hero_desktop" })}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border bg-background text-on-background border-divider-strong hover:border-on-background transition-colors duration-200 whitespace-nowrap sm:min-w-[190px]"
                    >
                        Get started on Web
                    </a>
                    <div className="relative" ref={downloadRef}>
                        <button
                            type="button"
                            onClick={() => setDownloadOpen((o) => !o)}
                            aria-haspopup="menu"
                            aria-expanded={downloadOpen}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border bg-brand text-on-brand border-brand hover:bg-brand-variant transition-colors duration-200 whitespace-nowrap sm:min-w-[190px] cursor-pointer"
                        >
                            <MonitorIcon className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden />
                            Download for Desktop
                            <ChevronDown
                                aria-hidden
                                className={`w-4 h-4 flex-none transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {downloadOpen && (
                            <div
                                role="menu"
                                className="absolute left-0 right-0 top-full mt-2 bg-background border border-divider rounded-xs shadow-lg overflow-hidden z-20"
                            >
                                {orderedDownloads.map((d) => (
                                    <a
                                        key={d.os}
                                        href={d.href}
                                        role="menuitem"
                                        onClick={() => {
                                            trackOutbound("download_app", { os: d.os, detected_os: isMac ? "mac" : "win" });
                                            setDownloadOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-[0.875rem] font-medium text-on-background hover:bg-brand-soft transition-colors duration-200 whitespace-nowrap"
                                    >
                                        <img src={d.logo} alt="" aria-hidden className="w-4 h-4 object-contain flex-none" />
                                        {d.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 mx-auto max-w-[960px]">
                    <HeroProductWindow />
                </div>

                <div className="mt-12 sm:mt-16">
                    <p className="text-center text-[11px] font-semibold tracking-[0.16em] uppercase text-on-background-secondary mb-6">
                        Works with the tools your business runs on
                    </p>
                    <div className="relative w-full overflow-hidden">
                        <div
                            className="bg-[linear-gradient(to_right,var(--background),transparent)] absolute inset-y-0 left-0 w-16 md:w-24 z-10 pointer-events-none"
                            aria-hidden
                        />
                        <div
                            className="bg-[linear-gradient(to_left,var(--background),transparent)] absolute inset-y-0 right-0 w-16 md:w-24 z-10 pointer-events-none"
                            aria-hidden
                        />
                        <div className="overflow-hidden">
                            <div className="flex items-center w-max animate-logo-marquee" aria-hidden>
                                {[...integrations, ...integrations, ...integrations, ...integrations].map((it, idx) => (
                                    <div key={idx} className="flex-none flex items-center justify-center w-[120px] md:w-[140px] mr-10 md:mr-14">
                                        <img
                                            src={it.logo}
                                            alt=""
                                            className="w-full h-9 md:h-10 object-contain opacity-85"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                            <ul className="sr-only">
                                {integrations.map((it) => (
                                    <li key={it.name}>{it.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
