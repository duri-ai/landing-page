import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-brand-dark">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-10 md:py-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/" aria-label="Duri home" className="inline-flex items-center">
                        <img
                            src={`${import.meta.env.BASE_URL}logos/duri_white.svg`}
                            alt="Duri"
                            className="h-4 w-auto opacity-90"
                        />
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/pricing" className="text-white/60 hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link to="/eula" className="text-white/60 hover:text-white transition-colors">
                            Terms
                        </Link>
                    </nav>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} Duri. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
