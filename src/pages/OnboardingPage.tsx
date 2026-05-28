import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const plan = searchParams.get("plan") ?? "free";

    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) navigate("/login");
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
            const role = plan === "team" ? "admin" : "free";

            // Single RPC call — SECURITY DEFINER, creates token_balance + org + member atomically
            const { data: result, error: rpcError } = await supabase
                .rpc("create_organization", { org_name: companyName });
            if (rpcError || !result) throw rpcError ?? new Error("Failed to create organization");

            const { organization_id, token_balance_id } = result as { organization_id: number; token_balance_id: number };

            // Store display name + org context in user metadata
            await supabase.auth.updateUser({
                data: { full_name: fullName, organization_id, token_balance_id, role },
            });

            // Redirect
            if (plan === "team") {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/stripe/checkout?organization_id=${organization_id}`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${session?.access_token}` },
                    },
                );
                const data = await res.json().catch(() => null);
                if (data?.url) {
                    window.location.href = data.url;
                    return;
                }
                // If backend returns a redirect location header
                const location = res.headers.get("location");
                if (location) {
                    window.location.href = location;
                    return;
                }
                throw new Error("Could not start checkout");
            } else {
                navigate("/account");
            }
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
                        Set up your profile
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        Just a few details to get your workspace ready.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="companyName" className="text-sm text-on-background">
                                Company name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                required
                                autoComplete="organization"
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
                            {submitting
                                ? plan === "team" ? "Setting up…" : "Saving…"
                                : plan === "team" ? "Continue to payment" : "Get started"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
