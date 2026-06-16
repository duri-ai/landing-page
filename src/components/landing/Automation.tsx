const base = import.meta.env.BASE_URL;

export default function Automation() {
    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.16] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, var(--brand) 5%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
                <div className="max-w-[26ch]">
                    <p className="duri-eyebrow mb-5">
                        <span className="duri-strike">Workflow builder</span>
                    </p>
                    <h2 className="text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.04] tracking-[-0.024em] font-medium text-on-background text-balance">
                        Recurring tasks,{" "}
                        <span className="text-brand">done for you</span>.
                    </h2>
                    <p className="mt-5 text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.5] text-on-background-secondary max-w-[40ch]">
                        Just describe the work. Duri runs it on schedule, no graph to wire,
                        no nodes to maintain.
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
