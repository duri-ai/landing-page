import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type NavProps = {
    onDemoClick?: () => void;
};

export default function Nav({ onDemoClick }: NavProps = {}) {
    const [scrolled, setScrolled] = useState(false);
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-30 w-full bg-background min-w-xs transition-[border-color] duration-300 ${scrolled ? "border-b border-divider" : "border-b border-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
                <a href="/" aria-label="Duri home" className="inline-flex items-center">
                    <img
                        src={`${import.meta.env.BASE_URL}logos/duri.svg`}
                        className="h-[18px]"
                        alt="Duri"
                    />
                </a>

                <div className="inline-flex items-center gap-1 sm:gap-2">
                    <button
                        type="button"
                        aria-label="Duri on Discord"
                        className="inline-flex items-center justify-center px-2 py-2 opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}logos/discord.svg`}
                            alt=""
                            className="h-[18px] w-[18px]"
                        />
                    </button>
                    <a
                        href="https://www.reddit.com/r/Duri/?screen_view_count=4"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Duri on Reddit"
                        className="inline-flex items-center justify-center px-2 py-2 opacity-80 hover:opacity-100 transition-opacity duration-200"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}logos/reddit.svg`}
                            alt=""
                            className="h-[18px] w-[18px]"
                        />
                    </a>

                    <a
                        href="/pricing"
                        className="hidden sm:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Pricing
                    </a>
                    <a
                        href="/privacy"
                        className="hidden sm:inline-flex items-center text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200"
                    >
                        Privacy
                    </a>

                    {!loading && (
                        user
                            ? <ProfileButton user={user} onSignOut={async () => { await signOut(); navigate("/"); }} />
                            : <>
                                {onDemoClick && (
                                    <button
                                        type="button"
                                        onClick={onDemoClick}
                                        className="hidden sm:inline-flex text-on-background-secondary hover:text-on-background text-sm leading-5 font-medium px-2 py-2 transition-colors duration-200 cursor-pointer"
                                    >
                                        Contact us
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-sm leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer"
                                >
                                    Sign in
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    className="text-on-brand bg-brand hover:bg-background hover:text-brand border border-brand hover:border-brand-variant rounded-xs text-sm leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer"
                                >
                                    Create account
                                </button>
                            </>
                    )}
                </div>
            </div>
        </nav>
    );
}

type ProfileButtonProps = {
    user: { email?: string; user_metadata?: { full_name?: string } };
    onSignOut: () => void;
};

function ProfileButton({ user, onSignOut }: ProfileButtonProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const displayName = user.user_metadata?.full_name;
    const email = user.email ?? "";
    const initial = (displayName ?? email).charAt(0).toUpperCase();

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label="Account menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-on-brand text-sm font-medium cursor-pointer hover:bg-brand-variant transition-colors duration-200 select-none"
            >
                {initial}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xs border border-divider bg-background shadow-md z-50">
                    <div className="px-3.5 py-3 border-b border-divider">
                        {displayName && (
                            <p className="text-xs font-medium text-on-background truncate">{displayName}</p>
                        )}
                        <p className="text-xs text-on-background-secondary truncate">{email}</p>
                    </div>
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => { setOpen(false); navigate("/account"); }}
                            className="w-full text-left px-3.5 py-2 text-sm text-on-background hover:bg-brand-soft transition-colors duration-150 cursor-pointer"
                        >
                            Account
                        </button>
                        <div className="my-1 border-t border-divider" />
                        <button
                            type="button"
                            onClick={() => { setOpen(false); onSignOut(); }}
                            className="w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
