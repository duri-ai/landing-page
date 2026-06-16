import { Zap, CircleDollarSign, Mail, Link2 } from "lucide-react";

const base = import.meta.env.BASE_URL;

const ROWS = [
    {
        icon: Zap,
        iconClass: "text-[#f59e0b]",
        feature: "Response speed",
        cowork: "Baseline",
        duri: "2× faster",
        duriHighlight: true,
    },
    {
        icon: CircleDollarSign,
        iconClass: "text-[#10b981]",
        feature: "Cost",
        cowork: "Baseline",
        duri: "1.5× cheaper",
        duriHighlight: true,
    },
    {
        icon: Mail,
        iconClass: "text-[#3b82f6]",
        feature: "Email tasks",
        cowork: "Draft only",
        duri: "Draft → send",
        duriHighlight: false,
    },
    {
        icon: Link2,
        iconClass: "text-[#8b5cf6]",
        feature: "Multi-account support",
        cowork: "Not supported",
        duri: "Syncs all accounts & stores",
        duriHighlight: false,
    },
];

export default function Comparison() {
    const last = ROWS.length - 1;

    return (
        <section className="w-full bg-background-warm border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[960px] px-6 md:px-8 py-14 md:py-24 flex flex-col items-center">
                <div className="w-full max-w-2xl rounded-xl">
                    <div className="overflow-visible min-w-[480px] rounded-xl border border-divider bg-background">
                        <div className="grid [grid-template-columns:minmax(160px,1fr)_160px_160px] border-b border-divider bg-background-warm rounded-t-xl">
                            <div className="px-6 py-4" />
                            <div className="flex px-4 py-4 items-center justify-center gap-2 border-l border-divider">
                                <img
                                    src={`${base}logos/third_party/claude.svg`}
                                    alt=""
                                    aria-hidden="true"
                                    className="w-4 h-4 rounded-sm object-contain"
                                />
                                <span className="text-sm text-on-background-secondary font-semibold">Cowork</span>
                            </div>
                            <div className="px-4 py-4 flex items-center justify-center gap-2 border-l border-divider text-brand relative z-[1]">
                                <img
                                    src={`${base}logos/d.svg`}
                                    alt=""
                                    aria-hidden="true"
                                    className="w-4 h-4 object-contain"
                                />
                                <span className="text-sm font-semibold">Duri</span>
                            </div>
                        </div>

                        <div className="relative overflow-visible">
                            <div
                                aria-hidden="true"
                                className="absolute top-0 right-0 h-full w-[160px] border-[1.5px] border-brand rounded-[8px] pointer-events-none z-[2]"
                            />
                            {ROWS.map((row, i) => (
                                <div
                                    key={row.feature}
                                    className={`grid [grid-template-columns:minmax(160px,1fr)_160px_160px] ${i < last ? "border-b border-divider" : ""}`}
                                >
                                    <div className="px-6 py-5 text-base font-semibold text-on-background leading-snug flex items-center gap-3">
                                        <row.icon size={16} aria-hidden="true" className={`flex-none ${row.iconClass}`} />
                                        {row.feature}
                                    </div>
                                    <div className="flex px-4 py-5 items-center justify-center border-l border-divider">
                                        <span className="text-sm text-on-background-secondary text-center leading-snug">
                                            {row.cowork}
                                        </span>
                                    </div>
                                    <div className="px-4 py-5 flex items-center justify-center bg-[rgba(0,168,107,0.05)] relative z-[1]">
                                        <span className={`text-sm font-semibold text-center leading-snug whitespace-pre-line ${row.duriHighlight ? "text-brand" : "text-on-background"}`}>
                                            {row.duri}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
