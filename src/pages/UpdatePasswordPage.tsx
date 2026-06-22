import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../supabase/client";
import Nav from "../components/landing/Nav";

export default function UpdatePasswordPage() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [linkError, setLinkError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (loading) return;

        // Supabase strips the URL hash on successful token detection but
        // leaves an error hash (e.g. expired link) for us to read.
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
            const desc = params.get("error_description");
            if (desc) {
                setLinkError(desc);
                return;
            }
        }

        // Visited /update-password without a recovery session and not signed in.
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setSubmitting(true);
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setSubmitting(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }
        setSuccess(true);
        setTimeout(() => navigate("/account", { replace: true }), 1500);
    }

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <div className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
        );
    }

    if (linkError) {
        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <Nav />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <p className="text-sm font-medium text-on-background mb-1">Reset link expired</p>
                        <p className="text-xs text-on-background-secondary">
                            This reset link is no longer valid. Request a new one from the sign-in page.
                        </p>
                        <a href="/login" className="mt-6 inline-block text-sm text-brand hover:underline">
                            Back to sign in
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
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
                        <h2 className="text-xl font-medium text-on-background">Password updated</h2>
                        <p className="mt-2 text-sm text-on-background-secondary">
                            Taking you to your account…
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[480px]">
                    <h1 className="text-2xl font-semibold text-on-background tracking-tight">
                        Set a new password
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        Choose a new password for your Duri account.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm text-on-background">
                                New password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                autoFocus
                                minLength={8}
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirmPassword" className="text-sm text-on-background">
                                Confirm new password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                minLength={8}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            disabled={submitting}
                            className="mt-1 h-11 w-full rounded-xs border border-on-background bg-on-background text-on-brand text-sm font-medium hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Updating…" : "Update password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
