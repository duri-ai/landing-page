import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                triggerRef.current?.focus();
            }
        };
        const onResize = () => {
            if (window.innerWidth >= 640) setMenuOpen(false);
        };
        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node;
            if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
            setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [menuOpen]);

    const mobileItems = [
        { to: "/pricing", label: "Pricing" },
        { to: "/privacy", label: "Privacy" },
        ...(!loading
            ? [user
                ? { to: "/account", label: "My account" }
                : { to: "/login", label: "Sign in to account" }]
            : []),
    ];

    return (
        <nav
            className={`sticky top-0 z-30 w-full bg-background min-w-xs transition-[border-color] duration-300 ${scrolled || menuOpen ? "border-b border-divider" : "border-b border-transparent"
                }`}
        >
            <div className="mx-auto grid max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 px-4 py-3 md:px-8 md:py-4">
                <Link to="/" aria-label="Duri home" className="inline-flex items-center gap-2">
                    <img
                        src={`${import.meta.env.BASE_URL}logos/d.svg`}
                        alt=""
                        aria-hidden
                        className="h-7 w-7 rounded-[5px]"
                    />
                    <span className="text-[1.25rem] font-bold tracking-[-0.03em] text-on-background leading-none">
                        Duri
                    </span>
                </Link>

                <div className="inline-flex items-center justify-start gap-1 sm:gap-2">
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
                </div>

                <div className="inline-flex items-center justify-end gap-1 sm:gap-2">
                    {!loading && (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate(user ? "/account" : "/login")}
                                className="hidden sm:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200 cursor-pointer"
                            >
                                {user ? "My account" : "Sign in"}
                            </button>
                            <a
                                href="https://app.duri-ai.com"
                                className="hidden sm:inline-flex items-center text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-sm leading-5 px-3 sm:px-4 py-2 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                            >
                                Start now
                            </a>
                        </>
                    )}

                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="duri-mobile-menu"
                        className="sm:hidden inline-flex items-center justify-center h-9 w-9 -mr-1.5 rounded-xs text-on-background hover:text-brand transition-colors duration-200 cursor-pointer"
                    >
                        <span className="relative block h-6 w-6" aria-hidden>
                            <span
                                className={`absolute left-0 right-0 top-1/2 h-px bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen
                                    ? "-translate-y-1/2 rotate-45"
                                    : "-translate-y-[7px]"
                                    }`}
                            />
                            <span
                                className={`absolute left-0 right-0 top-1/2 h-px bg-current rounded-full -translate-y-1/2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen
                                    ? "opacity-0 scale-x-0"
                                    : "opacity-100 scale-x-100"
                                    }`}
                            />
                            <span
                                className={`absolute left-0 right-0 top-1/2 h-px bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen
                                    ? "-translate-y-1/2 -rotate-45"
                                    : "translate-y-[6px]"
                                    }`}
                            />
                        </span>
                    </button>
                </div>
            </div>

            <div
                id="duri-mobile-menu"
                ref={panelRef}
                aria-hidden={!menuOpen}
                className={`sm:hidden absolute top-full left-0 right-0 bg-background overflow-hidden transition-[max-height,opacity,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen
                    ? "max-h-[280px] opacity-100 border-b border-divider"
                    : "max-h-0 opacity-0 border-b border-transparent pointer-events-none"
                    }`}
            >
                <div className="mx-auto max-w-[1320px]">
                    {mobileItems.map((item, i) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            tabIndex={menuOpen ? 0 : -1}
                            style={{
                                transitionDelay: menuOpen ? `${60 + i * 50}ms` : "0ms",
                            }}
                            className={`group flex items-center justify-between px-4 md:px-8 py-3.5 text-on-background text-[0.95rem] leading-5 font-medium transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                                } ${i > 0 ? "border-t border-divider" : ""}`}
                        >
                            <span className="transition-colors duration-200 group-hover:text-brand">
                                {item.label}
                            </span>
                            <span
                                aria-hidden
                                className="text-on-background-secondary-variant transition-[color,transform] duration-200 group-hover:text-brand group-hover:translate-x-0.5"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M3 7h8m0 0L7.5 3.5M11 7L7.5 10.5"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
