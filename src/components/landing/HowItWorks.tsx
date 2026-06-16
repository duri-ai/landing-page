import { useEffect, useState } from "react";

const SLIDES = ["operations", "reporting", "research"] as const;
const ROTATE_MS = 3200;

export default function HowItWorks() {
    const [i, setI] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), ROTATE_MS);
        return () => clearInterval(id);
    }, []);

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

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-20 md:py-32">
                <h2 className="text-[clamp(2.5rem,7vw,5.75rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background text-balance">
                    Automate{" "}
                    <span className="duri-revolver">
                        <span
                            className="duri-revolver-track"
                            style={{ transform: `translateY(-${i * 100}%)` }}
                            aria-hidden
                        >
                            {SLIDES.map((s) => (
                                <span key={s} className="duri-revolver-word text-brand">
                                    {s}
                                </span>
                            ))}
                        </span>
                        <span className="sr-only">{SLIDES[i]}</span>
                    </span>
                </h2>

                <div className="mt-12 md:mt-16 mx-auto max-w-[960px]">
                    <div
                        key={SLIDES[i]}
                        className="duri-fade-up relative rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background-warm aspect-video flex items-center justify-center"
                    >
                        <div aria-hidden className="absolute inset-0 duri-grid-bg opacity-[0.18]" />
                        <div className="relative flex flex-col items-center gap-2 text-center">
                            <p className="text-[clamp(1.5rem,2.4vw,2rem)] leading-none tracking-[-0.02em] font-medium text-on-background capitalize">
                                {SLIDES[i]}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-on-background-secondary font-semibold">
                                Preview, coming soon
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
