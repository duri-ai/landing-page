import { Check, Loader2 } from "lucide-react";

const CHECKS = [
    { text: "Pulled 24 invoices from QuickBooks", done: true },
    { text: "Filtered overdue 30+ days", done: true },
    { text: "Drafted reminder emails", done: true },
    { text: "Sent to 12 customers", running: true },
];

export default function Automation() {
    return (
        <section className="w-full bg-background-warm border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <div className="mb-14 md:mb-20 max-w-[44rem] mx-auto text-center">
                    <p className="duri-eyebrow mb-4">No workflow builder</p>
                    <h2 className="duri-section-title text-balance">
                        Skip the boxes and arrows.{" "}
                        <span className="text-brand">Just say the work.</span>
                    </h2>
                    <p className="duri-section-lede mt-5 mx-auto text-balance">
                        Type the outcome. Duri figures out the steps, runs them, and shows
                        its work as it goes.
                    </p>
                </div>

                <div className="grid gap-6 lg:gap-10 lg:grid-cols-2 items-stretch">
                    {/* Left: crossed-out workflow builder */}
                    <div className="relative rounded-xs border border-divider-strong bg-background overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-divider px-4 py-2.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-on-background/15" />
                            <span className="inline-block w-2 h-2 rounded-full bg-on-background/15" />
                            <span className="inline-block w-2 h-2 rounded-full bg-on-background/15" />
                            <span className="ml-2 text-[11px] text-on-background-secondary font-medium">
                                Workflow builder
                            </span>
                        </div>
                        <div className="relative px-5 sm:px-8 py-10 sm:py-14">
                            <svg
                                viewBox="0 0 380 200"
                                className="w-full h-auto opacity-60"
                                aria-hidden
                            >
                                <line x1="100" y1="40" x2="160" y2="60" stroke="var(--on-background)" strokeOpacity="0.25" strokeWidth="1.5" />
                                <line x1="100" y1="100" x2="160" y2="80" stroke="var(--on-background)" strokeOpacity="0.25" strokeWidth="1.5" />
                                <line x1="100" y1="160" x2="160" y2="100" stroke="var(--on-background)" strokeOpacity="0.25" strokeWidth="1.5" />
                                <line x1="240" y1="80" x2="300" y2="100" stroke="var(--on-background)" strokeOpacity="0.25" strokeWidth="1.5" />
                                <line x1="240" y1="100" x2="300" y2="100" stroke="var(--on-background)" strokeOpacity="0.25" strokeWidth="1.5" />

                                <rect x="40" y="22" width="64" height="36" rx="3" fill="var(--background-warm)" stroke="var(--on-background)" strokeOpacity="0.3" />
                                <rect x="40" y="82" width="64" height="36" rx="3" fill="var(--background-warm)" stroke="var(--on-background)" strokeOpacity="0.3" />
                                <rect x="40" y="142" width="64" height="36" rx="3" fill="var(--background-warm)" stroke="var(--on-background)" strokeOpacity="0.3" />
                                <rect x="158" y="62" width="84" height="46" rx="3" fill="var(--background-warm)" stroke="var(--on-background)" strokeOpacity="0.3" />
                                <rect x="298" y="82" width="64" height="36" rx="3" fill="var(--background-warm)" stroke="var(--on-background)" strokeOpacity="0.3" />

                                <circle cx="55" cy="40" r="4" fill="var(--on-background)" fillOpacity="0.35" />
                                <circle cx="55" cy="100" r="4" fill="var(--on-background)" fillOpacity="0.35" />
                                <circle cx="55" cy="160" r="4" fill="var(--on-background)" fillOpacity="0.35" />
                                <circle cx="172" cy="85" r="4" fill="var(--on-background)" fillOpacity="0.35" />
                                <circle cx="313" cy="100" r="4" fill="var(--on-background)" fillOpacity="0.35" />
                            </svg>

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="relative w-[78%] h-[58%]">
                                    <span
                                        className="absolute inset-0 origin-center rotate-[-14deg] block"
                                        style={{
                                            top: "50%",
                                            left: 0,
                                            height: 4,
                                            background: "#d23a3a",
                                            borderRadius: 4,
                                            transform: "translateY(-50%) rotate(-14deg)",
                                        }}
                                    />
                                    <span
                                        className="absolute inset-0 origin-center rotate-[14deg] block"
                                        style={{
                                            top: "50%",
                                            left: 0,
                                            height: 4,
                                            background: "#d23a3a",
                                            borderRadius: 4,
                                            transform: "translateY(-50%) rotate(14deg)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-divider px-5 py-4 bg-background-warm">
                            <p className="text-[0.85rem] text-on-background-secondary leading-snug">
                                <span className="text-on-background font-medium">Drag, connect, debug, repeat.</span>{" "}
                                Every new edge case is a new node.
                            </p>
                        </div>
                    </div>

                    {/* Right: Duri composer + live checklist */}
                    <div className="relative rounded-xs border border-on-background bg-background overflow-hidden shadow-[0_16px_48px_-24px_rgba(0,50,32,0.28)]">
                        <div className="flex items-center gap-2 border-b border-divider px-4 py-2.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-brand/30" />
                            <span className="inline-block w-2 h-2 rounded-full bg-brand/30" />
                            <span className="inline-block w-2 h-2 rounded-full bg-brand" />
                            <span className="ml-2 text-[11px] text-on-background-secondary font-medium">
                                Duri
                            </span>
                        </div>

                        <div className="px-5 sm:px-6 py-5 sm:py-6">
                            <div className="rounded-xs border border-divider bg-background-warm px-4 py-3.5">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-on-background-secondary font-semibold mb-1.5">
                                    You
                                </p>
                                <p className="text-[0.95rem] text-on-background leading-snug">
                                    Every Wednesday, find invoices overdue 30+ days and email
                                    reminders to those customers.
                                </p>
                            </div>

                            <div className="mt-5">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-brand font-semibold mb-3">
                                    Duri, working
                                </p>
                                <ul className="flex flex-col gap-2.5">
                                    {CHECKS.map((c, i) => (
                                        <li
                                            key={c.text}
                                            className="duri-auto-step flex items-center gap-3"
                                            style={{ animationDelay: `${i * 0.45}s` }}
                                        >
                                            <span
                                                className={`inline-flex flex-none items-center justify-center w-[18px] h-[18px] rounded-full border ${
                                                    c.running
                                                        ? "border-brand bg-background"
                                                        : "border-brand bg-brand text-on-brand"
                                                }`}
                                            >
                                                {c.running ? (
                                                    <Loader2 className="w-3 h-3 text-brand animate-spin" />
                                                ) : (
                                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                                )}
                                            </span>
                                            <span
                                                className={`text-[0.9rem] leading-snug ${
                                                    c.running
                                                        ? "text-on-background font-medium"
                                                        : "text-on-background-secondary"
                                                }`}
                                            >
                                                {c.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-divider px-5 py-4 bg-background-warm flex items-center gap-2.5">
                            <span aria-hidden className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-brand text-on-brand">
                                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            </span>
                            <p className="text-[0.85rem] text-on-background leading-snug">
                                <span className="font-medium">One sentence in.</span>{" "}
                                <span className="text-on-background-secondary">No graph, no nodes, no maintenance.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
