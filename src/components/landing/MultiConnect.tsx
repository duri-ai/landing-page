import { useEffect, useState } from "react";

const base = import.meta.env.BASE_URL;

const ROTATION_POOL = [
    `${base}logos/third_party/gmail.png`,
    `${base}logos/third_party/excel.svg`,
    `${base}logos/third_party/clover.svg`,
    `${base}logos/third_party/square.png`,
    `${base}logos/third_party/airtable.svg`,
    `${base}logos/third_party/notion.svg`,
    `${base}logos/third_party/slack.svg`,
    `${base}logos/third_party/google.svg`,
    `${base}logos/third_party/m365.png`,
    `${base}logos/third_party/outlook.svg`,
    `${base}logos/third_party/mailchimp.svg`,
    `${base}logos/third_party/amazon.png`,
    `${base}logos/third_party/meta.png`,
    `${base}logos/third_party/trello.svg`,
    `${base}logos/third_party/jira.svg`,
];

const SHOPIFY = `${base}logos/third_party/shopify-bag.svg`;
const QUICKBOOKS = `${base}logos/third_party/quickbooks-circle.svg`;

const LEFT_SLOTS = 4;
const RIGHT_SLOTS = 4;

function pickInitial(count: number, used: Set<string>): string[] {
    const pool = ROTATION_POOL.filter((p) => !used.has(p));
    const picks: string[] = [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
        const v = shuffled[i % shuffled.length];
        picks.push(v);
        used.add(v);
    }
    return picks;
}

function IconCard({ src }: { src: string }) {
    return (
        <div
            key={src}
            className="duri-mc-icon flex items-center justify-center w-14 h-14 rounded-[12px] border border-divider-strong bg-background shadow-[0_8px_20px_-10px_rgba(0,50,32,0.22)]"
        >
            <img src={src} alt="" aria-hidden className="w-8 h-8 object-contain" />
        </div>
    );
}

function AnchorCard({ src, label }: { src: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-20 h-20 rounded-[16px] border-[1.5px] border-on-background bg-background shadow-[0_16px_36px_-16px_rgba(0,50,32,0.28)]">
                <img src={src} alt="" aria-hidden className="w-11 h-11 object-contain" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-background-secondary">
                {label}
            </p>
        </div>
    );
}

export default function MultiConnect() {
    const [leftIcons, setLeftIcons] = useState<string[]>(() => {
        const used = new Set<string>();
        return pickInitial(LEFT_SLOTS, used);
    });
    const [rightIcons, setRightIcons] = useState<string[]>(() => {
        const used = new Set<string>(leftIcons);
        return pickInitial(RIGHT_SLOTS, used);
    });

    useEffect(() => {
        const id = window.setInterval(() => {
            const side = Math.random() < 0.5 ? "left" : "right";
            const setter = side === "left" ? setLeftIcons : setRightIcons;
            setter((current) => {
                const otherSide = side === "left" ? rightIcons : leftIcons;
                const used = new Set<string>([...current, ...otherSide]);
                const candidates = ROTATION_POOL.filter((p) => !used.has(p));
                if (candidates.length === 0) return current;
                const pick = candidates[Math.floor(Math.random() * candidates.length)];
                const slot = Math.floor(Math.random() * current.length);
                const next = [...current];
                next[slot] = pick;
                return next;
            });
        }, 1800);
        return () => window.clearInterval(id);
    }, [leftIcons, rightIcons]);

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

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
                <div className="text-center max-w-[40rem] mx-auto">
                    <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                        Multi connection
                    </p>
                    <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.024em] font-medium text-on-background text-balance">
                        Plug in once. Reach every tool you already pay for.
                    </h2>
                </div>

                <div className="mt-14 md:mt-20 mx-auto max-w-[960px]">
                    <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-x-4 sm:gap-x-8">
                        <div className="flex flex-col items-stretch gap-4 sm:gap-6">
                            {leftIcons.map((src, idx) => (
                                <IconCard key={`l-${idx}-${src}`} src={src} />
                            ))}
                        </div>

                        <div className="relative h-full flex flex-col items-stretch justify-center" aria-hidden>
                            {leftIcons.map((_, idx) => {
                                const y = (idx + 0.5) * (100 / LEFT_SLOTS);
                                return (
                                    <svg
                                        key={`l-line-${idx}`}
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <path
                                            d={`M 0 ${y} Q 60 ${y} 100 50`}
                                            stroke="color-mix(in oklch, var(--on-background) 14%, transparent)"
                                            strokeWidth="1.5"
                                            fill="none"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                );
                            })}
                        </div>

                        <div className="flex flex-row items-center gap-4 sm:gap-6">
                            <AnchorCard src={SHOPIFY} label="Shopify" />
                            <AnchorCard src={QUICKBOOKS} label="QuickBooks" />
                        </div>

                        <div className="relative h-full flex flex-col items-stretch justify-center" aria-hidden>
                            {rightIcons.map((_, idx) => {
                                const y = (idx + 0.5) * (100 / RIGHT_SLOTS);
                                return (
                                    <svg
                                        key={`r-line-${idx}`}
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <path
                                            d={`M 0 50 Q 40 ${y} 100 ${y}`}
                                            stroke="color-mix(in oklch, var(--on-background) 14%, transparent)"
                                            strokeWidth="1.5"
                                            fill="none"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                );
                            })}
                        </div>

                        <div className="flex flex-col items-stretch gap-4 sm:gap-6">
                            {rightIcons.map((src, idx) => (
                                <IconCard key={`r-${idx}-${src}`} src={src} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
