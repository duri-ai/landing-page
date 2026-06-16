import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABand() {
    return (
        <section className="relative w-full bg-background border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.14] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in oklch, var(--brand) 9%, transparent) 0%, transparent 70%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-24 md:py-32 text-center">
                <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.04] tracking-[-0.024em] font-medium text-on-background max-w-[18ch] mx-auto text-balance">
                    Ready when{" "}
                    <span className="text-brand">you are</span>.
                </h2>
                <Link
                    to="/signup"
                    className="mt-10 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xs text-[0.95rem] font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                >
                    Try Duri free
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
