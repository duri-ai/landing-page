// import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import HeroProductWindow from "./HeroProductWindow";

type HeroProps = {
    onDemoClick: () => void;
};

export default function Hero({ onDemoClick }: HeroProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="relative w-full min-w-xs overflow-hidden">
            <div className="absolute inset-0 duri-grid-bg opacity-[0.55] pointer-events-none" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background-warm pointer-events-none" aria-hidden />

            <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 pt-12 md:pt-16 pb-20 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
                    <div className="lg:col-span-7">
                        <h1 className="duri-monument">
                            <span className="block">Automate your business</span>
                            <span className="block">
                                in <span className="text-brand">plain language</span>.
                            </span>
                        </h1>

                        <div className="mt-9 md:mt-12">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onDemoClick}
                                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-base px-6 py-3.5 transition-colors duration-200 cursor-pointer"
                                >
                                    Get a demo
                                    {/* <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" /> */}
                                </button>

                                {!user && (
                                    <button
                                        type="button"
                                        onClick={() => navigate("/signup")}
                                        className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-on-brand bg-brand hover:bg-background hover:text-brand border border-brand hover:border-brand-variant rounded-xs text-base px-6 py-3.5 transition-colors duration-200 cursor-pointer"
                                    >
                                        Get started
                                        {/* <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" /> */}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <HeroProductWindow />
                    </div>
                </div>
            </div>
        </section>
    );
}
