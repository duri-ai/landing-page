import { Check, Loader2 } from "lucide-react";

const base = import.meta.env.BASE_URL;

const STEPS: { label: string; sub: string }[] = [
    { label: "Pulled 24 invoices from QuickBooks", sub: "via QuickBooks Online" },
    { label: "Filtered overdue 30+ days", sub: "12 customers matched" },
    { label: "Drafted reminder emails", sub: "personalized per customer" },
    { label: "Sending to 12 customers", sub: "via Gmail" },
];

const FLOW = [
    { src: `${base}logos/third_party/shopify-bag.svg`, label: "Shopify" },
    { src: `${base}logos/third_party/quickbooks-circle.svg`, label: "QuickBooks" },
    { src: `${base}logos/third_party/gmail.png`, label: "Gmail" },
];

export default function Automation() {
    const runningIdx = STEPS.length - 1;

    return (
        <section className="relative w-full bg-background border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.14] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
            />
            <div
                aria-hidden
                className="absolute -top-20 right-[-180px] h-[520px] w-[520px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 7%, transparent) 0%, transparent 65%)",
                }}
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 md:gap-16 items-center">
                    <div className="max-w-[26rem]">
                        <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                            Recurring tasks
                        </p>
                        <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.024em] font-medium text-on-background text-balance">
                            Just describe the work.
                        </h2>
                        <p className="mt-5 text-[clamp(0.975rem,1.15vw,1.1rem)] leading-[1.55] text-on-background-secondary">
                            Say it once. Duri figures out where the data lives, runs every
                            step, and keeps doing it on the schedule you give it.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            {FLOW.map((node, i) => (
                                <div key={node.label} className="flex items-center gap-3">
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-full border border-divider-strong bg-background shadow-[0_4px_12px_-6px_rgba(0,50,32,0.18)]"
                                        title={node.label}
                                    >
                                        <img
                                            src={node.src}
                                            alt={node.label}
                                            className="w-7 h-7 object-contain"
                                        />
                                    </div>
                                    {i < FLOW.length - 1 ? (
                                        <div className="flex items-center" aria-hidden>
                                            <span className="block w-6 sm:w-10 h-[2px] rounded-full bg-divider-strong" />
                                            <span className="block w-2 h-2 rounded-full bg-brand -ml-1" />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex justify-end">
                            <div className="max-w-[80%] bg-brand-soft border border-brand/30 rounded-[14px] rounded-tr-[4px] px-5 py-4">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-variant font-semibold mb-1.5">
                                    You
                                </p>
                                <p className="text-[1rem] sm:text-[1.05rem] leading-[1.45] text-on-background">
                                    Every Wednesday, find invoices overdue 30+ days and email
                                    reminders to those customers.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[14px] rounded-tl-[4px] border-[1.5px] border-on-background bg-background overflow-hidden shadow-[0_28px_72px_-28px_rgba(0,50,32,0.22)]">
                            <ul className="px-6 py-6 flex flex-col gap-4">
                                {STEPS.map((step, i) => {
                                    const running = i === runningIdx;
                                    return (
                                        <li
                                            key={step.label}
                                            className="duri-auto-step flex items-start gap-3"
                                            style={{ animationDelay: `${i * 0.55}s` }}
                                        >
                                            <span
                                                className={`inline-flex flex-none items-center justify-center w-5 h-5 rounded-full border mt-0.5 ${
                                                    running
                                                        ? "border-brand bg-background"
                                                        : "border-brand bg-brand text-on-brand"
                                                }`}
                                            >
                                                {running ? (
                                                    <Loader2 className="w-3 h-3 text-brand animate-spin" />
                                                ) : (
                                                    <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                                                )}
                                            </span>
                                            <span className="flex flex-col gap-0.5">
                                                <span
                                                    className={`text-[0.95rem] leading-snug ${
                                                        running
                                                            ? "text-on-background font-semibold"
                                                            : "text-on-background"
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                                <span className="text-[12px] text-on-background-secondary leading-snug">
                                                    {step.sub}
                                                </span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
