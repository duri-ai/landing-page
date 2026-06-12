import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

const APPLE_LOGO = `${import.meta.env.BASE_URL}misc_images/apple.png`;
const WINDOWS_LOGO = `${import.meta.env.BASE_URL}misc_images/windows.png`;
const MAC_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

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
            className="w-full bg-brand text-on-brand min-w-xs relative overflow-hidden"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: "64px 64px",
            }}
        >
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">

                    {/* Left: download CTA */}
                    <div className="flex flex-col gap-8 pr-8 md:pr-16">
                        <div>
                            <span className="duri-eyebrow text-on-brand/60">Ready to start</span>
                            <h2 className="duri-section-title text-on-brand mt-3">
                                You've seen what it does.
                            </h2>
                            <p className="mt-4 text-[15px] text-on-brand/75 leading-relaxed max-w-sm">
                                Install Duri and connect your first tool in under 5 minutes.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 max-w-[280px]">
                            {/* Mac */}
                            <a
                                href={MAC_DOWNLOAD}
                                className="flex items-center gap-3.5 bg-on-brand hover:bg-white/90 rounded-[5px] px-5 py-3.5 transition-colors duration-200"
                            >
                                <img src={APPLE_LOGO} alt="" aria-hidden className="w-5 h-5 object-contain flex-none" />
                                <div className="text-left">
                                    <p className="text-[10px] text-on-background/50 leading-none">Download on</p>
                                    <p className="text-[15px] font-bold text-on-background leading-snug">Download for Mac</p>
                                </div>
                            </a>
                            {/* Windows */}
                            <a
                                href={WIN_DOWNLOAD}
                                className="flex items-center gap-3.5 bg-on-brand/10 hover:bg-on-brand/20 border border-on-brand/25 rounded-[5px] px-5 py-3.5 transition-colors duration-200"
                            >
                                <img src={WINDOWS_LOGO} alt="" aria-hidden className="w-5 h-5 object-contain invert flex-none" />
                                <div className="text-left">
                                    <p className="text-[10px] text-on-brand/50 leading-none">Download on</p>
                                    <p className="text-[15px] font-bold text-on-brand leading-snug">Download for Windows</p>
                                </div>
                            </a>
                        </div>

                        <p className="text-[12.5px] text-on-brand/45">
                            Free to start · No credit card · Your data stays private
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-on-brand/15 pointer-events-none" aria-hidden />

                    {/* Right: demo request */}
                    <div className="flex flex-col gap-6 pl-8 md:pl-16 border-t border-on-brand/15 md:border-t-0 md:border-l md:border-on-brand/15 pt-10 md:pt-0">
                        <div>
                            <h3 className="text-[22px] md:text-[26px] font-bold text-on-brand leading-snug">
                                Not ready to download?
                            </h3>
                            <p className="mt-3 text-[14.5px] text-on-brand/70 leading-relaxed max-w-sm">
                                See it live with your own data. We'll walk you through a 20-min demo tailored to your workflow.
                            </p>
                        </div>

                        {submitted ? (
                            <div className="flex items-center gap-3 bg-brand-variant rounded-xs p-4">
                                <span className="flex-none w-6 h-6 bg-on-brand text-brand inline-flex items-center justify-center rounded-xs">
                                    <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                                </span>
                                <p className="text-[13.5px] text-on-brand">Thanks. We'll reach out within 1 business day.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 max-w-lg">
                                <label htmlFor="cta-email" className="text-[13px] text-on-brand/60 font-medium">Work email</label>
                                <input
                                    id="cta-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ops@yourcompany.com"
                                    className="w-full bg-on-brand text-on-background placeholder:text-on-background-secondary text-[14px] px-3.5 py-3 rounded-[5px] border-0 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="group w-full inline-flex items-center justify-center gap-2 bg-brand-variant hover:bg-[#00835a] text-on-brand rounded-[5px] text-[15px] font-semibold px-4 py-3.5 transition-colors duration-200 cursor-pointer mt-1"
                                >
                                    Request a demo
                                    <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                                <p className="text-[12px] text-on-brand/40 text-center mt-1">
                                    Usually responds within 1 business day
                                </p>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
