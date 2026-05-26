import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

type InviteData = {
    email: string;
    workspace_id: number;
};

export default function InviteAcceptPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [invite, setInvite] = useState<InviteData | null>(null);
    const [status, setStatus] = useState<"loading" | "form" | "submitting" | "invalid">("loading");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }
        supabase
            .rpc("validate_invite_token", { p_token: token })
            .then(({ data }) => {
                if (!data) {
                    setStatus("invalid");
                    return;
                }
                setInvite(data as InviteData);
                setStatus("form");
            });
    }, [token]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!invite || !token) return;
        setError(null);
        setStatus("submitting");

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: invite.email,
            password,
            options: {
                data: {
                    role: "member",
                    workspace_id: invite.workspace_id.toString(),
                    full_name: fullName,
                    invite_token: token,
                },
                emailRedirectTo: window.location.origin + "/account",
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setStatus("form");
            return;
        }

        if (data.user?.identities?.length === 0) {
            setError("An account with this email already exists. Try signing in instead.");
            setStatus("form");
            return;
        }

        // If email confirmation is disabled, session is available immediately
        if (data.session && data.user) {
            const { error: acceptError } = await supabase.rpc("accept_invite_for_member", {
                p_token: token,
                p_user_id: data.user.id,
            });
            if (acceptError) {
                setError(acceptError.message);
                setStatus("form");
                return;
            }
            navigate("/account", { replace: true });
        } else {
            // Email confirmation is on — trigger handles workspace join after confirmation
            navigate("/invite-pending", { replace: true });
        }
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
