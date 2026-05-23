import { useEffect, useState } from "react";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);

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

                <div className="inline-flex items-center gap-3">
                    <button
                        type="submit"
                        className="text-brand bg-background hover:text-on-brand hover:bg-brand border border-brand rounded-xs text-sm leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer"
                    >
                        Log in
                    </button>

                    <button
                        type="submit"
                        className="text-on-brand bg-brand hover:bg-background hover:text-brand border border-brand hover:border-brand-variant rounded-xs text-sm leading-5 px-4 py-2 transition-colors duration-200 cursor-pointer"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </nav>
    );
}
