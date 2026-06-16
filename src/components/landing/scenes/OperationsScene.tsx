const base = import.meta.env.BASE_URL;

const STORES = [
    { name: "Storefront ATL", orders: 24 },
    { name: "Storefront LAX", orders: 18 },
    { name: "Storefront YYZ", orders: 31 },
];

export default function OperationsScene() {
    return (
        <div className="relative w-full aspect-[5/4] sm:aspect-[16/11] rounded-xs border border-divider bg-background-warm overflow-hidden">
            <div aria-hidden className="absolute inset-0 duri-grid-bg opacity-[0.35]" />

            <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] h-full items-center gap-2 sm:gap-3 p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:gap-2.5">
                    {STORES.map((store, i) => (
                        <div
                            key={store.name}
                            className="duri-op-store flex items-center gap-2 sm:gap-2.5 rounded-xs border border-divider-strong bg-background px-2.5 sm:px-3 py-2 sm:py-2.5"
                            style={{ animationDelay: `${i * 0.7}s` }}
                        >
                            <img
                                src={`${base}logos/third_party/shopify.svg`}
                                alt=""
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-none"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-[11px] font-medium text-on-background truncate leading-tight">
                                    {store.name}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-on-background-secondary leading-tight tabular-nums">
                                    {store.orders} new orders
                                </p>
                            </div>
                            <span
                                className="duri-op-dot inline-block w-1.5 h-1.5 rounded-full bg-brand flex-none"
                                style={{ animationDelay: `${i * 0.7}s` }}
                            />
                        </div>
                    ))}
                </div>

                <div className="relative flex flex-col items-center justify-center h-full px-1 sm:px-2">
                    <svg
                        viewBox="0 0 80 200"
                        className="h-full w-[40px] sm:w-[60px]"
                        preserveAspectRatio="none"
                        aria-hidden
                    >
                        <path
                            d="M 0 32 Q 40 32 40 100"
                            fill="none"
                            stroke="var(--divider-strong)"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M 0 100 L 40 100"
                            fill="none"
                            stroke="var(--divider-strong)"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M 0 168 Q 40 168 40 100"
                            fill="none"
                            stroke="var(--divider-strong)"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M 40 100 L 80 100"
                            fill="none"
                            stroke="var(--brand)"
                            strokeWidth="1.75"
                        />
                        <circle r="3" fill="var(--brand)" className="duri-op-particle-a">
                            <animateMotion dur="2.1s" repeatCount="indefinite" path="M 0 32 Q 40 32 40 100 L 80 100" />
                        </circle>
                        <circle r="3" fill="var(--brand)" className="duri-op-particle-b">
                            <animateMotion dur="2.1s" begin="0.7s" repeatCount="indefinite" path="M 0 100 L 40 100 L 80 100" />
                        </circle>
                        <circle r="3" fill="var(--brand)" className="duri-op-particle-c">
                            <animateMotion dur="2.1s" begin="1.4s" repeatCount="indefinite" path="M 0 168 Q 40 168 40 100 L 80 100" />
                        </circle>
                    </svg>
                </div>

                <div className="flex flex-col gap-2 sm:gap-2.5">
                    <div className="flex items-center gap-2 sm:gap-2.5 rounded-xs border border-divider-strong bg-background px-2.5 sm:px-3 py-2 sm:py-2.5">
                        <img
                            src={`${base}logos/third_party/quickbooks.svg`}
                            alt=""
                            className="w-4 h-4 sm:w-5 sm:h-5 flex-none"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-on-background leading-tight">
                                QuickBooks Online
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-on-background-secondary leading-tight">
                                Daily ledger
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xs border border-brand/30 bg-brand-soft px-2.5 sm:px-3 py-2 sm:py-2.5">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-on-background-secondary font-semibold leading-tight">
                            Recorded today
                        </p>
                        <p className="duri-op-counter mt-1 text-base sm:text-xl font-semibold text-on-background tabular-nums leading-tight">
                            73 orders
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-on-background-secondary leading-tight">
                            Across 3 storefronts
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
