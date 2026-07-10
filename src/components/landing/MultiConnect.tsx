import { useEffect, useState } from "react";
import { integrations } from "../../utils/marketingContent";

const base = import.meta.env.BASE_URL;

const POOL = [
    `${base}logos/third_party/google.svg`,
    `${base}logos/third_party/m365.png`,
    `${base}logos/third_party/gmail.png`,
    `${base}logos/third_party/gsheets.png`,
    `${base}logos/third_party/gdrive.png`,
    `${base}logos/third_party/gcalendar.png`,
    `${base}logos/third_party/gdocs.png`,
    `${base}logos/third_party/gslides.png`,
    `${base}logos/third_party/gforms.png`,
    `${base}logos/third_party/gmeet.webp`,
    `${base}logos/third_party/ms_excel.webp`,
    `${base}logos/third_party/ms_outlook.webp`,
    `${base}logos/third_party/ms_onedrive.webp`,
    `${base}logos/third_party/ms_teams.webp`,
    `${base}logos/third_party/ms_planner.webp`,
    `${base}logos/third_party/ms_sharepoint.webp`,
    `${base}logos/third_party/meta.png`,
    `${base}logos/third_party/mailchimp.png`,
    `${base}logos/third_party/square.png`,
    `${base}logos/third_party/shopify-bag.svg`,
    `${base}logos/third_party/quickbooks-circle.svg`,
];

const SLOTS = 4;

function randomSide(): string[] {
    const shuffled = [...POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, SLOTS);
}

function IconCard({ src }: { src: string }) {
    return (
        <div
            key={src}
            className="duri-mc-icon flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[14px] border border-divider-strong bg-background shadow-[0_10px_24px_-12px_rgba(0,50,32,0.22)]"
        >
            <img src={src} alt="" aria-hidden className="w-9 h-9 sm:w-11 sm:h-11 object-contain" />
        </div>
    );
}

function DuriCenter() {
    return (
        <div className="flex items-center justify-center">
            <img
                src={`${base}logos/d.svg`}
                alt=""
                aria-hidden
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[14px] drop-shadow-[0_10px_22px_rgba(0,50,32,0.18)]"
            />
        </div>
    );
}

export default function MultiConnect() {
    const [leftIcons, setLeftIcons] = useState<string[]>(() => randomSide());
    const [rightIcons, setRightIcons] = useState<string[]>(() => randomSide());

    useEffect(() => {
        const id = window.setInterval(() => {
            const side = Math.random() < 0.5 ? "left" : "right";
            const setter = side === "left" ? setLeftIcons : setRightIcons;
            setter(randomSide());
        }, 2000);
        return () => window.clearInterval(id);
    }, []);

    const lineStroke = "color-mix(in oklch, var(--on-background) 14%, transparent)";

    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.14] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklch, var(--brand) 7%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 md:gap-16 items-center">
                    <div className="max-w-[28rem]">
                        <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                            Connectors
                        </p>
                        <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.024em] font-medium text-on-background text-balance">
                            Connect your apps. Let AI read and write across them.
                        </h2>
                        <p className="mt-5 text-[clamp(0.975rem,1.15vw,1.1rem)] leading-[1.55] text-on-background-secondary">
                            Three storefronts, two ad accounts, the books in another tab.
                            Hand them all to Duri. It moves between them like it already
                            knows the place.
                        </p>
                    </div>

                    <div className="relative mx-auto max-w-[520px]">
                        <div className="grid grid-cols-[auto_minmax(40px,80px)_auto_minmax(40px,80px)_auto] items-stretch gap-x-2 sm:gap-x-3">
                            <div className="flex flex-col items-center gap-4 sm:gap-5">
                                {leftIcons.map((src, idx) => (
                                    <IconCard key={`l-${idx}-${src}`} src={src} />
                                ))}
                            </div>

                            <div className="relative h-full" aria-hidden>
                                {leftIcons.map((_, idx) => {
                                    const y = (idx + 0.5) * (100 / SLOTS);
                                    return (
                                        <svg
                                            key={`l-line-${idx}`}
                                            viewBox="0 0 100 100"
                                            preserveAspectRatio="none"
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            <path
                                                d={`M 0 ${y} Q 55 ${y} 100 50`}
                                                stroke={lineStroke}
                                                strokeWidth={1.5}
                                                fill="none"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-center">
                                <DuriCenter />
                            </div>

                            <div className="relative h-full" aria-hidden>
                                {rightIcons.map((_, idx) => {
                                    const y = (idx + 0.5) * (100 / SLOTS);
                                    return (
                                        <svg
                                            key={`r-line-${idx}`}
                                            viewBox="0 0 100 100"
                                            preserveAspectRatio="none"
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            <path
                                                d={`M 0 50 Q 45 ${y} 100 ${y}`}
                                                stroke={lineStroke}
                                                strokeWidth={1.5}
                                                fill="none"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col items-center gap-4 sm:gap-5">
                                {rightIcons.map((src, idx) => (
                                    <IconCard key={`r-${idx}-${src}`} src={src} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-24 pt-12 border-t border-divider">
                    <p className="text-center text-[11px] font-semibold tracking-[0.16em] uppercase text-on-background-secondary mb-6">
                        Works with the tools your business runs on
                    </p>
                    <div className="relative w-full overflow-hidden">
                        <div
                            className="bg-[linear-gradient(to_right,var(--background-warm),transparent)] absolute inset-y-0 left-0 w-16 md:w-24 z-10 pointer-events-none"
                            aria-hidden
                        />
                        <div
                            className="bg-[linear-gradient(to_left,var(--background-warm),transparent)] absolute inset-y-0 right-0 w-16 md:w-24 z-10 pointer-events-none"
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