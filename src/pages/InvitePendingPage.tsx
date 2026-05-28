import Nav from "../components/landing/Nav";

export default function InvitePendingPage() {
    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[480px] text-center">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                            <path d="M4 11.5l5 5 9-9" stroke="#00a86b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-on-background">Check your email</h2>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        We sent a confirmation link to your email address. Click it to activate your account and join your team.
                    </p>
                    <a href="/" className="mt-6 inline-block text-sm text-brand hover:underline">
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}
