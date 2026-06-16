import { integrations } from "../../utils/marketingContent";

export default function Integrations() {
    const reel = [...integrations, ...integrations, ...integrations, ...integrations];
    return (
        <section
            id="integrations"
            className="w-full bg-background-warm border-t border-b border-divider min-w-xs"
        >
            <div className="mx-auto max-w-[960px] px-6 md:px-8 py-6 md:py-8">
                <p className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-on-background-secondary text-center mb-5">
                    Works with the tools you already use
                </p>
                <div className="relative w-full overflow-hidden">
                    <div
                        className="bg-[linear-gradient(to_right,var(--background-warm),transparent)] absolute inset-y-0 left-0 w-16 md:w-28 z-10 pointer-events-none"
                        aria-hidden
                    />
                    <div
                        className="bg-[linear-gradient(to_left,var(--background-warm),transparent)] absolute inset-y-0 right-0 w-16 md:w-28 z-10 pointer-events-none"
                        aria-hidden
                    />
                    <div className="overflow-hidden">
                        <div className="flex items-center w-max animate-logo-marquee" aria-hidden>
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
