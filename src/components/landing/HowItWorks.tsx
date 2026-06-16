import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

    const next = useCallback(() => {
        setI((x) => (x + 1) % SLIDES.length);
        setProgress(0);
    }, []);

    const prev = useCallback(() => {
        setI((x) => (x - 1 + SLIDES.length) % SLIDES.length);
        setProgress(0);
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
                className="absolute -left-32 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 6%, transparent) 0%, transparent 70%)",
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
                <p className="text-center text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-6">
                    What Duri runs for you
                </p>

                <div className="flex flex-col items-center select-none">
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous"
                        className="inline-flex items-center justify-center w-10 h-8 text-on-background-secondary hover:text-on-background transition-colors duration-200 cursor-pointer"
                    >
                        <ChevronUp className="w-5 h-5" strokeWidth={2.25} />
                    </button>

                    <div className="relative h-[clamp(3.5rem,9vw,7.5rem)] overflow-hidden flex items-center justify-center">
                        <div
                            className="flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ transform: `translateY(-${i * 100}%)` }}
                        >
                            {SLIDES.map((s) => (
                                <span
                                    key={s.word}
                                    className="block h-[clamp(3.5rem,9vw,7.5rem)] leading-[clamp(3.5rem,9vw,7.5rem)] text-[clamp(2.75rem,7.5vw,6rem)] tracking-[-0.028em] font-medium text-on-background whitespace-nowrap"
                                >
                                    {s.word}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next"
                        className="inline-flex items-center justify-center w-10 h-8 text-on-background-secondary hover:text-on-background transition-colors duration-200 cursor-pointer"
                    >
                        <ChevronDown className="w-5 h-5" strokeWidth={2.25} />
                    </button>
                </div>

                <div className="mt-10 sm:mt-12 mx-auto max-w-[960px]">
                    <div className="relative rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background shadow-[0_28px_72px_-28px_rgba(0,50,32,0.22)]">
                        <video
                            key={SLIDES[i].word}
                            ref={videoRef}
                            src={SLIDES[i].src}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            aria-hidden
                            onEnded={next}
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
                    </div>
                </div>
            </div>
        </section>
    );
}
