import { ClockIcon, DatabaseIcon, MailIcon, ChevronRightIcon } from "lucide-react";

const STEPS = [
    {
        icon: ClockIcon,
        label: "Runs on your schedule",
        sub: "Pick the time and day. Duri shows up.",
    },
    {
        icon: DatabaseIcon,
        label: "Pulls from your connected apps",
        sub: "Shopify, QuickBooks, wherever the data lives.",
    },
    {
        icon: MailIcon,
        label: "Sends results straight to you",
        sub: "Email summary, synced records, generated docs.",
    },
];

export default function Automation() {
    return (
        <section className="w-full border-t border-on-background/20 bg-on-background">
            <div className="mx-auto max-w-[960px] px-8 py-20">
                <div className="mb-20 text-center">
                    <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-[-0.018em] font-medium mx-auto text-on-brand max-w-[40rem] text-balance">
                        Set it once.{" "}
                        <span className="whitespace-nowrap">It runs every day.</span>
                    </h2>
                </div>

                <div className="flex flex-row items-stretch gap-0">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.label} className="flex flex-row items-stretch flex-1">
                                <div className="flex-1 flex flex-col justify-start border border-white/10 rounded-xs p-6 bg-white/5 backdrop-blur-sm">
                                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-xs flex-none bg-brand text-on-brand">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <p className="mt-3 text-base font-semibold leading-snug text-on-brand">
                                        {step.label}
                                    </p>
                                    <p className="mt-1.5 text-sm leading-relaxed text-white/60 tracking-[0.01em]">
                                        {step.sub}
                                    </p>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="flex items-center px-3 flex-none" aria-hidden>
                                        <ChevronRightIcon className="w-5 h-5 text-white/20" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-14 flex justify-start">
                    <div className="inline-flex items-start gap-2 border border-white/10 rounded-xl px-4 py-2.5">
                        <span className="block w-1.5 h-1.5 rounded-full bg-brand animate-pulse flex-none mt-[5px]" aria-hidden />
                        <span className="text-sm leading-relaxed text-white/60 tracking-[0.01em]">
                            Example: "Every Wednesday, find invoices overdue 30+ days and email reminders"
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
