import { useEffect, useState } from "react";
import {
    ArrowUpIcon,
    BellIcon,
    CalendarClockIcon,
    CheckCircle2Icon,
    FileCode2Icon,
    PlugIcon,
    PlusIcon,
    SearchIcon,
    SidebarIcon,
} from "lucide-react";

const FULL_PROMPT =
    "Can you turn Shopify order #1042 into a QuickBooks invoice?";

export default function HeroProductWindow() {
    const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const [typed, setTyped] = useState(reducedMotion ? FULL_PROMPT : "");
    const [revealed, setRevealed] = useState(reducedMotion ? 5 : 0);

    useEffect(() => {
        if (reducedMotion) return;
        let cancelled = false;
        let i = 0;
        const tick = () => {
            if (cancelled) return;
            i += 1;
            setTyped(FULL_PROMPT.slice(0, i));
            if (i < FULL_PROMPT.length) {
                window.setTimeout(tick, 22 + Math.random() * 20);
            } else {
                window.setTimeout(() => {
                    if (cancelled) return;
                    revealNext(0);
                }, 380);
            }
        };
        const revealNext = (n: number) => {
            if (cancelled) return;
            setRevealed(n + 1);
            if (n + 1 < 5) {
                window.setTimeout(() => revealNext(n + 1), 540);
            }
        };
        const id = window.setTimeout(tick, 480);
        return () => {
            cancelled = true;
            window.clearTimeout(id);
        };
    }, [reducedMotion]);

    const isTyping = typed.length < FULL_PROMPT.length;

    return (
        <div className="relative w-full">
            <div className="relative bg-background border-[1.5px] border-on-background rounded-[6px] overflow-hidden shadow-[0_36px_84px_-32px_rgba(0,50,32,0.28),0_2px_0_0_rgba(0,50,32,0.06)]">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-divider bg-background-warm">
                    <div className="flex items-center gap-1.5">
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#e15c5c]" aria-hidden />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#e0a93b]" aria-hidden />
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#5fb96a]" aria-hidden />
                    </div>
                    <div className="flex-1" />
                    <BellIcon className="w-3.5 h-3.5 text-on-background-secondary" aria-hidden />
                </div>

                <div className="grid grid-cols-[64px_1fr]">
                    <aside className="border-r border-divider bg-background-warm/70 flex flex-col items-center pt-4 pb-4 gap-2">
                        <div className="flex flex-col items-center gap-2">
                            <SidebarIcon className="w-4 h-4 text-on-background-secondary" />
                            <PlusIcon className="w-4 h-4 text-on-background-secondary" />
                        </div>
                        <div className="mt-auto flex flex-col items-center gap-2.5 text-on-background-secondary">
                            <CalendarClockIcon className="w-4 h-4" />
                            <PlugIcon className="w-4 h-4" />
                            <SearchIcon className="w-4 h-4" />
                        </div>
                    </aside>

                    <div className="flex flex-col">
                        <header className="flex items-center justify-between border-b border-divider px-5 py-3 bg-background">
                            <h3 className="text-[13.5px] text-on-background font-medium">
                                Order to invoice
                            </h3>
                        </header>

                        <div className="px-5 py-5 bg-background-warm/35 min-h-[420px]">
                            <div className="flex justify-end mb-4">
                                <div className="max-w-[80%] bg-background border border-divider-strong rounded-xs px-3.5 py-2.5">
                                    <p className="text-[14px] leading-snug text-on-background">
                                        <span className={isTyping ? "duri-typing-caret" : undefined}>
                                            {typed}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {revealed > 0 && (
                                <div className="duri-fade-up flex flex-col">
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <span className="text-[15px] font-semibold text-on-background">Duri</span>
                                    </div>

                                    <div className="flex flex-col gap-2 max-w-[92%]">
                                        {revealed >= 1 && (
                                            <p className="text-[14px] leading-snug text-on-background">
                                                On it.
                                            </p>
                                        )}
                                        {revealed >= 2 && (
                                            <EventBadge label="Reading order #1042 from Shopify" />
                                        )}
                                        {revealed >= 3 && (
                                            <EventBadge
                                                label="Matching customer in QuickBooks"
                                                detail="Maria L."
                                            />
                                        )}
                                        {revealed >= 4 && (
                                            <EventBadge
                                                label="Drafting invoice"
                                                detail="INV-1042 · $84.20"
                                            />
                                        )}
                                        {revealed >= 5 && (
                                            <div className="text-[14px] leading-relaxed text-on-background space-y-2 mt-1">
                                                <p>
                                                    Done. Created{" "}
                                                    <strong className="font-semibold">INV-1042</strong> for{" "}
                                                    <strong className="font-semibold">Maria&nbsp;L.</strong>:
                                                </p>
                                                <ul className="ml-4 list-disc marker:text-on-background-secondary space-y-1">
                                                    <li>
                                                        $84.20 · class{" "}
                                                        <em className="not-italic font-mono text-[12.5px] text-on-background-secondary">
                                                            Sales:Coffee
                                                        </em>
                                                    </li>
                                                    <li>13% HST · Net-30 terms</li>
                                                </ul>
                                                <p>Want me to handle every new order this way?</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-3.5 border-t border-divider bg-background">
                            <div className="flex items-center gap-2 border border-divider-strong rounded-xs bg-background px-3 py-2">
                                <span className="flex-1 text-[13px] text-on-background-secondary">
                                    Reply, or describe a new task...
                                </span>
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-on-background text-on-brand rounded-xs">
                                    <ArrowUpIcon className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-on-background rounded-[6px] pointer-events-none"
                aria-hidden
            />
        </div>
    );
}

function EventBadge({ label, detail }: { label: string; detail?: string }) {
    return (
        <div className="inline-flex w-fit items-center gap-1.5 border border-divider-strong rounded-xs px-2.5 py-1.5 text-[12px] bg-background">
            <FileCode2Icon className="w-3.5 h-3.5 text-on-background-secondary flex-none" aria-hidden />
            <span className="text-on-background">
                {label}
                {detail && <span className="text-on-background-secondary"> · {detail}</span>}
                <span className="text-on-background-secondary">...done!</span>
            </span>
            <CheckCircle2Icon className="w-3 h-3 text-brand flex-none" aria-hidden />
        </div>
    );
}
