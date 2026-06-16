import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-brand-dark">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/" aria-label="Duri home" className="inline-flex items-center gap-2">
                        <img
                            src={`${import.meta.env.BASE_URL}logos/duri_white.svg`}
                            alt="Duri"
                            className="h-3.5 w-auto opacity-90"
                        />
                    </Link>
                    <span className="text-xs text-white/35">
                        © {new Date().getFullYear()}
                    </span>
                </div>
                <nav className="flex items-center gap-5 text-xs">
                    <Link to="/pricing" className="text-white/55 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <Link to="/privacy" className="text-white/55 hover:text-white transition-colors">
                        Privacy
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
