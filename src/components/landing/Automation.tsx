const base = import.meta.env.BASE_URL;

export default function Automation() {
    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.14] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, var(--brand) 5%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-20 md:py-32">
                <div className="max-w-[22ch]">
                    <h2 className="text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.02] tracking-[-0.026em] font-medium text-on-background text-balance">
                        <span className="text-brand">Recurring</span> tasks.
                    </h2>
                    <p className="mt-4 text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.5] text-on-background-secondary">
                        Just describe the work.
                    </p>
                </div>

                <div className="mt-12 md:mt-16 mx-auto max-w-[960px]">
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
