export default function Footer() {
    return (
        <footer className="w-full bg-[#00522e] min-w-xs">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6">
                <div className="flex items-center justify-between gap-6">
                    <a href="/" aria-label="Duri home" className="inline-flex items-center">
                        <img
                            src={`${import.meta.env.BASE_URL}logos/duri_white.svg`}
                            alt="Duri"
                            className="h-[16px] w-auto opacity-90"
                        />
                    </a>

                    <div className="flex items-center gap-5">
                        <nav className="flex items-center gap-5 text-[12.5px]">
                            <a href="/privacy" className="text-white/40 hover:text-white/70 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/eula" className="text-white/40 hover:text-white/70 transition-colors">
                                EULA
                            </a>
                        </nav>
                        <p className="text-[12px] text-white/25">
                            © {new Date().getFullYear()} Duri
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
