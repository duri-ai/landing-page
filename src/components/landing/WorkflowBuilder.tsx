import { CheckCircle2Icon, ZapIcon } from "lucide-react";

export default function WorkflowBuilder() {
    return (
        <section className="w-full bg-background-warm border-t border-divider min-w-xs">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
                <span className="duri-eyebrow">How automation works here</span>
                <h2 className="duri-section-title mt-3">
                    No automation builder to learn.<br/>
                    <span className="text-brand">Duri just asks</span>, when it needs to.
                </h2>
                <p className="mt-5 text-[16px] md:text-[18px] text-on-background-secondary max-w-xl">
                    You don't configure anything ahead of time.<br />
                    Answer a quick question the first time, and Duri remembers it from then on.
                </p>

                <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
                    <div className="border border-on-background rounded-xs bg-background overflow-hidden shadow-[0_24px_48px_-24px_rgba(0,50,32,0.18)]">

                        {/* Title bar */}
                        <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-divider bg-background-warm">
                            <div className="flex items-center gap-1.5">
                                <span className="block w-2.5 h-2.5 rounded-full bg-[#e15c5c]" aria-hidden />
                                <span className="block w-2.5 h-2.5 rounded-full bg-[#e0a93b]" aria-hidden />
                                <span className="block w-2.5 h-2.5 rounded-full bg-[#5fb96a]" aria-hidden />
                            </div>
                            <div className="flex items-center gap-1.5 ml-1">
                                <img
                                    src={`${import.meta.env.BASE_URL}logos/d.svg`}
                                    alt=""
                                    aria-hidden
                                    className="w-4 h-4 rounded-xs"
                                />
                                <span className="text-[13px] font-semibold text-on-background">Duri</span>
                            </div>
                        </div>

                        {/* Chat body — vertically centered */}
                        <div className="px-5 py-10 bg-background-warm/30 flex flex-col items-center gap-4">

                            {/* User message */}
                            <div className="flex justify-end w-full">
                                <div className="max-w-[82%] bg-background border border-divider-strong rounded-xs px-3.5 py-2.5">
                                    <p className="text-[14.5px] leading-snug text-on-background">
                                        Every morning at 8am, compile yesterday's orders into a spreadsheet and generate a summary PDF.
                                    </p>
                                </div>
                            </div>

                            {/* Duri quick question */}
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex items-center gap-1.5">
                                    <img
                                        src={`${import.meta.env.BASE_URL}logos/d.svg`}
                                        alt=""
                                        aria-hidden
                                        className="w-4 h-4 rounded-xs"
                                    />
                                    <span className="text-[12.5px] font-semibold text-on-background">Duri</span>
                                    <span className="text-[11px] uppercase tracking-wider text-on-background-secondary font-medium ml-1">· Quick question</span>
                                </div>

                                <div className="flex flex-col gap-3 max-w-[90%]">
                                    <p className="text-[14.5px] text-on-background leading-snug">
                                        Which spreadsheet should I use?
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 bg-brand text-on-brand text-[13.5px] font-medium px-3.5 py-1.5 rounded-xs cursor-pointer">
                                            <CheckCircle2Icon className="w-3.5 h-3.5" />
                                            Orders 2024
                                        </span>
                                        <span className="inline-flex items-center text-[13.5px] text-on-background border border-divider-strong px-3.5 py-1.5 rounded-xs cursor-pointer hover:border-on-background transition-colors">
                                            Sales Tracker
                                        </span>
                                        <span className="inline-flex items-center text-[13.5px] text-on-background border border-divider-strong px-3.5 py-1.5 rounded-xs cursor-pointer hover:border-on-background transition-colors">
                                            Monthly Report
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Outcome */}
                            <div className="flex items-start gap-3 bg-brand-soft border border-brand rounded-xs px-4 py-3 w-full">
                                <ZapIcon className="w-4 h-4 text-brand flex-none mt-0.5" />
                                <p className="text-[14px] text-on-background leading-snug">
                                    Runs every morning at 8am. Saved automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
