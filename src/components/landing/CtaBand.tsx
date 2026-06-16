import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABand() {
    return (
        <section className="w-full bg-background-warm border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[960px] px-6 md:px-8 py-12 md:py-16">
                <div className="w-full flex flex-col items-center justify-center text-center px-6 py-16 md:px-20 md:py-20 rounded-2xl bg-brand-dark">
                    <h2 className="text-[clamp(1.75rem,3.8vw,2.5rem)] leading-[1.1] font-semibold text-on-brand text-balance">
                        Ready to hand off your work?
                    </h2>
                    <Link
                        to="/signup"
                        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xs text-base font-medium border border-transparent bg-background text-on-background transition-colors duration-200 hover:bg-background-warm"
                    >
                        Try Duri free
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
