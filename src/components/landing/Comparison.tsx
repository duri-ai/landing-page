import { Zap, Wallet, Mail, Network, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const base = import.meta.env.BASE_URL;

type Row = {
    icon: LucideIcon;
    feature: string;
    cowork: string;
    duri: string;
    accent?: "primary" | "secondary";
};

const ROWS: Row[] = [
    {
        icon: Zap,
        feature: "Response speed",
        cowork: "Baseline",
        duri: "2× faster",
        accent: "primary",
    },
    {
        icon: Wallet,
        feature: "Cost per run",
        cowork: "Baseline",
        duri: "1.5× cheaper",
        accent: "primary",
    },
    {
        icon: Mail,
        feature: "Email work",
        cowork: "Drafts only",
        duri: "Reads, drafts, sends",
        accent: "secondary",
    },
    {
        icon: Network,
        feature: "Multiple accounts",
        cowork: "One at a time",
        duri: "All stores in parallel",
        accent: "secondary",
    },
    {
        icon: Workflow,
        feature: "Runs on a schedule",
        cowork: "Manual trigger",
        duri: "Set once, runs forever",
        accent: "secondary",
    },
];

export default function Comparison() {
    return (
        <section className="w-full bg-background-warm border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <div className="mb-12 md:mb-16 text-center max-w-[44rem] mx-auto">
                    <p className="duri-eyebrow mb-4">Why Duri</p>
                    <h2 className="duri-section-title text-balance">
                        A chat tool can talk about the work.{" "}
                        <span className="text-brand">Duri does it.</span>
                    </h2>
                </div>

                <div className="mx-auto max-w-[860px]">
                    {/* Desktop / tablet table */}
                    <div className="hidden sm:block rounded-xs border border-divider-strong bg-background overflow-hidden">
                        <div className="grid [grid-template-columns:minmax(180px,1.4fr)_minmax(140px,1fr)_minmax(180px,1.2fr)] border-b border-divider bg-background-warm">
                            <div className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-background-secondary">
                                Capability
                            </div>
                            <div className="px-4 py-3.5 flex items-center justify-center gap-2 border-l border-divider">
                                <img
                                    src={`${base}logos/third_party/claude.svg`}
                                    alt=""
                                    aria-hidden
                                    className="w-3.5 h-3.5 rounded-[3px] object-contain opacity-80"
                                />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-on-background-secondary">
                                    Chat tools
                                </span>
                            </div>
                            <div className="px-4 py-3.5 flex items-center justify-center gap-2 border-l border-brand/30 bg-brand text-on-brand">
                                <img
                                    src={`${base}logos/d.svg`}
                                    alt=""
                                    aria-hidden
                                    className="w-3.5 h-3.5 object-contain invert"
                                />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                                    Duri
                                </span>
                            </div>
                        </div>

                        {ROWS.map((row, i) => {
                            const Icon = row.icon;
                            const last = i === ROWS.length - 1;
                            return (
                                <div
                                    key={row.feature}
                                    className={`grid [grid-template-columns:minmax(180px,1.4fr)_minmax(140px,1fr)_minmax(180px,1.2fr)] ${last ? "" : "border-b border-divider"}`}
                                >
                                    <div className="px-5 py-4 sm:py-5 flex items-center gap-3 text-[0.95rem] font-medium text-on-background">
                                        <Icon size={16} aria-hidden className="flex-none text-on-background-secondary" />
                                        {row.feature}
                                    </div>
                                    <div className="px-4 py-4 sm:py-5 flex items-center justify-center border-l border-divider">
                                        <span className="text-[0.85rem] text-on-background-secondary text-center leading-snug">
                                            {row.cowork}
                                        </span>
                                    </div>
                                    <div className="relative px-4 py-4 sm:py-5 flex items-center justify-center border-l border-brand/15 bg-[color-mix(in_oklch,var(--brand)_6%,var(--background))]">
                                        {row.accent === "primary" ? (
                                            <span className="text-[clamp(1.05rem,1.5vw,1.25rem)] font-semibold text-brand tracking-tight leading-none">
                                                {row.duri}
                                            </span>
                                        ) : (
                                            <span className="text-[0.9rem] font-medium text-on-background text-center leading-snug">
                                                {row.duri}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile stacked list */}
                    <ul className="sm:hidden flex flex-col gap-3">
                        {ROWS.map((row) => {
                            const Icon = row.icon;
                            return (
                                <li
                                    key={row.feature}
                                    className="rounded-xs border border-divider-strong bg-background p-4"
                                >
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Icon size={15} aria-hidden className="flex-none text-on-background-secondary" />
                                        <p className="text-[0.95rem] font-medium text-on-background leading-tight">
                                            {row.feature}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-[0.12em] text-on-background-secondary font-semibold">
                                                Chat tools
                                            </span>
                                            <span className="text-[0.85rem] text-on-background-secondary leading-snug">
                                                {row.cowork}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-[0.12em] text-brand font-semibold">
                                                Duri
                                            </span>
                                            {row.accent === "primary" ? (
                                                <span className="text-[1.1rem] font-semibold text-brand leading-none tracking-tight">
                                                    {row.duri}
                                                </span>
                                            ) : (
                                                <span className="text-[0.9rem] font-medium text-on-background leading-snug">
                                                    {row.duri}
                                                </span>
                                            )}
                                        </div>
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
