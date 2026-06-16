import { useEffect, useState } from "react";

const base = import.meta.env.BASE_URL;

const POOL = [
    `${base}logos/third_party/google.svg`,
    `${base}logos/third_party/m365.png`,
    `${base}logos/third_party/gmail.png`,
    `${base}logos/third_party/meta.png`,
    `${base}logos/third_party/square.png`,
    `${base}logos/third_party/shopify-bag.svg`,
    `${base}logos/third_party/quickbooks-circle.svg`,
];

const MULTI_ACCOUNT = new Set([
    `${base}logos/third_party/shopify-bag.svg`,
    `${base}logos/third_party/quickbooks-circle.svg`,
]);

const SLOTS = 4;

function randomSide(): string[] {
    // 35% chance: pick a multi-account service and fill all 4 slots
    if (Math.random() < 0.35) {
        const multi = Array.from(MULTI_ACCOUNT);
        const pick = multi[Math.floor(Math.random() * multi.length)];
        return Array(SLOTS).fill(pick);
    }
    // Otherwise: 4 distinct non-multi services
    const nonMulti = POOL.filter((p) => !MULTI_ACCOUNT.has(p));
    const shuffled = [...nonMulti].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, SLOTS);
}

function isMultiSide(side: string[]): boolean {
    return side.length > 0 && side.every((s) => s === side[0]) && MULTI_ACCOUNT.has(side[0]);
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[18px] drop-shadow-[0_12px_28px_rgba(0,50,32,0.18)]"
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

    const leftIsMulti = isMultiSide(leftIcons);
    const rightIsMulti = isMultiSide(rightIcons);

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
                            Connect any data source, read and write in one place.
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
                                    <IconCard
                                        key={`l-${idx}-${src}-${leftIsMulti ? "m" : "s"}`}
                                        src={src}
                                    />
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
                                                stroke={
                                                    leftIsMulti
                                                        ? "color-mix(in oklch, var(--brand) 55%, transparent)"
                                                        : "color-mix(in oklch, var(--on-background) 14%, transparent)"
                                                }
                                                strokeWidth={leftIsMulti ? 2 : 1.5}
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
                                                stroke={
                                                    rightIsMulti
                                                        ? "color-mix(in oklch, var(--brand) 55%, transparent)"
                                                        : "color-mix(in oklch, var(--on-background) 14%, transparent)"
                                                }
                                                strokeWidth={rightIsMulti ? 2 : 1.5}
                                                fill="none"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col items-center gap-4 sm:gap-5">
                                {rightIcons.map((src, idx) => (
                                    <IconCard
                                        key={`r-${idx}-${src}-${rightIsMulti ? "m" : "s"}`}
                                        src={src}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
