import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABand() {
    return (
        <section className="w-full bg-background border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-20 md:py-28 text-center">
                <h2 className="duri-section-title max-w-[20ch] mx-auto text-balance">
                    Ready when{" "}
                    <span className="text-brand">you are</span>.
                </h2>
                <Link
                    to="/signup"
                    className="mt-10 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xs text-base font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                >
                    Try Duri free
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
