import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

type CtaBandProps = {
    refCallback: (el: HTMLElement | null) => void;
};

export default function CtaBand({ refCallback }: CtaBandProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
    };

    return (
        <section
            id="demo"
            ref={refCallback}
            className="relative w-full bg-brand text-on-brand min-w-xs overflow-hidden"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "88px 88px",
                }}
                aria-hidden
            />

            <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-3">
                        <span className="block h-px flex-1 max-w-[60px] bg-on-brand-secondary/40" aria-hidden />
                        <span
                            className="duri-eyebrow whitespace-nowrap"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            Book a demo
                        </span>
                        <span className="block h-px flex-1 max-w-[60px] bg-on-brand-secondary/40" aria-hidden />
                    </div>

                    <div className="mt-8 bg-background text-on-background border border-on-background rounded-xs">
                        {submitted ? (
                            <div className="p-6 flex items-start gap-3">
                                <span className="flex-none w-6 h-6 bg-brand text-on-brand inline-flex items-center justify-center rounded-xs">
                                    <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                                </span>
                                <div>
                                    <p className="text-[15px] text-on-background font-medium">
                                        Thanks. We'll reach out the same business day.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
                                <label
                                    htmlFor="cta-email"
                                    className="text-[12.5px] text-on-background-secondary"
                                >
                                    Work email
                                </label>
                                <input
                                    id="cta-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ops@yourcompany.com"
                                    className="border border-divider-strong focus:border-on-background bg-background text-on-background placeholder:text-on-background-secondary text-[14.5px] px-3.5 py-3 rounded-xs"
                                />
                                <button
                                    type="submit"
                                    className="group inline-flex items-center justify-center gap-2 text-on-brand bg-on-background hover:bg-brand-variant border border-on-background hover:border-brand-variant rounded-xs text-[14.5px] px-4 py-3 transition-colors duration-200 cursor-pointer"
                                >
                                    Request a demo
                                    <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
