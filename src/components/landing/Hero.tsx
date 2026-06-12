import HeroProductWindow from "./HeroProductWindow";

const APPLE_LOGO = `${import.meta.env.BASE_URL}misc_images/apple.png`;
const WINDOWS_LOGO = `${import.meta.env.BASE_URL}misc_images/windows.png`;

const MAC_DOWNLOAD =
    "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD =
    "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

export default function Hero() {
    return (
        <section className="relative w-full min-w-xs overflow-hidden">
            <div className="absolute inset-0 duri-grid-bg opacity-[0.55] pointer-events-none" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background-warm pointer-events-none" aria-hidden />

            <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 pt-12 md:pt-16 pb-20 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 border border-brand rounded-full px-3 py-1 bg-brand-soft mb-6">
                            <span className="block w-1.5 h-1.5 rounded-full bg-brand animate-pulse flex-none" aria-hidden />
                            <span className="text-[12px] text-brand font-medium">Mac & Windows desktop app · No code required</span>
                        </div>

                        <h1 className="duri-monument">
                            <span className="block">Stop copy-pasting.</span>
                            <span className="block">
                                Let AI <span className="text-brand">do the busywork</span>.
                            </span>
                        </h1>

                        <p className="mt-5 text-[16px] md:text-[18px] text-on-background-secondary max-w-[520px] leading-relaxed">
                            Duri is a desktop app that connects to Shopify, QuickBooks, Google & M365 and handles your repetitive tasks automatically. No IT team needed.
                        </p>

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
