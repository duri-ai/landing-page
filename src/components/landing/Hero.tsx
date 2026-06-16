import { useEffect, useState } from "react";

const base = import.meta.env.BASE_URL;

const APPLE_LOGO   = `${base}misc_images/apple.png`;
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
        <section className="w-full bg-background min-w-xs">
            <div className="mx-auto max-w-[680px] px-6 md:px-8 pt-12 md:pt-20 pb-12 md:pb-16">
                <div id="download" className="text-center">
                    <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background text-balance">
                        <span className="text-brand">AI</span> for small business
                    </h2>
                </div>

                <div className="mt-12 md:mt-16 rounded-[10px] overflow-hidden shadow-[0_16px_56px_-16px_rgba(0,50,32,0.22)] border-[1.5px] border-on-background">
                    <video
                        src={`${base}videos/flow-animation.mp4`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-hidden="true"
                        className="w-full block"
                    />
                </div>

                <div className="mt-8 flex flex-row items-center justify-center gap-3">
                    <a
                        href={MAC_DOWNLOAD}
                        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-semibold border transition-colors duration-200 whitespace-nowrap min-w-[200px] ${
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
                        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-semibold border transition-colors duration-200 whitespace-nowrap min-w-[200px] ${
                            !isMac
                                ? "bg-brand text-on-brand border-brand hover:bg-brand-variant"
                                : "bg-background text-on-background border-divider-strong hover:border-on-background"
                        }`}
                    >
                        <img src={WINDOWS_LOGO} alt="" aria-hidden className={`w-4 h-4 object-contain flex-none ${!isMac ? "invert" : ""}`} />
                        Download for Windows
                    </a>
                </div>
            </div>
        </section>
    );
}
