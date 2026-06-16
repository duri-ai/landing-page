const base = import.meta.env.BASE_URL;

const SOURCES = [
    { src: `${base}logos/third_party/clover.svg`, label: "Clover POS" },
    { src: `${base}logos/third_party/shopify.svg`, label: "Shopify" },
    { src: null, letter: "S", label: "Square" },
    { src: null, letter: "G", label: "Sheets" },
];

export default function ReportingScene() {
    return (
        <div className="relative w-full aspect-[5/4] sm:aspect-[16/11] rounded-xs border border-divider bg-background-warm overflow-hidden">
            <div aria-hidden className="absolute inset-0 duri-grid-bg opacity-[0.35]" />

            <div className="relative z-10 grid grid-cols-[1fr_1.1fr_1fr] h-full items-center gap-2 sm:gap-3 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {SOURCES.map((s, i) => (
                        <div
                            key={s.label}
                            className="duri-rep-source flex items-center gap-1.5 sm:gap-2 rounded-xs border border-divider-strong bg-background px-2 py-1.5 sm:px-2.5 sm:py-2"
                            style={{ animationDelay: `${i * 0.35}s` }}
                        >
                            {s.src ? (
                                <img src={s.src} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-none" />
                            ) : (
                                <span className="inline-flex w-3.5 h-3.5 sm:w-4 sm:h-4 flex-none rounded-[3px] bg-on-background text-on-brand text-[8px] sm:text-[9px] font-bold items-center justify-center leading-none">
                                    {s.letter}
                                </span>
                            )}
                            <span className="text-[9px] sm:text-[10px] text-on-background font-medium truncate leading-tight">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative flex items-center justify-center h-full">
                    <svg
                        viewBox="0 0 120 200"
                        className="absolute inset-0 w-full h-full"
                        preserveAspectRatio="none"
                        aria-hidden
                    >
                        <path d="M 0 50 Q 60 50 60 100" fill="none" stroke="var(--divider-strong)" strokeWidth="1.25" />
                        <path d="M 0 150 Q 60 150 60 100" fill="none" stroke="var(--divider-strong)" strokeWidth="1.25" />
                        <path d="M 60 100 L 120 100" fill="none" stroke="var(--brand)" strokeWidth="1.5" />
                        <circle r="2.5" fill="var(--brand)">
                            <animateMotion dur="2.4s" begin="0s" repeatCount="indefinite" path="M 0 50 Q 60 50 60 100" />
                        </circle>
                        <circle r="2.5" fill="var(--brand)">
                            <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M 0 150 Q 60 150 60 100" />
                        </circle>
                    </svg>

                    <div className="duri-rep-doc relative z-10 w-[58%] sm:w-[62%] rounded-[3px] border border-divider-strong bg-background shadow-[0_8px_24px_-12px_rgba(0,50,32,0.25)] overflow-hidden">
                        <div className="bg-on-background px-1.5 py-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-on-brand/60" />
                            <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-on-brand/80 font-semibold leading-none">
                                Report.pdf
                            </span>
                        </div>
                        <div className="px-2 py-1.5 sm:py-2 flex flex-col gap-1">
                            <div className="h-1 rounded-full bg-on-background/15 w-3/4" />
                            <div className="h-0.5 rounded-full bg-on-background/10 w-full" />
                            <div className="h-0.5 rounded-full bg-on-background/10 w-5/6" />
                            <div className="mt-0.5 grid grid-cols-3 gap-0.5">
                                <div className="h-3 rounded-[1px] bg-brand-soft" />
                                <div className="h-3 rounded-[1px] bg-on-background/8" />
                                <div className="h-3 rounded-[1px] bg-on-background/8" />
                            </div>
                            <div className="h-0.5 rounded-full bg-on-background/10 w-2/3" />
                            <div className="h-0.5 rounded-full bg-on-background/10 w-3/4" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="duri-rep-gmail flex items-center gap-2 rounded-xs border border-divider-strong bg-background px-2 py-1.5 sm:px-2.5 sm:py-2">
                        <img src={`${base}logos/third_party/gmail.svg`} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-none" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] sm:text-[10px] font-semibold text-on-background leading-tight">
                                Sent to ops@
                            </p>
                            <p className="text-[8px] sm:text-[9px] text-on-background-secondary leading-tight">
                                Friday 9:00 AM
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xs border border-brand/30 bg-brand-soft px-2 py-1.5 sm:px-2.5 sm:py-2">
                        <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-on-background-secondary font-semibold leading-tight">
                            Weekly close
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-on-background leading-tight mt-0.5">
                            All sources reconciled
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
