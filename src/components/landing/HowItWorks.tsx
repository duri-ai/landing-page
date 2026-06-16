import { useCallback, useEffect, useRef, useState } from "react";

const base = import.meta.env.BASE_URL;

const ITEMS = [
    {
        key: "operations",
        title: "Business operations",
        body: "Tell Duri what should happen when. It pulls orders, updates ledgers, and keeps inventory aligned across every store you run, without you watching.",
        src: `${base}videos/flow-animation.mp4`,
    },
    {
        key: "reporting",
        title: "Weekly reporting",
        body: "Your sales live in three different dashboards. Duri reads each one, rolls the numbers into a single PDF, and emails it where it needs to go.",
        src: `${base}videos/reporting.mp4`,
    },
    {
        key: "research",
        title: "Market research",
        body: "Drop a competitor handle and a question. Duri pulls their public posts, follower counts, and engagement, then puts the comparison next to yours.",
        src: `${base}videos/research.mp4`,
    },
] as const;

export default function HowItWorks() {
    const [i, setI] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const next = useCallback(() => {
        setI((x) => (x + 1) % ITEMS.length);
    }, []);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play().catch(() => {});
    }, [i]);

    return (
        <section id="how" className="relative w-full bg-background-warm overflow-hidden">
            <div
                aria-hidden
                className="absolute -left-32 top-1/3 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 6%, transparent) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute -right-32 top-2/3 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--highlight) 4%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <div className="max-w-[44rem]">
                    <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                        Real work
                    </p>
                    <h2 className="text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.04] tracking-[-0.024em] font-medium text-on-background text-balance">
                        Daily work, on autopilot.
                    </h2>
                    <p className="mt-4 text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.55] text-on-background-secondary max-w-[36rem]">
                        Tell Duri what you want done. It runs the steps on the schedule
                        you set, shows you the result, and quietly keeps doing it.
                    </p>
                </div>

                <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-12 items-start">
                    <ul className="flex flex-col gap-3">
                        {ITEMS.map((item, idx) => {
                            const active = idx === i;
                            return (
                                <li key={item.key}>
                                    <button
                                        type="button"
                                        onClick={() => setI(idx)}
                                        aria-pressed={active}
                                        className={`w-full text-left rounded-[8px] px-5 py-5 transition-colors duration-200 cursor-pointer ${
                                            active
                                                ? "bg-on-background text-on-brand shadow-[0_18px_44px_-24px_rgba(0,50,32,0.4)]"
                                                : "bg-transparent hover:bg-background/40"
                                        }`}
                                    >
                                        <p
                                            className={`text-[1.05rem] sm:text-[1.125rem] font-semibold tracking-[-0.01em] leading-tight ${
                                                active ? "text-on-brand" : "text-on-background"
                                            }`}
                                        >
                                            {item.title}
                                        </p>
                                        <p
                                            className={`mt-2 text-[0.9rem] leading-[1.55] ${
                                                active ? "text-on-brand/75" : "text-on-background-secondary"
                                            }`}
                                        >
                                            {item.body}
                                        </p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="relative rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background shadow-[0_28px_72px_-28px_rgba(0,50,32,0.24)]">
                        <video
                            key={ITEMS[i].key}
                            ref={videoRef}
                            src={ITEMS[i].src}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            aria-hidden
                            onEnded={next}
                            className="w-full block aspect-video object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
