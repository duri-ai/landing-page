const VIDEO = {
    id: "kEInGNl-IOA",
    label: "Shopify + QuickBooks",
    title: "Orders to invoices, without the weekly copy-paste",
} as const;

export default function HeroVideo() {
    return (
        <section aria-label="Duri Shopify and QuickBooks demo" className="relative w-full">
            <div className="relative overflow-hidden rounded-[6px] border-[1.5px] border-on-background bg-background shadow-[0_36px_84px_-32px_rgba(0,50,32,0.28),0_2px_0_0_rgba(0,50,32,0.06)]">
                <div className="aspect-video overflow-hidden bg-on-background">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${VIDEO.id}?rel=0&playsinline=1`}
                        title={`Duri demo: ${VIDEO.title}`}
                        className="h-full w-full border-0"
                        loading="eager"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>

                <div className="border-t border-divider bg-background px-4 py-3.5 sm:px-5 sm:py-4">
                    <p className="text-[10px] font-semibold tracking-[0.11em] text-on-background-secondary uppercase sm:text-[11px]">
                        {VIDEO.label}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-on-background sm:text-[15px]">
                        {VIDEO.title}
                    </p>
                </div>
            </div>

            <div
                className="absolute -right-3 -bottom-3 -z-10 h-full w-full rounded-[6px] bg-on-background pointer-events-none"
                aria-hidden
            />
        </section>
    );
}
