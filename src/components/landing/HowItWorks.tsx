import { useCallback, useEffect, useRef, useState } from "react";

const base = import.meta.env.BASE_URL;

const SLIDES = [
    { word: "operations", src: `${base}videos/flow-animation.mp4` },
    { word: "reporting", src: `${base}videos/reporting.mp4` },
    { word: "research", src: `${base}videos/research.mp4` },
] as const;

export default function HowItWorks() {
    const [i, setI] = useState(0);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const tick = useCallback(() => {
        const v = videoRef.current;
        if (v && v.duration) {
            setProgress(v.currentTime / v.duration);
        }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        };
    }, [tick]);

    const advance = useCallback(() => {
        setI((x) => (x + 1) % SLIDES.length);
        setProgress(0);
    }, []);

    const select = useCallback((next: number) => {
        if (next === i) return;
        setI(next);
        setProgress(0);
    }, [i]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play().catch(() => {});
    }, [i]);

    return (
        <section id="how" className="relative w-full bg-background overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, color-mix(in oklch, var(--background-warm) 70%, transparent), transparent 60%, color-mix(in oklch, var(--background-warm) 50%, transparent))",
                }}
            />
            <div
                aria-hidden
                className="absolute -left-32 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 7%, transparent) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute -right-32 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--highlight) 4%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <h2 className="text-[clamp(2.5rem,7vw,5.75rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background text-balance text-center">
                    Automate.
                </h2>

                <div
                    role="tablist"
                    aria-label="Use cases"
                    className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10"
                >
                    {SLIDES.map((s, idx) => {
                        const active = idx === i;
                        return (
                            <button
                                key={s.word}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => select(idx)}
                                className={`group relative inline-flex flex-col items-center pb-2 transition-colors duration-200 cursor-pointer ${
                                    active
                                        ? "text-on-background"
                                        : "text-on-background-secondary hover:text-on-background"
                                }`}
                            >
                                <span className="text-[clamp(1.25rem,2.4vw,1.85rem)] leading-none tracking-[-0.02em] font-medium">
                                    {s.word}
                                </span>
                                <span
                                    aria-hidden
                                    className={`mt-2.5 h-[3px] w-full rounded-full transition-colors duration-200 ${
                                        active ? "bg-brand" : "bg-transparent"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className="mt-10 sm:mt-12 mx-auto max-w-[960px]">
                    <div className="relative rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background-warm shadow-[0_28px_72px_-28px_rgba(0,50,32,0.22)]">
                        <video
                            key={SLIDES[i].word}
                            ref={videoRef}
                            src={SLIDES[i].src}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            aria-hidden
                            onEnded={advance}
                            className="w-full block aspect-video object-cover"
                        />
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-on-background-secondary">
                            <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            <span className="text-on-background-secondary-variant">/</span>
                            <span className="tabular-nums">{String(SLIDES.length).padStart(2, "0")}</span>
                        </div>
                        <div className="relative flex-1 h-[3px] rounded-full bg-divider overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-brand"
                                style={{
                                    width: `${Math.min(100, Math.max(0, progress * 100))}%`,
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={advance}
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-background-secondary hover:text-on-background transition-colors duration-200 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
