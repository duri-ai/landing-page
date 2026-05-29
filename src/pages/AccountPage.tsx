import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

type OrgMember = {
    user_id: string;
    email?: string;
    full_name?: string | null;
    role: "admin" | "member";
};

type OrgData = {
    id: number;
    name: string;
    balance_usd: number;
    monthly_balance: number;
    paid_balance: number;
    auto_recharge_active: boolean;
    current_user_role: "admin" | "member";
    members: OrgMember[];
    seat_count: number;
    token_balance_id: number;
};

const BACKEND = import.meta.env.VITE_BACKEND_URL as string;

export default function AccountPage() {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    const [org, setOrg] = useState<OrgData | null>(null);
    const [orgLoading, setOrgLoading] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSent, setInviteSent] = useState(false);

    const [checkoutLoading, setCheckoutLoading] = useState<"recharge" | "auto_recharge" | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const isAdmin = org?.current_user_role === "admin";

    // Fetch org data
    useEffect(() => {
        if (!user) return;
        setOrgLoading(true);

        supabase.auth.getSession().then(({ data: { session } }) => {
            fetch(`${BACKEND}/organizations/me`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            })
                .then((r) => r.json())
                .then((data: OrgData) => {
                    setOrg(data);
                    setOrgLoading(false);
                })
                .catch(() => setOrgLoading(false));
        });
    }, [user]);

    // Supabase Realtime — live balance updates
    useEffect(() => {
        if (!org?.token_balance_id) return;

        const channel = supabase
            .channel("balance")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "token_balances",
                    filter: `id=eq.${org.token_balance_id}`,
                },
                (payload) => {
                    const p = payload.new as { monthly_balance: number; paid_balance: number };
                    setOrg((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  monthly_balance: p.monthly_balance,
                                  paid_balance: p.paid_balance,
                                  balance_usd: p.monthly_balance + p.paid_balance,
                              }
                            : prev,
                    );
                },
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [org?.token_balance_id]);

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <div className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    const displayName = user.user_metadata?.full_name as string | undefined;
    const email = user.email ?? "";
    const initial = (displayName ?? email).charAt(0).toUpperCase();

    async function handleSignOut() {
        await signOut();
        navigate("/");
    }

    async function handleInvite(e: FormEvent) {
        e.preventDefault();
        if (!org) return;
        setInviteError(null);
        setInviteSent(false);
        setInviteLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${BACKEND}/organizations/${org.id}/invitations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ email: inviteEmail }),
        });

        if (!res.ok) {
            const result = await res.json().catch(() => ({}));
            setInviteError(result.detail ?? result.error ?? "Failed to send invite.");
        } else {
            setInviteSent(true);
            setInviteEmail("");
        }
        setInviteLoading(false);
    }

    async function handleCheckout(type: "recharge" | "auto_recharge") {
        if (!org) return;
        setCheckoutLoading(type);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/checkout?organization_id=${org.id}&type=${type}`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            },
        );

        const data = await res.json().catch(() => null);
        setCheckoutLoading(null);
        if (data?.url) {
            window.location.href = data.url;
        }
    }

    async function handleCancelAutoRecharge() {
        if (!org) return;
        setCancelLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/auto-recharge?organization_id=${org.id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            },
        );

        if (res.ok) {
            setOrg((prev) => prev ? { ...prev, auto_recharge_active: false } : prev);
        }
        setCancelLoading(false);
    }

    return (
        <>
            <Nav />
            <main className="min-h-[calc(100dvh-60px)] bg-background">
                <div className="mx-auto max-w-[720px] px-4 md:px-8 py-14 md:py-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-on-brand text-xl font-medium select-none">
                            {initial}
                        </div>
                        <div>
                            {displayName && (
                                <p className="text-lg font-medium text-on-background">{displayName}</p>
                            )}
                            <p className="text-sm text-on-background-secondary">{email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">

                        {/* Pay as you go section */}
                        <Section title="Pay as you go">
                            {orgLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                                </div>
                            ) : org ? (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <p className="text-2xl font-semibold text-on-background">
                                            ${org.balance_usd.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-on-background-secondary mt-1">
                                            ${org.monthly_balance.toFixed(2)} monthly credit
                                            {" · "}
                                            ${org.paid_balance.toFixed(2)} paid credit
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={checkoutLoading !== null}
                                                onClick={() => handleCheckout("recharge")}
                                                className="h-8 px-4 rounded-xs border border-brand bg-brand text-on-brand text-xs font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {checkoutLoading === "recharge" ? "Redirecting…" : "Recharge tokens"}
                                            </button>

                                            {!org.auto_recharge_active ? (
                                                <button
                                                    type="button"
                                                    disabled={checkoutLoading !== null}
                                                    onClick={() => handleCheckout("auto_recharge")}
                                                    className="h-8 px-4 rounded-xs border border-divider-strong bg-background text-on-background text-xs font-medium hover:border-brand hover:text-brand transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {checkoutLoading === "auto_recharge" ? "Redirecting…" : "Set up auto-recharge"}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={cancelLoading}
                                                    onClick={handleCancelAutoRecharge}
                                                    className="h-8 px-4 rounded-xs border border-divider-strong bg-background text-on-background-secondary text-xs font-medium hover:border-red-400 hover:text-red-600 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {cancelLoading ? "Cancelling…" : "Cancel auto-recharge"}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {org.auto_recharge_active && (
                                        <p className="text-xs text-brand">
                                            Auto-recharge is active — your balance will top up automatically each month.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-on-background-secondary">
                                    Could not load balance. <a href="/account" className="text-brand hover:underline">Refresh</a>.
                                </p>
                            )}
                        </Section>

                        {/* Organization section */}
                        <Section title="Organization">
                            {orgLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                                </div>
                            ) : org ? (
                                <div className="flex flex-col gap-5">
                                    <p className="text-sm font-medium text-on-background">{org.name}</p>

                                    <div>
                                        <p className="text-xs font-medium text-on-background-secondary uppercase tracking-wider mb-3">
                                            Members
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {org.members.map((m) => (
                                                <MemberRow
                                                    key={m.user_id}
                                                    userId={m.user_id}
                                                    name={m.full_name}
                                                    email={m.email}
                                                    badge={m.role === "admin" ? "Admin" : "Member"}
                                                />
                                            ))}
                                            {org.members.length === 0 && (
                                                <p className="text-xs text-on-background-secondary italic">
                                                    No members yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div>
                                            <p className="text-xs font-medium text-on-background-secondary uppercase tracking-wider mb-3">
                                                Invite member
                                            </p>
                                            <form onSubmit={handleInvite} className="flex gap-2">
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="colleague@company.com"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="h-9 flex-1 rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={inviteLoading}
                                                    className="h-9 px-4 rounded-xs border border-brand bg-brand text-on-brand text-sm font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                                                >
                                                    {inviteLoading ? "Sending…" : "Send invite"}
                                                </button>
                                            </form>
                                            {inviteSent && (
                                                <p className="mt-2 text-xs text-brand">Invite sent successfully.</p>
                                            )}
                                            {inviteError && (
                                                <p className="mt-2 text-xs text-red-600">{inviteError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-on-background-secondary">
                                    Could not load organization. <a href="/account" className="text-brand hover:underline">Refresh</a>.
                                </p>
                            )}
                        </Section>

                        <Section title="Account">
                            <div className="flex flex-col gap-3">
                                <Row label="Email" value={email} />
                                {displayName && <Row label="Name" value={displayName} />}
                            </div>
                        </Section>

                        <Section title="Danger zone">
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                                Sign out
                            </button>
                        </Section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function MemberRow({ name, email, userId, badge }: { name?: string | null; email?: string; userId: string; badge: string }) {
    const display = name ?? email ?? userId.slice(0, 8);
    const initial = display.charAt(0).toUpperCase();
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand text-xs font-medium select-none">
                {initial}
            </div>
            <div className="flex-1 min-w-0">
                {name && <p className="text-sm text-on-background truncate">{name}</p>}
                <p className="text-xs text-on-background-secondary truncate">{email ?? userId}</p>
            </div>
            <span className="text-xs text-on-background-secondary border border-divider rounded-xs px-2 py-0.5 shrink-0">
                {badge}
            </span>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xs border border-divider bg-background">
            <div className="border-b border-divider px-5 py-3">
                <p className="text-xs font-medium text-on-background-secondary uppercase tracking-wider">
                    {title}
                </p>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-on-background-secondary">{label}</span>
            <span className="text-sm text-on-background">{value}</span>
        </div>
    );
}
