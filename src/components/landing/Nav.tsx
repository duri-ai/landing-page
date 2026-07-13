import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, MessagesSquareIcon, MonitorIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { trackOutbound } from "../../utils/analytics";

const base = import.meta.env.BASE_URL;
const APP_URL = "https://app.duri-ai.com";
const MAC_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-mac.dmg";
const WIN_DOWNLOAD = "https://releases.duri-ai.com/desktop/latest/Duri-latest-win.exe";

const DOWNLOADS = [
    {
        os: "mac",
        label: "Download for macOS",
        shortLabel: "macOS",
        href: MAC_DOWNLOAD,
        logo: `${base}misc_images/apple.png`,
    },
    {
        os: "win",
        label: "Download for Windows",
        shortLabel: "Windows",
        href: WIN_DOWNLOAD,
        logo: `${base}misc_images/windows.png`,
    },
] as const;

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [isMac] = useState(() => !/Win/i.test(navigator.userAgent));
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const downloadRef = useRef<HTMLDivElement>(null);
    const orderedDownloads = isMac ? DOWNLOADS : [DOWNLOADS[1], DOWNLOADS[0]];

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
            if (window.innerWidth >= 1280) setMenuOpen(false);
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

    useEffect(() => {
        if (!downloadOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setDownloadOpen(false);
            }
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDownloadOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [downloadOpen]);

    const mobileItems: { to: string; label: string }[] = [
        { to: "/pricing", label: "Pricing" },
        { to: "/privacy", label: "Privacy" },
        ...(!loading
            ? [user
                ? { to: "/account", label: "My account" }
                : { to: "/login", label: "Sign in to account" }]
            : []),
    ];

    const goToDemo = () => {
        trackOutbound("book_demo_click", { source: "nav" });
        setMenuOpen(false);
        if (location.pathname === "/") {
            document.getElementById("talk-to-us")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            navigate("/", { state: { scrollTo: "talk-to-us" } });
        }
    };

    return (
        <nav
            className={`sticky top-0 z-30 w-full bg-background min-w-xs transition-[border-color] duration-300 ${scrolled || menuOpen ? "border-b border-divider" : "border-b border-transparent"
                }`}
        >
            <div className="mx-auto grid max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4 px-4 py-3 md:px-8 md:py-3.5">
                <Link to="/" aria-label="Duri home" className="inline-flex items-center gap-2">
                    <img
                        src={`${import.meta.env.BASE_URL}logos/duri_mascot_tight.png`}
                        alt=""
                        aria-hidden
                        className="h-8 w-8 -my-1"
                    />
                    <span className="text-[1.25rem] font-bold tracking-[-0.03em] text-on-background leading-none">
                        Duri
                    </span>
                </Link>

                <div className="hidden xl:inline-flex items-center justify-start gap-2">
                    <Link
                        to="/pricing"
                        className="inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Pricing
                    </Link>
                    <Link
                        to="/privacy"
                        className="inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Privacy
                    </Link>
                    <button
                        type="button"
                        onClick={goToDemo}
                        className="inline-flex items-center gap-1.5 text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200 cursor-pointer"
                    >
                        <MessagesSquareIcon className="w-4 h-4" aria-hidden />
                        Talk to us
                    </button>
                </div>

                <div className="inline-flex items-center justify-end gap-1.5">
                    {!loading && (
                        <button
                            type="button"
                            onClick={() => navigate(user ? "/account" : "/login")}
                            className="hidden xl:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200 cursor-pointer"
                        >
                            {user ? "My account" : "Sign in"}
                        </button>
                    )}

                    <a
                        href={APP_URL}
                        onClick={() =>
                            trackOutbound("start_now_web", {
                                detected_os: isMac ? "mac" : "win",
                                source: "nav_desktop",
                            })
                        }
                        className="hidden md:inline-flex h-9 items-center justify-center rounded-xs border border-divider-strong bg-background px-3 text-[0.78rem] font-semibold text-on-background whitespace-nowrap transition-colors duration-200 hover:border-on-background"
                    >
                        <span className="lg:hidden">Web app</span>
                        <span className="hidden lg:inline">Get started on Web</span>
                    </a>

                    <div ref={downloadRef} className="relative hidden md:block">
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                setDownloadOpen((open) => !open);
                            }}
                            aria-haspopup="menu"
                            aria-expanded={downloadOpen}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xs border border-brand bg-brand px-3 text-[0.78rem] font-semibold text-on-brand whitespace-nowrap transition-colors duration-200 hover:bg-brand-variant cursor-pointer"
                        >
                            <MonitorIcon className="h-3.5 w-3.5 flex-none" strokeWidth={1.8} aria-hidden />
                            <span className="lg:hidden">Desktop</span>
                            <span className="hidden lg:inline">Download for Desktop</span>
                            <ChevronDown
                                aria-hidden
                                className={`h-3.5 w-3.5 flex-none transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {downloadOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full z-40 mt-2 min-w-[218px] overflow-hidden rounded-xs border border-divider bg-background shadow-[0_18px_44px_-20px_rgba(0,50,32,0.38)]"
                            >
                                {orderedDownloads.map((download) => (
                                    <a
                                        key={download.os}
                                        href={download.href}
                                        role="menuitem"
                                        onClick={() => {
                                            trackOutbound("download_app", {
                                                os: download.os,
                                                detected_os: isMac ? "mac" : "win",
                                                source: "nav_desktop",
                                            });
                                            setDownloadOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-4 py-3 text-[0.82rem] font-medium text-on-background transition-colors duration-200 hover:bg-brand-soft"
                                    >
                                        <img
                                            src={download.logo}
                                            alt=""
                                            aria-hidden
                                            className="h-4 w-4 flex-none object-contain"
                                        />
                                        {download.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => {
                            setDownloadOpen(false);
                            setMenuOpen((open) => !open);
                        }}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="duri-mobile-menu"
                        className="xl:hidden inline-flex items-center justify-center h-9 w-9 -mr-1.5 rounded-xs text-on-background hover:text-brand transition-colors duration-200 cursor-pointer"
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
                className={`xl:hidden absolute top-full left-0 right-0 bg-background overflow-hidden transition-[max-height,opacity,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen
                    ? "max-h-[520px] opacity-100 border-b border-divider"
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
                            <span className="inline-flex items-center gap-2 transition-colors duration-200 group-hover:text-brand">
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
                    <button
                        type="button"
                        onClick={goToDemo}
                        tabIndex={menuOpen ? 0 : -1}
                        style={{
                            transitionDelay: menuOpen ? `${60 + mobileItems.length * 50}ms` : "0ms",
                        }}
                        className={`group flex w-full items-center justify-between px-4 md:px-8 py-3.5 text-brand text-[0.95rem] leading-5 font-semibold border-t border-divider transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                            }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <MessagesSquareIcon className="w-4 h-4" aria-hidden />
                            Talk to us
                        </span>
                        <span
                            aria-hidden
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
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
                    </button>

                    <div
                        style={{
                            transitionDelay: menuOpen ? `${110 + mobileItems.length * 50}ms` : "0ms",
                        }}
                        className={`md:hidden border-t border-divider px-4 py-4 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                            }`}
                    >
                        <a
                            href={APP_URL}
                            tabIndex={menuOpen ? 0 : -1}
                            onClick={() => {
                                trackOutbound("start_now_web", {
                                    detected_os: isMac ? "mac" : "win",
                                    source: "nav_mobile",
                                });
                                setMenuOpen(false);
                            }}
                            className="flex h-10 w-full items-center justify-center rounded-xs border border-divider-strong bg-background text-sm font-semibold text-on-background transition-colors duration-200 hover:border-on-background"
                        >
                            Get started on Web
                        </a>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {orderedDownloads.map((download) => (
                                <a
                                    key={download.os}
                                    href={download.href}
                                    tabIndex={menuOpen ? 0 : -1}
                                    onClick={() => {
                                        trackOutbound("download_app", {
                                            os: download.os,
                                            detected_os: isMac ? "mac" : "win",
                                            source: "nav_mobile",
                                        });
                                        setMenuOpen(false);
                                    }}
                                    className="flex h-10 items-center justify-center gap-2 rounded-xs border border-brand bg-brand px-2 text-[0.78rem] font-semibold text-on-brand transition-colors duration-200 hover:bg-brand-variant"
                                >
                                    <img
                                        src={download.logo}
                                        alt=""
                                        aria-hidden
                                        className="h-3.5 w-3.5 flex-none object-contain"
                                    />
                                    {download.shortLabel}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
