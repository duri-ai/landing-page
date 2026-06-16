import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full min-w-xs bg-brand-dark">
            <div className="mx-auto max-w-[960px] px-6 md:px-8 py-10 md:py-12">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex flex-col gap-3">
                        <Link to="/" aria-label="Duri home" className="inline-flex items-center">
                            <img
                                src={`${import.meta.env.BASE_URL}logos/duri_white.svg`}
                                alt="Duri"
                                className="h-4 w-auto opacity-90"
                            />
                        </Link>
                        <p className="text-sm text-white/50 max-w-[220px] leading-relaxed">
                            An intelligent agent that learns how you work, then does the work for you.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
                        <nav className="flex flex-col gap-2" aria-label="Product">
                            <a href="/#how" className="text-sm text-white/55 hover:text-white/80 transition-colors">How it works</a>
                            <a href="/#download" className="text-sm text-white/55 hover:text-white/80 transition-colors">Download</a>
                            <a
                                href="https://www.reddit.com/r/Duri/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/55 hover:text-white/80 transition-colors"
                            >
                                Duri on Reddit
                            </a>
                        </nav>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-white/25">
                        © {new Date().getFullYear()} Duri. All rights reserved.
                    </p>
                    <nav className="flex items-center gap-5 text-xs">
                        <Link to="/privacy" className="text-white/35 hover:text-white/60 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/eula" className="text-white/35 hover:text-white/60 transition-colors">
                            EULA
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
