import { ArrowRightIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

const CONTACT_EMAIL = "contact@duri-ai.com";

export default function CTABand() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const subject = encodeURIComponent("Workflow to automate");
        const body = encodeURIComponent(
            `${message}\n\n— Reply to ${email || "(no email provided)"}`,
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    return (
        <section className="relative w-full bg-background border-t border-divider overflow-hidden">
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
                        Have a workflow in mind? Walk us through it.
                    </h2>
                    <p className="mt-4 text-[0.975rem] leading-[1.55] text-on-background-secondary">
                        Tell us about the task you do every week, and we'll show you what
                        Duri does with it.
                    </p>

                    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 text-left">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="w-full bg-background border border-divider-strong rounded-xs px-4 py-3 text-[0.95rem] text-on-background placeholder:text-on-background-secondary focus:border-on-background focus:outline-none transition-colors duration-200"
                        />
                        <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="What's the work you'd like off your plate?"
                            className="w-full bg-background border border-divider-strong rounded-xs px-4 py-3 text-[0.95rem] text-on-background placeholder:text-on-background-secondary focus:border-on-background focus:outline-none transition-colors duration-200 resize-none"
                        />
                        <button
                            type="submit"
                            className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xs text-[0.9rem] font-semibold border border-brand bg-brand text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                        >
                            Send
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                        <p className="mt-1 text-[12px] text-on-background-secondary">
                            Or write directly to{" "}
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="text-on-background underline underline-offset-2 hover:text-brand transition-colors"
                            >
                                {CONTACT_EMAIL}
                            </a>
                            .
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
