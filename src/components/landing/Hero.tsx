import { useEffect, useState } from "react";
import { integrations } from "../../utils/marketingContent";
import { track } from "../../utils/analytics";
import HeroProductWindow from "./HeroProductWindow";

const base = import.meta.env.BASE_URL;

const APPLE_LOGO = `${base}misc_images/apple.png`;
const WINDOWS_LOGO = `${base}misc_images/windows.png`;
const MAC_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

export default function Hero() {
    const [isMac, setIsMac] = useState(true);

    useEffect(() => {
        const ua = navigator.userAgent;
        if (/Win/i.test(ua)) setIsMac(false);
        else if (/Mac/i.test(ua) && !/(iPhone|iPad|iPod)/i.test(ua)) setIsMac(true);
    }, []);

    return (
        <section className="relative w-full bg-background overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
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
            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 pt-16 sm:pt-24 md:pt-28 pb-16 md:pb-24">
                <div id="download" className="text-center">
                    <h1 className="text-[clamp(2.5rem,6.4vw,5rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background max-w-[16ch] mx-auto text-balance">
                        An <span className="text-brand">AI workspace</span> for small business.
                    </h1>
                    <p className="mt-5 text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.45] text-on-background-secondary max-w-[40ch] mx-auto text-balance">
                        Automate your business in plain language.
                    </p>
                </div>

                <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                    <a
                        href={MAC_DOWNLOAD}
                        onClick={() => track("download_app", { os: "mac", detected_os: isMac ? "mac" : "win" })}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border transition-colors duration-200 whitespace-nowrap sm:min-w-[190px] ${
                            isMac
                                ? "bg-brand text-on-brand border-brand hover:bg-brand-variant"
                                : "bg-background text-on-background border-divider-strong hover:border-on-background"
                        }`}
                    >
                        <img src={APPLE_LOGO} alt="" aria-hidden className={`w-4 h-4 object-contain flex-none ${isMac ? "invert" : ""}`} />
                        Download for macOS
                    </a>
                    <a
                        href={WIN_DOWNLOAD}
                        onClick={() => track("download_app", { os: "win", detected_os: isMac ? "mac" : "win" })}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border transition-colors duration-200 whitespace-nowrap sm:min-w-[190px] ${
                            !isMac
                                ? "bg-brand text-on-brand border-brand hover:bg-brand-variant"
                                : "bg-background text-on-background border-divider-strong hover:border-on-background"
                        }`}
                    >
                        <img src={WINDOWS_LOGO} alt="" aria-hidden className={`w-4 h-4 object-contain flex-none ${!isMac ? "invert" : ""}`} />
                        Download for Windows
                    </a>
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
