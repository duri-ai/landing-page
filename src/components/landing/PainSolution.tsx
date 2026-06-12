import { XIcon, CheckIcon } from "lucide-react";

const WITHOUT = [
    "Copying each Shopify order into QuickBooks, one by one, every morning",
    "Sending invoice reminders manually, often days after they're overdue",
    "Re-typing the same customer info across three different fields",
    "Two spreadsheets, two different numbers. Nobody knows which is right",
];

const WITH = [
    "Every Shopify order lands in QuickBooks automatically",
    "Invoice follow-ups go out on schedule. No reminders needed",
    "Customer info stays consistent everywhere",
    "One source of truth across all your tools",
];

export default function PainSolution() {
    return (
        <section className="w-full bg-background border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
                <span className="duri-eyebrow">The Problem</span>
                <h2 className="duri-section-title mt-3">Sound familiar?</h2>
                <p className="mt-5 text-[16px] md:text-[18px] text-on-background-secondary max-w-2xl whitespace-nowrap">
                    Every morning, the same 30-minute routine. Copying, pasting, switching tabs. Work that should take seconds takes hours.
                </p>

                <div className="mt-7 md:mt-11 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="border border-[#fca5a5] rounded-xs overflow-hidden">
                        <div className="bg-[#fff5f5] border-b border-[#fca5a5] px-5 py-3.5">
                            <span className="text-[12px] font-semibold text-[#b91c1c] uppercase tracking-wider">
                                Without Duri
                            </span>
                        </div>
                        <ul className="px-5 py-5 flex flex-col gap-3.5">
                            {WITHOUT.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[14.5px] md:text-[16px] text-on-background leading-snug">
                                    <span className="flex-none mt-0.5 w-5 h-5 rounded-full bg-[#fee2e2] flex items-center justify-center">
                                        <XIcon className="w-3 h-3 text-[#ef4444]" strokeWidth={2.5} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border border-brand rounded-xs overflow-hidden">
                        <div className="bg-brand-soft border-b border-brand px-5 py-3.5">
                            <span className="text-[12px] font-semibold text-brand uppercase tracking-wider">
                                With Duri
                            </span>
                        </div>
                        <ul className="px-5 py-5 flex flex-col gap-3.5">
                            {WITH.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[14.5px] md:text-[16px] text-on-background leading-snug">
                                    <span className="flex-none mt-0.5 w-5 h-5 rounded-full bg-brand-soft flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-brand" strokeWidth={2.5} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
