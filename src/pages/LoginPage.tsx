import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { track } from "../utils/analytics";
import Nav from "../components/landing/Nav";

/** Only allow same-origin path redirects (block protocol-relative // and absolute URLs). */
function safeRedirect(value: string | null): string | null {
    if (!value) return null;
    if (!value.startsWith("/") || value.startsWith("//")) return null;
    return value;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = safeRedirect(searchParams.get("redirect"));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleGoogleSignIn() {
        setError(null);
        track("login_started", { method: "google" });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo:
                    window.location.origin + (redirectTo ?? "/onboarding"),
            },
        });
        if (error) setError(error.message);
    }

    async function handleEmailSignIn(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        track("login_started", { method: "email" });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            track("login_completed", { method: "email" });
            navigate(redirectTo ?? "/");
        }
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="w-full max-w-[420px]">
                    <h1 className="text-2xl font-semibold text-on-background tracking-tight text-center">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary text-center">
                        Welcome back. Sign in to your account.
                    </p>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="mt-6 w-full flex items-center justify-center gap-2.5 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium h-10 px-4 hover:bg-brand-soft transition-colors duration-200 cursor-pointer"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-divider" />
                        <span className="text-xs text-on-background-secondary">or</span>
                        <div className="flex-1 h-px bg-divider" />
                    </div>

                    <form onSubmit={handleEmailSignIn} className="flex flex-col gap-6">
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
                                className="h-10 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm text-on-background">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-on-background-secondary hover:text-on-background transition-colors duration-150"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
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
                            className="h-10 w-full rounded-xs border border-on-background bg-on-background text-on-brand text-sm font-medium hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-on-background-secondary">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-brand hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-on-background-secondary leading-relaxed sm:whitespace-nowrap">
                    By signing in, you agree to our{" "}
                    <a href="/eula" className="underline underline-offset-2">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                </p>
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
