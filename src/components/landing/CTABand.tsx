import { ArrowRightIcon, MailIcon } from "lucide-react";

const CONTACT_EMAIL = "contact@duri-ai.com";
const BOOK_LINK = "https://cal.com/duri-ai/intro";

export default function CTABand() {
    return (
        <section className="relative w-full bg-background border-t border-divider overflow-hidden">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 md:gap-16 items-center">
                    <div className="max-w-[26rem]">
                        <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                            Talk to us
                        </p>
                        <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background text-balance">
                            Have a workflow in mind? Walk us through it.
                        </h2>
                        <p className="mt-4 text-[0.975rem] leading-[1.55] text-on-background-secondary">
                            Show us the task you do every week. We'll show you what Duri
                            does with it.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row md:justify-end items-stretch sm:items-center gap-3">
                        <a
                            href={BOOK_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                        >
                            Book a demo
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs text-[0.875rem] font-semibold border border-divider-strong bg-background text-on-background transition-colors duration-200 hover:border-on-background"
                        >
                            <MailIcon className="w-3.5 h-3.5" />
                            Contact us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
