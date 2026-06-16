import { Zap, Wallet, MousePointer2, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Row = {
    icon: LucideIcon;
    feature: string;
    chat: string;
    duri: string;
    accent?: "primary";
};

const ROWS: Row[] = [
    {
        icon: Zap,
        feature: "Speed",
        chat: "Baseline",
        duri: "2× faster",
        accent: "primary",
    },
    {
        icon: Wallet,
        feature: "Cost",
        chat: "Baseline",
        duri: "1.5× cheaper",
        accent: "primary",
    },
    {
        icon: MousePointer2,
        feature: "Action",
        chat: "Talks about it",
        duri: "Does it",
    },
    {
        icon: Layers,
        feature: "Reach",
        chat: "One at a time",
        duri: "All at once",
    },
];

export default function Comparison() {
    return (
        <section className="w-full bg-background-warm border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <h2 className="duri-section-title max-w-[22ch] mx-auto text-center text-balance mb-12 md:mb-16">
                    What chat tools can't,{" "}
                    <span className="text-brand">Duri does</span>.
                </h2>

                <div className="mx-auto max-w-[820px]">
                    <div className="grid [grid-template-columns:1.2fr_1fr_1fr] gap-x-4 sm:gap-x-8 pb-3 border-b border-divider">
                        <div />
                        <div className="text-center text-[11px] uppercase tracking-[0.14em] text-on-background-secondary font-semibold">
                            Chat
                        </div>
                        <div className="text-center text-[11px] uppercase tracking-[0.14em] text-brand font-semibold">
                            Duri
                        </div>
                    </div>

                    <ul className="flex flex-col">
                        {ROWS.map((row) => {
                            const Icon = row.icon;
                            return (
                                <li
                                    key={row.feature}
                                    className="grid [grid-template-columns:1.2fr_1fr_1fr] gap-x-4 sm:gap-x-8 items-center py-5 sm:py-6 border-b border-divider last:border-b-0"
                                >
                                    <div className="flex items-center gap-3 text-on-background">
                                        <Icon size={16} aria-hidden className="flex-none text-on-background-secondary" />
                                        <span className="text-[0.95rem] font-medium">{row.feature}</span>
                                    </div>
                                    <div className="text-center text-[0.9rem] text-on-background-secondary">
                                        {row.chat}
                                    </div>
                                    <div className="text-center">
                                        {row.accent === "primary" ? (
                                            <span className="text-[clamp(1.1rem,1.7vw,1.4rem)] font-semibold text-brand tracking-tight leading-none">
                                                {row.duri}
                                            </span>
                                        ) : (
                                            <span className="text-[0.95rem] font-semibold text-on-background">
                                                {row.duri}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
