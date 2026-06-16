import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-30 w-full bg-background min-w-xs transition-[border-color] duration-300 ${
                scrolled ? "border-b border-divider" : "border-b border-transparent"
            }`}
        >
            <div className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
                <Link to="/" aria-label="Duri home" className="inline-flex items-center">
                    <img
                        src={`${import.meta.env.BASE_URL}logos/duri.svg`}
                        className="h-[18px]"
                        alt="Duri"
                    />
                </Link>

                <div className="inline-flex items-center gap-1 sm:gap-2">
                    <a
                        href="https://www.reddit.com/r/Duri/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Duri on Reddit"
                        className="inline-flex items-center gap-1.5 px-2 py-2 text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium opacity-80 hover:opacity-100 transition-all duration-200"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}logos/reddit.svg`}
                            alt=""
                            className="h-[18px] w-[18px]"
                        />
                        <span className="hidden sm:inline">r/Duri</span>
                    </a>

                    <Link
                        to="/pricing"
                        className="hidden sm:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Pricing
                    </Link>
                    <Link
                        to="/privacy"
                        className="hidden sm:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Privacy
                    </Link>

                    {!loading && (
                        user ? (
                            <button
                                type="button"
                                onClick={() => navigate("/account")}
                                className="text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-sm leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer"
                            >
                                Account
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="text-on-brand bg-brand hover:bg-background hover:text-brand border border-brand hover:border-brand-variant rounded-xs text-sm leading-5 px-3 sm:px-4 py-2 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                            >
                                Create account
                            </button>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
