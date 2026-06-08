import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/update-password",
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
    }

    if (sent) {
        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <Nav />
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-[420px] text-center">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                                <path d="M4 11.5l5 5 9-9" stroke="#00a86b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold text-on-background tracking-tight">
                            Check your inbox
                        </h1>
                        <p className="mt-2 text-sm text-on-background-secondary">
                            We sent a reset link to{" "}
                            <span className="text-on-background font-medium">{email}</span>.
                        </p>
                        <Link
                            to="/login"
                            className="mt-6 inline-block text-sm text-brand hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />

            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[420px]">
                    <h1 className="text-2xl font-semibold text-on-background tracking-tight text-center">
                        Reset your password
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary text-center">
                        Enter your email and we'll send you a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
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
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-on-background-secondary">
                        <Link to="/login" className="text-brand hover:underline">
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
