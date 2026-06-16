const base = import.meta.env.BASE_URL;

export default function Automation() {
    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
            />
            <div
                aria-hidden
                className="absolute -top-20 right-[-180px] h-[520px] w-[520px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 8%, transparent) 0%, transparent 65%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-20 md:py-32">
                <div className="mx-auto max-w-[920px] text-center">
                    <h2 className="text-[clamp(2.25rem,5.6vw,4.5rem)] leading-[1.04] tracking-[-0.026em] font-medium text-on-background text-balance">
                        Recurring tasks, just describe the work.
                    </h2>
                </div>

                <div className="mt-14 md:mt-20 mx-auto max-w-[960px]">
                    <div className="rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background shadow-[0_24px_72px_-28px_rgba(0,50,32,0.26)]">
                        <video
                            src={`${base}videos/flow-animation.mp4`}
                            autoPlay
                            muted
                            playsInline
                            aria-hidden="true"
                            className="w-full block aspect-video object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
