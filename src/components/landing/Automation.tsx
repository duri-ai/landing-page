import CapabilityScenes from "./CapabilityScenes";

export default function Automation() {
    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.14] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
            />
            <div
                aria-hidden
                className="absolute -top-20 right-[-180px] h-[520px] w-[520px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in oklch, var(--brand) 7%, transparent) 0%, transparent 65%)",
                }}
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32">
                <div className="max-w-[44rem]">
                    <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                        What it handles
                    </p>
                    <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.024em] font-medium text-on-background text-balance">
                        Just describe the work.
                    </h2>
                    <p className="mt-5 text-[clamp(0.975rem,1.15vw,1.1rem)] leading-[1.55] text-on-background-secondary max-w-[36rem]">
                        Say it once. Duri figures out where the data lives, runs every
                        step, and keeps doing it on the schedule you give it.
                    </p>
                </div>

                <div className="mt-12 md:mt-16 mx-auto max-w-[1120px]">
                    <CapabilityScenes />
                </div>
            </div>
        </section>
    );
}