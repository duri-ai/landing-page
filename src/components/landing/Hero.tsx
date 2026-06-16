import { useEffect, useState } from "react";

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
        <section className="w-full bg-background">
            <div className="mx-auto max-w-[1040px] px-5 sm:px-6 md:px-8 pt-14 sm:pt-20 md:pt-24 pb-12 md:pb-20">
                <div id="download" className="text-center">
                    <p className="duri-eyebrow mb-5">An AI workspace for small business</p>
                    <h1 className="duri-monument max-w-[20ch] mx-auto text-balance">
                        Automate your business in{" "}
                        <span className="text-brand">plain language</span>.
                    </h1>
                </div>

                <div className="mt-10 sm:mt-14 mx-auto max-w-[920px]">
                    <div className="rounded-[10px] overflow-hidden shadow-[0_24px_72px_-24px_rgba(0,50,32,0.22)] border-[1.5px] border-on-background bg-background">
                        <video
                            src={`${base}videos/flow-animation.mp4`}
                            autoPlay
                            muted
                            playsInline
                            aria-hidden="true"
                            className="w-full block aspect-video object-cover"
                        />
                    </div>
                </div>

                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                    <a
                        href={MAC_DOWNLOAD}
                        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-semibold border transition-colors duration-200 whitespace-nowrap sm:min-w-[220px] ${
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
                        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-semibold border transition-colors duration-200 whitespace-nowrap sm:min-w-[220px] ${
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
