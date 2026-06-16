import { Check, Loader2 } from "lucide-react";

const base = import.meta.env.BASE_URL;

const STEPS = [
    "Pulled 24 invoices from QuickBooks",
    "Filtered overdue 30+ days",
    "Drafted reminder emails",
    "Sent to 12 customers",
];

export default function Automation() {
    return (
        <section className="w-full bg-background-warm border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <h2 className="duri-section-title text-balance max-w-[24ch]">
                    <span className="duri-strike mr-3 md:mr-4">Workflow Builder</span>
                    <br className="hidden sm:inline" />
                    <span>Just describe the work.</span>
                </h2>

                <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-6 lg:gap-10 items-stretch">
                    <div className="rounded-xs border border-on-background bg-background overflow-hidden shadow-[0_16px_48px_-24px_rgba(0,50,32,0.18)] flex flex-col">
                        <div className="px-5 py-4 border-b border-divider bg-background-warm">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-on-background-secondary font-semibold mb-1.5">
                                You
                            </p>
                            <p className="text-[0.95rem] text-on-background leading-snug">
                                Every Wednesday, email overdue invoices to those customers.
                            </p>
                        </div>
                        <ul className="px-5 py-5 flex flex-col gap-3 flex-1">
                            {STEPS.map((step, i) => {
                                const running = i === STEPS.length - 1;
                                return (
                                    <li
                                        key={step}
                                        className="duri-auto-step flex items-center gap-3"
                                        style={{ animationDelay: `${i * 0.45}s` }}
                                    >
                                        <span
                                            className={`inline-flex flex-none items-center justify-center w-[18px] h-[18px] rounded-full border ${
                                                running
                                                    ? "border-brand bg-background"
                                                    : "border-brand bg-brand text-on-brand"
                                            }`}
                                        >
                                            {running ? (
                                                <Loader2 className="w-3 h-3 text-brand animate-spin" />
                                            ) : (
                                                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                            )}
                                        </span>
                                        <span
                                            className={`text-[0.9rem] leading-snug ${
                                                running
                                                    ? "text-on-background font-medium"
                                                    : "text-on-background-secondary"
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="rounded-xs overflow-hidden border-[1.5px] border-on-background bg-background shadow-[0_16px_48px_-24px_rgba(0,50,32,0.18)]">
                        <video
                            src={`${base}videos/flow-animation.mp4`}
                            autoPlay
                            muted
                            playsInline
                            aria-hidden="true"
                            className="w-full h-full block aspect-video object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
