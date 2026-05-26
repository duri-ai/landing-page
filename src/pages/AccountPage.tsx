import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    subscription_status: string | null;
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

    const [checkoutLoading, setCheckoutLoading] = useState<"subscription" | "refill" | null>(null);

    // Role from org fetch (fallback to user metadata while loading)
    const metaRole = user?.user_metadata?.role as string | undefined;
    const role = org?.current_user_role ?? (metaRole === "free" ? "free" : metaRole === "admin" ? "admin" : metaRole) ?? "admin";
    const plan = metaRole === "free" ? "free" : "team";
    const isAdmin = role === "admin";
    const isSubscribed =
        org?.subscription_status === "active" || org?.subscription_status === "trialing";

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
                    const newBalance = (payload.new as { balance: number }).balance;
                    setOrg((prev) => prev ? { ...prev, balance_usd: newBalance } : prev);
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

    async function handleCheckout(type: "subscription" | "refill") {
        if (!org) return;
        setCheckoutLoading(type);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/checkout?organization_id=${org.id}${type === "refill" ? "&type=refill" : ""}`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            },
        );

        const data = await res.json().catch(() => null);
        setCheckoutLoading(null);
        if (data?.url) {
            window.location.href = data.url;
            return;
        }
        const location = res.headers.get("location");
        if (location) window.location.href = location;
    }

    const planLabel: Record<string, string> = {
        free: "Free",
        team: isAdmin ? "Team (Admin)" : "Team (Member)",
    };

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

                        {/* Workspace section */}
                        <Section title="Workspace">
                            {orgLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                                </div>
                            ) : org ? (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <p className="text-sm font-medium text-on-background">{org.name}</p>
                                        <p className="text-xs text-on-background-secondary mt-0.5">
                                            ${org.balance_usd.toFixed(2)} balance remaining
                                        </p>
                                    </div>

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
                                    Could not load workspace.{" "}
                                    <a href="/pricing" className="text-brand hover:underline">Contact support</a>.
                                </p>
                            )}
                        </Section>

                        {/* Subscription section */}
                        <Section title="Subscription">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-on-background">
                                                {planLabel[plan] ?? "Free"} plan
                                            </p>
                                            {plan === "team" && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-xs border font-medium ${
                                                    isSubscribed
                                                        ? "text-brand border-brand/30 bg-brand-soft"
                                                        : "text-on-background-secondary border-divider"
                                                }`}>
                                                    {isSubscribed ? "Active" : "Inactive"}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-on-background-secondary mt-0.5">
                                            {plan === "free" && "Upgrade to unlock more capacity."}
                                            {plan === "team" && org && `${org.seat_count} seat${org.seat_count !== 1 ? "s" : ""} · $${org.balance_usd.toFixed(2)} remaining`}
                                        </p>
                                    </div>
                                    {plan === "free" && (
                                        <Link to="/pricing" className="text-xs text-brand hover:underline">
                                            Upgrade
                                        </Link>
                                    )}
                                </div>

                                {/* Billing actions — team admin only */}
                                {plan === "team" && isAdmin && (
                                    <div className="flex flex-wrap gap-2">
                                        {!isSubscribed && (
                                            <button
                                                type="button"
                                                disabled={checkoutLoading !== null}
                                                onClick={() => handleCheckout("subscription")}
                                                className="h-8 px-4 rounded-xs border border-brand bg-brand text-on-brand text-xs font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {checkoutLoading === "subscription" ? "Redirecting…" : "Subscribe — $24.99/mo"}
                                            </button>
                                        )}
                                        {isSubscribed && (
                                            <button
                                                type="button"
                                                disabled={checkoutLoading !== null}
                                                onClick={() => handleCheckout("refill")}
                                                className="h-8 px-4 rounded-xs border border-divider-strong bg-background text-on-background text-xs font-medium hover:border-brand hover:text-brand transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {checkoutLoading === "refill" ? "Redirecting…" : "Get refill — $9.99"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
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
