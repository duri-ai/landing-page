const base = import.meta.env.BASE_URL;

const ROWS = [
    {
        keyword: "operations",
        src: `${base}videos/flow-animation.mp4`,
    },
    {
        keyword: "reporting",
        src: `${base}videos/reporting.mp4`,
    },
] as const;

export default function HowItWorks() {
    return (
        <section id="how" className="relative w-full bg-background-warm overflow-hidden">
            <div
                aria-hidden
                className="absolute -left-32 top-1/3 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 6%, transparent) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute -right-32 top-2/3 -translate-y-1/2 h-[480px] w-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--highlight) 4%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1180px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <div className="flex flex-col gap-16 sm:gap-24 md:gap-32">
                    {ROWS.map((row) => (
                        <div
                            key={row.keyword}
                            className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 md:gap-14 items-center"
                        >
                            <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.024em] font-medium text-on-background max-w-[16ch] text-balance">
                                Duri automates{" "}
                                <span className="font-bold relative whitespace-nowrap">
                                    {row.keyword}
                                    <span
                                        aria-hidden
                                        className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-brand"
                                    />
                                </span>
                                .
                            </h2>
                            <div className="relative rounded-[10px] overflow-hidden border-[1.5px] border-on-background bg-background shadow-[0_28px_72px_-28px_rgba(0,50,32,0.22)]">
                                <video
                                    src={row.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    aria-hidden
                                    className="w-full block aspect-video object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
