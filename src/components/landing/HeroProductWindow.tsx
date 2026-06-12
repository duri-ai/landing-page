import { useEffect, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";

const FULL_PROMPT = "Turn Shopify order #1042 into a QuickBooks invoice.";

const STEPS = [
    { label: "Found the order on Shopify" },
    { label: "Matched the customer", detail: "Maria L." },
    { label: "Created the invoice", detail: "$84.20" },
];

export default function HeroProductWindow() {
    const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const [typed, setTyped] = useState(reducedMotion ? FULL_PROMPT : "");
    const [revealed, setRevealed] = useState(reducedMotion ? STEPS.length + 1 : 0);

    useEffect(() => {
        if (reducedMotion) return;
        let cancelled = false;
        let i = 0;

        const tick = () => {
            if (cancelled) return;
            i += 1;
            setTyped(FULL_PROMPT.slice(0, i));
            if (i < FULL_PROMPT.length) {
                window.setTimeout(tick, 22 + Math.random() * 18);
            } else {
                window.setTimeout(() => !cancelled && revealNext(0), 400);
            }
        };
        const revealNext = (n: number) => {
            if (cancelled) return;
            setRevealed(n + 1);
            if (n + 1 <= STEPS.length) {
                window.setTimeout(() => revealNext(n + 1), 520);
            }
        };
        const id = window.setTimeout(tick, 500);
        return () => { cancelled = true; window.clearTimeout(id); };
    }, [reducedMotion]);

    const isTyping = typed.length < FULL_PROMPT.length;
    const working = revealed > 0 && revealed <= STEPS.length;

    return (
        <div className="relative w-full">
            <div className="relative bg-background border border-on-background rounded-xs overflow-hidden shadow-[0_28px_56px_-28px_rgba(0,50,32,0.22),0_2px_0_0_rgba(0,50,32,0.06)]">

                {/* Title bar */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-divider bg-background-warm">
                    <div className="flex items-center gap-1.5">
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#e15c5c]" aria-hidden />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#e0a93b]" aria-hidden />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#5fb96a]" aria-hidden />
                    </div>
                    <div className="flex items-center gap-1.5 ml-1">
                        <img
                            src={`${import.meta.env.BASE_URL}logos/d.svg`}
                            alt=""
                            aria-hidden
                            className="w-4 h-4 rounded-xs"
                        />
                        <span className="text-[13px] font-semibold text-on-background">Duri</span>
                    </div>
                </div>

                {/* Chat area */}
                <div className="px-5 py-5 bg-background-warm/30 min-h-[400px] flex flex-col gap-4">

                    {/* User prompt */}
                    <div className="flex justify-end">
                        <div className="max-w-[82%] bg-background border border-divider-strong rounded-xs px-3.5 py-2.5">
                            <p className="text-[14.5px] leading-snug text-on-background">
                                <span className={isTyping ? "duri-typing-caret" : undefined}>
                                    {typed}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Duri response */}
                    {revealed > 0 && (
                        <div className="duri-fade-up flex flex-col gap-3">
                            <div className="flex items-center gap-1.5">
                                <img
                                    src={`${import.meta.env.BASE_URL}logos/d.svg`}
                                    alt=""
                                    aria-hidden
                                    className="w-4 h-4 rounded-xs"
                                />
                                <span className="text-[12.5px] font-semibold text-on-background">Duri</span>
                                {working && (
                                    <span className="text-[12.5px] text-on-background-secondary ml-1 animate-pulse">
                                        Working...
                                    </span>
                                )}
                            </div>

                            {/* Steps */}
                            <div className="flex flex-col gap-2">
                                {STEPS.map((step, i) =>
                                    revealed > i ? (
                                        <div key={step.label} className="flex items-center gap-2 text-[14px] text-on-background">
                                            <CheckCircle2Icon className="w-4 h-4 text-brand flex-none" />
                                            <span>
                                                {step.label}
                                                {step.detail && (
                                                    <span className="text-on-background-secondary"> · {step.detail}</span>
                                                )}
                                            </span>
                                        </div>
                                    ) : null
                                )}
                            </div>

                            {/* Final result card */}
                            {revealed > STEPS.length && (
                                <div className="mt-1 border border-brand rounded-xs bg-brand-soft px-4 py-3.5 flex flex-col gap-3">
                                    <div>
                                        <p className="text-[14.5px] font-medium text-on-background">
                                            Invoice created for Maria L.
                                        </p>
                                        <p className="text-[13.5px] text-on-background-secondary mt-0.5">
                                            $84.20 · ready to send
                                        </p>
                                    </div>
                                    <div className="pt-2.5 border-t border-brand/30">
                                        <p className="text-[13.5px] text-on-background mb-2.5">
                                            Should every new order work this way?
                                        </p>
                                        <div className="flex gap-2">
                                            <button type="button" className="inline-flex items-center gap-1 bg-brand text-on-brand text-[13px] font-medium px-3.5 py-1.5 rounded-xs cursor-pointer">
                                                Yes, always
                                            </button>
                                            <button type="button" className="inline-flex items-center gap-1 border border-divider-strong text-on-background text-[13px] px-3.5 py-1.5 rounded-xs cursor-pointer hover:border-on-background transition-colors">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Drop shadow layer */}
            <div
                className="absolute -z-10 -bottom-2.5 -right-2.5 w-full h-full bg-on-background pointer-events-none"
                aria-hidden
            />
        </div>
    );
}
