import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

const BACKEND = import.meta.env.VITE_BACKEND_URL as string;

type InviteData = {
    email: string;
    organization_id: number;
};

export default function InviteAcceptPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { user } = useAuth();

    const [invite, setInvite] = useState<InviteData | null>(null);
    const [status, setStatus] = useState<"loading" | "form" | "submitting" | "invalid">("loading");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // User already has a session (arrived via Supabase invite magic link)
    const hasSession = !!user;

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        fetch(`${BACKEND}/invitations/${token}`)
            .then((r) => {
                if (!r.ok) { setStatus("invalid"); return; }
                return r.json();
            })
            .then((data) => {
                if (!data) return;
                setInvite(data as InviteData);
                setStatus("form");
            })
            .catch(() => setStatus("invalid"));
    }, [token]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!invite || !token) return;
        setError(null);
        setStatus("submitting");

        let accessToken: string | null = null;

        if (hasSession) {
            // User arrived via Supabase invite email — already has a session.
            // Just update their display name.
            if (fullName) {
                await supabase.auth.updateUser({ data: { full_name: fullName } });
            }
            const { data: { session } } = await supabase.auth.getSession();
            accessToken = session?.access_token ?? null;
        } else {
            // No session — user opened the invite link directly. Sign them up.
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: invite.email,
                password,
                options: {
                    data: { role: "member", full_name: fullName },
                    emailRedirectTo: window.location.origin + "/account",
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setStatus("form");
                return;
            }

            if (data.user?.identities?.length === 0) {
                setError("An account with this email already exists. Sign in first, then use the invite link.");
                setStatus("form");
                return;
            }

            if (!data.session) {
                // Email verification required — unlikely for invite flow but possible
                navigate("/invite-pending", { replace: true });
                return;
            }

            accessToken = data.session.access_token;
        }

        if (!accessToken) {
            setError("Could not get session. Please try again.");
            setStatus("form");
            return;
        }

        const res = await fetch(`${BACKEND}/invitations/${token}/accept`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
            const result = await res.json().catch(() => ({}));
            setError(result.detail ?? result.error ?? "Failed to accept invitation.");
            setStatus("form");
            return;
        }

        navigate("/account", { replace: true });
    }

    if (status === "loading") {
        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <Nav />
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <Nav />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <p className="text-sm font-medium text-on-background mb-1">Invalid or expired invitation</p>
                        <p className="text-xs text-on-background-secondary">
                            This invite link may have already been used or has expired. Ask your team admin to send a new one.
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
                        You've been invited
                    </h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        Set up your account to join the team.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-xs border border-divider bg-background-warm px-3 py-1.5">
                        <span className="text-xs text-on-background-secondary">Joining as</span>
                        <span className="text-xs font-medium text-on-background">{invite?.email}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
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

                        {!hasSession && (
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-sm text-on-background">
                                    Create a password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    minLength={8}
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 w-full rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                                />
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xs px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="mt-1 h-11 w-full rounded-xs border border-on-background bg-on-background text-on-brand text-sm font-medium hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {status === "submitting" ? "Setting up…" : "Join team"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-on-background-secondary leading-relaxed">
                        By joining, you agree to our{" "}
                        <a href="/eula" className="underline underline-offset-2">Terms of Service</a>
                        {" "}and{" "}
                        <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
