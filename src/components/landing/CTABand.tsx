import { ArrowRightIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { trackOutbound } from "../../utils/analytics";

const CONTACT_EMAIL = "info@duri-ai.com";

export default function CTABand() {
    const [email, setEmail] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        trackOutbound("book_demo_click", { source: "cta_band" });
        const subject = encodeURIComponent("Book a demo");
        const body = encodeURIComponent(
            `Hi Duri team,\n\nI'd like to book a demo.\n\nReply to ${email}.`,
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    return (
        <section id="talk-to-us" className="relative w-full bg-background border-t border-divider overflow-hidden scroll-mt-16 sm:scroll-mt-20">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
                <div className="mx-auto max-w-[560px] text-center">
                    <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                        Talk to us
                    </p>
                    <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background text-balance">
                        Let us walk you through it.
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-stretch text-left"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="flex-1 bg-background border border-divider-strong rounded-xs px-4 py-3 text-[0.95rem] text-on-background placeholder:text-on-background-secondary focus:border-on-background focus:outline-none transition-colors duration-200"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xs text-[0.9rem] font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant whitespace-nowrap cursor-pointer"
                        >
                            Book a demo
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                    </form>
                    <p className="mt-4 text-[12px] text-on-background-secondary">
                        Or write directly to{" "}
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-on-background underline underline-offset-2 hover:text-brand transition-colors"
                        >
                            {CONTACT_EMAIL}
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
