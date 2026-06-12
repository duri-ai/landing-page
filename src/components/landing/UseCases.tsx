import { useState } from "react";
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";

type Step = { label: string; time: string };
type ChatStep = string;

type Tab = {
    id: string;
    label: string;
    heading: string;
    description: string;
    steps: Step[];
    prompt: string;
    chatSteps: ChatStep[];
    outcome: string;
    tools: string[];
};

const TABS: Tab[] = [
    {
        id: "shopify",
        label: "🛍 Shopify Admin",
        heading: "Daily ops handled before you open your laptop.",
        description: "Register once. Duri runs the job on your schedule, every time.",
        steps: [
            { label: "Compile yesterday's orders into QuickBooks", time: "Every day at 8am" },
            { label: "Check low-stock items and email your supplier", time: "Every Monday at 9am" },
            { label: "Send weekly sales summary to the team", time: "Every Friday at 5pm" },
        ],
        prompt: "Every morning at 8am, compile yesterday's Shopify orders into QuickBooks and send a summary to the team.",
        chatSteps: [
            "Pulled yesterday's Shopify orders",
            "Created invoices in QuickBooks",
            "Sent summary email via Gmail",
        ],
        outcome: "Done. Runs every morning at 8am.",
        tools: ["Shopify", "QuickBooks", "Gmail"],
    },
    {
        id: "sales",
        label: "💰 Sales",
        heading: "Follow-ups sent on schedule, every week.",
        description: "Register once. Duri checks your pipeline and sends follow-ups on time.",
        steps: [
            { label: "Check for leads with no reply and send follow-ups", time: "Every Monday at 9am" },
            { label: "Pull this week's closed deals and create invoices", time: "Every Friday at 4pm" },
            { label: "Send a pipeline report to the sales team", time: "Every Monday at 8am" },
        ],
        prompt: "Every Monday at 9am, find leads with no reply in 3 days and send a follow-up email to each one.",
        chatSteps: [
            "Checked CRM for unresponsive leads",
            "Drafted follow-up emails",
            "Sent via Gmail",
        ],
        outcome: "Sent 6 follow-ups. Runs every Monday at 9am.",
        tools: ["Gmail"],
    },
    {
        id: "bookkeeper",
        label: "📒 Bookkeeper",
        heading: "Month-end reports ready before you ask.",
        description: "Register once. Duri reconciles, chases invoices, and reports on schedule.",
        steps: [
            { label: "Pull overdue invoices and send reminder emails", time: "Every Wednesday at 10am" },
            { label: "Reconcile receipts from Gmail into QuickBooks", time: "Every day at 7am" },
            { label: "Generate month-end PDF report", time: "1st of every month" },
        ],
        prompt: "Every Wednesday at 10am, pull overdue invoices from QuickBooks and send a reminder email to each customer.",
        chatSteps: [
            "Fetched overdue invoices from QuickBooks",
            "Drafted reminder emails",
            "Sent via Gmail",
        ],
        outcome: "Sent 4 reminders. Runs every Wednesday at 10am.",
        tools: ["QuickBooks", "Gmail"],
    },
    {
        id: "hr",
        label: "👥 HR & Ops",
        heading: "Onboarding and weekly ops on autopilot.",
        description: "Register once. Duri handles the routine admin that eats up your Mondays.",
        steps: [
            { label: "Compile new hire records and update the HR sheet", time: "Every Friday at 6pm" },
            { label: "Send weekly headcount report to management", time: "Every Monday at 8am" },
            { label: "Check pending onboarding tasks and send reminders", time: "Every Tuesday at 9am" },
        ],
        prompt: "Every Friday at 6pm, compile this week's new hire records and update the HR spreadsheet in Airtable.",
        chatSteps: [
            "Pulled new hire records",
            "Updated HR spreadsheet in Airtable",
            "Sent summary email via Gmail",
        ],
        outcome: "Updated. Runs every Friday at 6pm.",
        tools: ["Airtable", "Gmail"],
    },
];

export default function UseCases() {
    const [activeId, setActiveId] = useState(TABS[0].id);
    const active = TABS.find((t) => t.id === activeId)!;

    return (
        <section className="w-full bg-background-warm border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
                <span className="duri-eyebrow">Use cases</span>
                <h2 className="duri-section-title mt-3">Built for how your team works.</h2>
                <p className="mt-5 text-[16px] md:text-[18px] text-on-background-secondary max-w-xl">
                    One workspace. Every role.
                </p>

                <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left: tabs + content */}
                    <div className="flex flex-col gap-6">
                        {/* Tab buttons */}
                        <div className="flex flex-wrap gap-2">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveId(tab.id)}
                                    className={`text-[14px] font-medium px-4 py-2 rounded-xs border transition-colors duration-150 cursor-pointer ${
                                        activeId === tab.id
                                            ? "bg-brand text-on-brand border-brand"
                                            : "bg-background text-on-background-secondary border-divider-strong hover:text-on-background hover:border-on-background"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] md:text-[24px] tracking-[-0.018em] leading-[1.25] text-on-background font-semibold">
                                    {active.heading}
                                </h3>
                                <p className="text-[14px] md:text-[15px] text-on-background-secondary leading-[1.5]">
                                    {active.description}
                                </p>
                            </div>

                            <ul className="flex flex-col gap-2.5">
                                {active.steps.map((step) => (
                                    <li key={step.label} className="flex items-center gap-3 h-[38px]">
                                        <span className="inline-flex items-center border border-brand/40 rounded-xs px-3 h-full bg-brand-soft whitespace-nowrap text-brand text-[12px] font-medium flex-none">
                                            {step.time}
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 text-on-background-secondary flex-none" />
                                        <span className="inline-flex items-center border border-divider-strong rounded-xs px-3 h-full bg-background text-[13.5px] text-on-background font-medium leading-snug">
                                            {step.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: chat mockup — starts at same row as tabs */}
                    <div className="overflow-hidden">
                        <ChatMockup tab={active} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChatMockup({ tab }: { tab: Tab }) {
    return (
        <div className="border border-on-background rounded-xs bg-background overflow-hidden shadow-[0_18px_36px_-24px_rgba(0,50,32,0.18)] flex flex-col">
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
                        className="w-3.5 h-3.5 rounded-xs"
                    />
                    <span className="text-[11.5px] font-semibold text-on-background">Duri</span>
                </div>
            </div>

            <div className="px-4 py-4 sm:px-5 bg-background-warm/30 flex flex-col gap-3 flex-1">
                <div className="flex justify-end">
                    <div className="max-w-[82%] bg-background border border-divider-strong rounded-xs px-3 py-2.5">
                        <p className="text-[13.5px] leading-snug text-on-background">{tab.prompt}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5">
                        <img
                            src={`${import.meta.env.BASE_URL}logos/d.svg`}
                            alt=""
                            aria-hidden
                            className="w-4 h-4 rounded-xs"
                        />
                        <span className="text-[12.5px] font-semibold text-on-background">Duri</span>
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-[92%]">
                        {tab.chatSteps.map((step) => (
                            <div key={step} className="flex items-center gap-2 text-[13.5px] text-on-background">
                                <CheckCircle2Icon className="w-3.5 h-3.5 text-brand flex-none" />
                                <span>{step}</span>
                            </div>
                        ))}
                        <p className="text-[13.5px] text-on-background mt-1 pl-0.5">{tab.outcome}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 border-t border-divider bg-background flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-wider text-on-background-secondary font-semibold flex-none">
                    Runs automatically
                </span>
                <div className="flex items-center gap-2 flex-1">
                    {tab.tools.map((tool) => (
                        <span
                            key={tool}
                            className="text-[12px] text-on-background-secondary border border-divider rounded-xs px-2 py-0.5"
                        >
                            {tool}
                        </span>
                    ))}
                </div>
                <button type="button" className="text-[12px] text-on-background-secondary border border-divider rounded-xs px-2.5 py-1 hover:border-on-background hover:text-on-background transition-colors cursor-pointer">
                    Edit
                </button>
            </div>
        </div>
    );
}
