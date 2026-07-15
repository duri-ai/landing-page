import HeroVideo from "./HeroVideo";

export default function Hero() {
    return (
        <section className="relative w-full bg-background overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.4] pointer-events-none"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--brand) 8%, transparent) 0%, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, transparent, var(--background) 80%)",
                }}
            />
            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-16 md:pb-24">
                <div id="download" className="text-left sm:text-center">
                    <p className="text-sm sm:text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.45] text-on-background-secondary max-w-[40ch] mx-0 sm:mx-auto text-balance">
                        Hand off your day-to-day operations to AI.
                    </p>
                    <h1 className="mt-5 text-[clamp(2.5rem,6.4vw,5rem)] max-[375px]:text-[clamp(1.75rem,6.4vw,5rem)] leading-[1.02] tracking-[-0.028em] font-medium text-on-background max-w-[17ch] max-[375px]:max-w-none mx-0 sm:mx-auto text-balance">
                        What is the <span className="text-brand">chore</span> eating your week?
                    </h1>
                </div>

                <div className="mt-10 sm:mt-14 mx-auto max-w-[960px]">
                    <HeroVideo />
                </div>
            </div>
        </section>
    );
}
