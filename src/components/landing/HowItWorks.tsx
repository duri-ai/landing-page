import { LinkIcon, MessageSquareTextIcon, PlayIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
    num: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    title: string;
    body: string;
    tag: string;
    tagBg: string;
    tagColor: string;
    tagIcon: string;
};

const STEPS: Step[] = [
    {
        num: "Step 01",
        icon: LinkIcon,
        iconBg: "bg-brand-soft",
        iconColor: "text-brand",
        title: "Connect your tools",
        body: "Just link your API keys to get started. We don’t keep your passwords, ensuring your data remains fully protected.",
        tag: "Your keys, your control, secure connection.",
        tagBg: "bg-brand-soft",
        tagColor: "text-brand",
        tagIcon: "⚡",
    },
    {
        num: "Step 02",
        icon: MessageSquareTextIcon,
        iconBg: "bg-[#f0fdf4]",
        iconColor: "text-[#16a34a]",
        title: "Tell AI what to automate",
        body: 'Just describe it in plain language: "Hey, can you pull this Shopify order into Airtable inventory?"',
        tag: "No code, no flowcharts required",
        tagBg: "bg-[#f0fdf4]",
        tagColor: "text-[#16a34a]",
        tagIcon: "💬",
    },
    {
        num: "Step 03",
        icon: PlayIcon,
        iconBg: "bg-[#fff7ed]",
        iconColor: "text-[#ea580c]",
        title: "Watch it run",
        body: "Activate and it runs 24/7. See every task in the activity log. Get alerts if anything needs your attention.",
        tag: "Real-time logs, zero babysitting",
        tagBg: "bg-[#fff7ed]",
        tagColor: "text-[#ea580c]",
        tagIcon: "📊",
    },
];

export default function HowItWorks() {
    return (
        <section id="how" className="w-full bg-background border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
                <span className="duri-eyebrow">How it works</span>
                <h2 className="duri-section-title mt-3">Get up to speed in minutes.</h2>
                <p className="mt-5 text-[16px] md:text-[18px] text-on-background-secondary max-w-xl">
                    Just connect your tools and tell the AI what you need. <br/> Now focus on what truly matters.
                </p>

                <ol className="mt-14 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {STEPS.map((step) => (
                        <li
                            key={step.num}
                            className="flex flex-col gap-5 border border-divider rounded-xs p-6 bg-background"
                        >
                            <div className="flex flex-col gap-4">
                                <span className="text-[12px] font-mono text-on-background-secondary">
                                    {step.num}
                                </span>
                                <span className={`w-10 h-10 rounded-xs flex items-center justify-center ${step.iconBg}`}>
                                    <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="text-[17px] md:text-[18px] font-semibold text-on-background leading-snug">
                                    {step.title}
                                </h3>
                                <p className="text-[13.5px] md:text-[14px] text-on-background-secondary leading-relaxed">
                                    {step.body}
                                </p>
                            </div>

                            <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xs text-[12.5px] font-medium ${step.tagBg} ${step.tagColor}`}>
                                <span aria-hidden>{step.tagIcon}</span>
                                <span>{step.tag}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
