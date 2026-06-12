import { integrations } from "../../utils/marketingContent";

export default function Integrations() {
    const reel = [...integrations, ...integrations, ...integrations, ...integrations];
    return (
        <section
            id="integrations"
            className="w-full bg-background-warm border-t border-b border-divider min-w-xs"
        >
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6 md:py-8">
                <p className="text-center text-[12px] font-semibold tracking-[0.12em] uppercase text-on-background-secondary-variant mb-5">
                    Works with tools you already use
                </p>

                {/* Logo marquee */}
                <div className="relative w-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 w-16 md:w-28 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to right, var(--background-warm), color-mix(in oklch, var(--background-warm) 0%, transparent))",
                        }}
                        aria-hidden
                    />
                    <div
                        className="absolute inset-y-0 right-0 w-16 md:w-28 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to left, var(--background-warm), color-mix(in oklch, var(--background-warm) 0%, transparent))",
                        }}
                        aria-hidden
                    />

                    <div className="overflow-hidden">
                        <div className="flex items-center duri-logo-marquee" aria-hidden>
                            {reel.map((it, idx) => (
                                <div key={idx} className="flex-none flex items-center justify-center w-[88px] md:w-[108px] mr-8 md:mr-12">
                                    <img
                                        src={it.logo}
                                        alt=""
                                        className="w-full h-6 md:h-7 object-contain opacity-80"
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
        </section>
    );
}
