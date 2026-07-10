import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { trackOutbound } from "../../utils/analytics";

const CONTACT_EMAIL = "info@duri-ai.com";
const BACKEND = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/+$/, "");

type Status = "idle" | "sending" | "done" | "error";

export default function CTABand() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === "sending" || status === "done") return;
        trackOutbound("book_demo_click", { source: "cta_band" });
        setStatus("sending");
        try {
            const res = await fetch(`${BACKEND}/demo/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message: message.trim() }),
            });
            if (!res.ok) throw new Error("request failed");
            setStatus("done");
        } catch {
            setStatus("error");
        }
    };

    const done = status === "done";
    const busy = done || status === "sending";

    return (
        <section id="talk-to-us" className="relative w-full bg-background border-t border-divider overflow-hidden scroll-mt-16 sm:scroll-mt-20">
            <div
                aria-hidden
                className="absolute inset-0 duri-grid-bg opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
            />

            <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
                <div className="mx-auto max-w-[620px] text-center">
                    <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-on-background-secondary mb-4">
                        Talk to us
                    </p>
                    <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-on-background text-balance">
                        What is the chore eating your week?
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="mt-8 flex flex-col gap-3 text-left"
                    >
                        <textarea
                            required
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={busy}
                            placeholder="Tell us the task you keep doing by hand..."
                            className="w-full resize-none bg-background border border-divider-strong rounded-xs px-4 py-3 text-[0.95rem] leading-[1.5] text-on-background placeholder:text-on-background-secondary focus:border-on-background focus:outline-none transition-colors duration-200 disabled:opacity-60"
                        />
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-stretch">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={busy}
                                placeholder="Your work email"
                                className="flex-1 bg-background border border-divider-strong rounded-xs px-4 py-3 text-[0.95rem] text-on-background placeholder:text-on-background-secondary focus:border-on-background focus:outline-none transition-colors duration-200 disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={busy}
                                aria-live="polite"
                                className={`relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xs text-[0.9rem] font-semibold border whitespace-nowrap transition-colors duration-500 sm:min-w-[176px] ${
                                    done
                                        ? "border-brand bg-brand-soft text-brand cursor-default"
                                        : "border-brand bg-brand text-on-brand hover:bg-brand-variant cursor-pointer"
                                }`}
                            >
                                <span
                                    className={`inline-flex items-center gap-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        done ? "opacity-0 -translate-y-1 pointer-events-none" : "opacity-100 translate-y-0"
                                    }`}
                                >
                                    {status === "sending" ? "Sending" : "Book a demo"}
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </span>
                                <span
                                    className={`absolute inset-0 inline-flex items-center justify-center gap-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                                    }`}
                                >
                                    <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                                    Request received
                                </span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-[12px] text-on-background-secondary min-h-[1.25rem]">
                        {done ? (
                            <span className="text-brand">We will be in touch shortly with a walkthrough.</span>
                        ) : status === "error" ? (
                            <span className="text-danger">
                                Something went wrong. Please write to{" "}
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="underline underline-offset-2 hover:text-on-background transition-colors"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                                .
                            </span>
                        ) : (
                            <>
                                Or write directly to{" "}
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="text-on-background underline underline-offset-2 hover:text-brand transition-colors"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                                .
                            </>
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
}