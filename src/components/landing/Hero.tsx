import { useEffect, useRef, useState } from "react";
import { ChevronDown, MonitorIcon } from "lucide-react";
import { trackOutbound } from "../../utils/analytics";
import HeroVideo from "./HeroVideo";

const base = import.meta.env.BASE_URL;
const APP_URL = "https://app.duri-ai.com";
const MAC_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

const DOWNLOADS = [
    {
        os: "mac",
        label: "Download for macOS",
        href: MAC_DOWNLOAD,
        logo: `${base}misc_images/apple.png`,
    },
    {
        os: "win",
        label: "Download for Windows",
        href: WIN_DOWNLOAD,
        logo: `${base}misc_images/windows.png`,
    },
] as const;

export default function Hero() {
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [isMac] = useState(() => !/Win/i.test(navigator.userAgent));
    const downloadRef = useRef<HTMLDivElement>(null);
    const orderedDownloads = isMac ? DOWNLOADS : [DOWNLOADS[1], DOWNLOADS[0]];

    useEffect(() => {
        if (!downloadOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setDownloadOpen(false);
            }
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDownloadOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [downloadOpen]);

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
                        Hand off your day-to-day operations to AI.
                    </p>
                    <h1 className="mt-5 text-[clamp(2.5rem,6.4vw,5rem)] max-[375px]:text-[clamp(1.75rem,6.4vw,5rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background max-w-[17ch] max-[375px]:max-w-none mx-0 sm:mx-auto text-balance">
                        What is the <span className="text-brand">chore</span> eating your week?
                    </h1>
                </div>

                <div className="mt-8 flex w-full max-w-[420px] flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
                    <a
                        href={APP_URL}
                        onClick={() =>
                            trackOutbound("start_now_web", {
                                detected_os: isMac ? "mac" : "win",
                                source: "hero",
                            })
                        }
                        className="inline-flex h-11 items-center justify-center rounded-xs border border-divider-strong bg-background px-5 text-[0.875rem] font-semibold text-on-background whitespace-nowrap transition-colors duration-200 hover:border-on-background sm:min-w-[190px]"
                    >
                        Get started on Web
                    </a>

                    <div ref={downloadRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setDownloadOpen((open) => !open)}
                            aria-haspopup="menu"
                            aria-expanded={downloadOpen}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xs border border-brand bg-brand px-5 text-[0.875rem] font-semibold text-on-brand whitespace-nowrap transition-colors duration-200 hover:bg-brand-variant cursor-pointer sm:min-w-[190px]"
                        >
                            <MonitorIcon className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                            Download for Desktop
                            <ChevronDown
                                aria-hidden
                                className={`h-4 w-4 flex-none transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {downloadOpen && (
                            <div
                                role="menu"
                                className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xs border border-divider bg-background shadow-[0_18px_44px_-20px_rgba(0,50,32,0.38)]"
                            >
                                {orderedDownloads.map((download) => (
                                    <a
                                        key={download.os}
                                        href={download.href}
                                        role="menuitem"
                                        onClick={() => {
                                            trackOutbound("download_app", {
                                                os: download.os,
                                                detected_os: isMac ? "mac" : "win",
                                                source: "hero",
                                            });
                                            setDownloadOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-4 py-3 text-[0.82rem] font-medium text-on-background transition-colors duration-200 hover:bg-brand-soft"
                                    >
                                        <img
                                            src={download.logo}
                                            alt=""
                                            aria-hidden
                                            className="h-4 w-4 flex-none object-contain"
                                        />
                                        {download.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 sm:mt-14 mx-auto max-w-[960px]">
                    <HeroVideo />
                </div>
            </div>
        </section>
    );
}
