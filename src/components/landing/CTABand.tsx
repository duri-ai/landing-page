import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABand() {
    return (
        <section className="relative w-full bg-background-warm border-t border-divider overflow-hidden">
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
                <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background max-w-[20ch] mx-auto text-balance">
                    Ready when you are.
                </h2>
                <Link
                    to="/signup"
                    className="mt-9 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                >
                    Get started
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
            </div>
        </section>
    );
}
