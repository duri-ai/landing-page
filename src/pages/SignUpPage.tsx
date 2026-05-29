import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

export default function SignUpPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [verifyPending, setVerifyPending] = useState(false);

    async function handleGoogleSignUp() {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/onboarding",
            },
        });
        if (error) setError(error.message);
    }

    async function handleEmailSignUp(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin + "/onboarding",
            },
        });

        if (error) {
            setLoading(false);
            setError(error.message);
            return;
        }

        if (data.user?.identities?.length === 0) {
            setLoading(false);
            setError("An account with this email already exists. Try signing in instead.");
            return;
        }

        if (data.session) {
            navigate("/onboarding");
            return;
        }

        setLoading(false);
        setVerifyPending(true);
    }

    if (verifyPending) {
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
                            We sent a confirmation link to{" "}
                            <span className="text-on-background font-medium">{email}</span>.
                            Click it to activate your account.
                        </p>
                        <a href="/" className="mt-6 inline-block text-sm text-brand hover:underline">
                            Back to home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />

            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[480px]">
                    <h1 className="text-2xl font-semibold text-on-background tracking-tight">
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        Get started with Duri.
                    </p>

                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        className="mt-7 w-full flex items-center justify-center gap-2.5 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium px-4 py-2.5 hover:bg-brand-soft transition-colors duration-200 cursor-pointer"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-divider" />
                        <span className="text-xs text-on-background-secondary">or</span>
                        <div className="flex-1 h-px bg-divider" />
                    </div>

                    <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm text-on-background">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm text-on-background">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                minLength={8}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xs px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 h-11 w-full rounded-xs border border-on-background bg-on-background text-on-brand text-sm font-medium hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-on-background-secondary">
                        Already have an account?{" "}
                        <Link to="/login" className="text-brand hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-6 text-center text-xs text-on-background-secondary leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a href="/eula" className="underline underline-offset-2">Terms of Service</a>
                        {" "}and{" "}
                        <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.39 2.4-3.44 2.4-5.88Z" fill="#4285F4" />
            <path d="M8 16c2.16 0 3.97-.71 5.29-1.94l-2.58-2a5.01 5.01 0 0 1-2.71.75c-2.08 0-3.84-1.4-4.47-3.29H.87v2.07A8 8 0 0 0 8 16Z" fill="#34A853" />
            <path d="M3.53 9.52A4.8 4.8 0 0 1 3.28 8c0-.53.09-1.04.25-1.52V4.41H.87A8 8 0 0 0 0 8c0 1.29.31 2.51.87 3.59l2.66-2.07Z" fill="#FBBC05" />
            <path d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.28-2.28A8 8 0 0 0 8 0 8 8 0 0 0 .87 4.41l2.66 2.07C4.16 4.59 5.92 3.18 8 3.18Z" fill="#EA4335" />
        </svg>
    );
}
