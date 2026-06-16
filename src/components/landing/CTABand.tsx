import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABand() {
    return (
        <section className="w-full bg-background border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
                <div className="relative w-full rounded-xs border border-divider-strong bg-background-warm overflow-hidden">
                    <div aria-hidden className="absolute inset-0 duri-grid-bg opacity-[0.25]" />
                    <div className="relative flex flex-col items-start gap-8 px-6 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-[34rem]">
                            <p className="duri-eyebrow mb-4">Get started</p>
                            <h2 className="text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background text-balance">
                                Stop running the back-office.{" "}
                                <span className="text-brand">Run the business.</span>
                            </h2>
                            <p className="mt-4 text-[0.975rem] leading-[1.55] text-on-background-secondary max-w-[28rem]">
                                Free to try. No credit card. Five dollars of credits to see
                                what Duri will quietly take off your plate.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-none">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant whitespace-nowrap"
                            >
                                Try Duri free
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <a
                                href="#download"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xs text-base font-medium border border-divider-strong bg-background text-on-background transition-colors duration-200 hover:border-on-background whitespace-nowrap"
                            >
                                Download the app
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
