import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const existingFullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
    const hasFullName = existingFullName.length > 0;

    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate("/login");
            return;
        }
        // If user already completed onboarding (e.g. returning Google OAuth user),
        // skip straight to the account page.
        if (user.user_metadata?.organization_id) {
            navigate("/account");
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <div className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!user) return;
        setError(null);
        setSubmitting(true);

        try {
            // SECURITY DEFINER RPC — creates token_balance + org + member atomically
            const { data: result, error: rpcError } = await supabase
                .rpc("create_organization", { org_name: companyName });
            if (rpcError || !result) throw rpcError ?? new Error("Failed to create organization");

            const { organization_id, token_balance_id } = result as { organization_id: number; token_balance_id: number };

            // updateUser merges with existing user_metadata, so omitting
            // full_name when it's already set preserves the prior value.
            const metadata: Record<string, unknown> = {
                organization_id,
                token_balance_id,
                role: "admin",
            };
            if (!hasFullName) {
                metadata.full_name = fullName;
            }
            await supabase.auth.updateUser({ data: metadata });

            navigate("/account");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />

            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[480px]">
                    <h1 className="text-2xl font-semibold text-on-background tracking-tight">
                        {hasFullName ? "Create your organization" : "Set up your profile"}
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        {hasFullName
                            ? "Name a new workspace to get started again."
                            : "Just a few details to get your workspace ready."}
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                        {!hasFullName && (
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="fullName" className="text-sm text-on-background">
                                    Full name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="h-11 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="companyName" className="text-sm text-on-background">
                                Company name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                required
                                autoComplete="organization"
                                autoFocus={hasFullName}
                                placeholder="Your company"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
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
                            {submitting ? "Setting up…" : "Get started"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
