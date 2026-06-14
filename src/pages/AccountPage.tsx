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

type AutoReload = {
    enabled: boolean;
    threshold: number | null;
    amount: number | null;
    monthly_cap: number | null;
    spent_this_mo: number;
};

type OrgData = {
    id: number;
    name: string;
    credit_id: number;
    credit_usd: number;
    pro_plan_active: boolean;
    subscription_cancel_at: string | null;
    has_payment_method: boolean;
    auto_reload: AutoReload;
    current_user_role: "admin" | "member";
    members: OrgMember[];
    seat_count: number;
};

type MemberUsage = {
    user_id: string;
    email?: string | null;
    full_name?: string | null;
    role: "admin" | "member";
    cost_usd: number;
    runs: number;
    last_used_at: string | null;
};

type UsageData = {
    members: MemberUsage[];
    total_cost_usd: number;
    days: number | null;
};

const BACKEND = (import.meta.env.VITE_BACKEND_URL as string).replace(/\/+$/, "");

export default function AccountPage() {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    const [org, setOrg] = useState<OrgData | null>(null);
    const [orgLoading, setOrgLoading] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSent, setInviteSent] = useState(false);

    const [checkoutLoading, setCheckoutLoading] = useState<
        "subscribe" | "recharge" | null
    >(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [arSaving, setArSaving] = useState(false);

    const [showRecharge, setShowRecharge] = useState(false);
    const [showAutoReload, setShowAutoReload] = useState(false);
    const [showUsage, setShowUsage] = useState(false);

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [leaveError, setLeaveError] = useState<string | null>(null);

    const isAdmin = org?.current_user_role === "admin";
    const isMember = org?.current_user_role === "member";

    async function refetchOrg() {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${BACKEND}/organizations/me`, {
            headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (res.ok) {
            const data = (await res.json()) as OrgData;
            setOrg(data);
        }
    }

    // Fetch org data
    useEffect(() => {
        if (!user) return;
        setOrgLoading(true);

        supabase.auth.getSession().then(({ data: { session } }) => {
            fetch(`${BACKEND}/organizations/me`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            })
                .then(async (r) => {
                    if (r.status === 404) {
                        // No org yet — funnel through onboarding instead of crashing
                        navigate("/onboarding");
                        return;
                    }
                    if (!r.ok) {
                        setOrgLoading(false);
                        return;
                    }
                    const data = (await r.json()) as OrgData;
                    setOrg(data);
                    setOrgLoading(false);
                })
                .catch(() => setOrgLoading(false));
        });
    }, [user, navigate]);

    // Supabase Realtime — live credit updates
    useEffect(() => {
        if (!org?.credit_id) return;

        const channel = supabase
            .channel("credit")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "credits",
                    filter: `id=eq.${org.credit_id}`,
                },
                (payload) => {
                    const p = payload.new as { credit: number };
                    setOrg((prev) => (prev ? { ...prev, credit_usd: p.credit } : prev));
                },
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [org?.credit_id]);

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

    async function handleSubscribe() {
        if (!org) return;
        setCheckoutLoading("subscribe");
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/subscribe?organization_id=${org.id}`,
            { method: "POST", headers: { Authorization: `Bearer ${session?.access_token}` } },
        );
        const data = await res.json().catch(() => null);
        setCheckoutLoading(null);
        if (data?.url) window.location.href = data.url;
    }

    async function handleRecharge(amountUsd: number) {
        if (!org) return;
        setCheckoutLoading("recharge");
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/recharge?organization_id=${org.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ amount_usd: amountUsd }),
            },
        );
        const data = await res.json().catch(() => null);
        setCheckoutLoading(null);
        if (data?.url) window.location.href = data.url;
    }

    async function handleSaveAutoReload(patch: {
        enabled: boolean;
        threshold?: number | null;
        amount?: number | null;
        monthly_cap?: number | null;
    }): Promise<boolean> {
        if (!org) return false;
        setArSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/organizations/${org.id}/auto-reload`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify(patch),
            },
        );
        if (res.ok) await refetchOrg();
        setArSaving(false);
        return res.ok;
    }

    async function handleCancelSubscription() {
        if (!org) return;
        setCancelLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/subscription?organization_id=${org.id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${session?.access_token}` } },
        );
        if (res.ok) await refetchOrg();
        setCancelLoading(false);
    }

    async function handleLeaveOrganization() {
        if (!org) return;
        setLeaveLoading(true);
        setLeaveError(null);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/organizations/${org.id}/members/me`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            },
        );

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setLeaveError(body.detail ?? body.error ?? "Failed to leave organization.");
            setLeaveLoading(false);
            return;
        }

        // Refresh the JWT so the cleared user_metadata (organization_id,
        // role) propagates immediately — otherwise OnboardingPage's stale
        // metadata check bounces us back to /account in a loop.
        await supabase.auth.refreshSession();

        navigate("/onboarding");
    }

    return (
        <>
            <Nav />
            <main className="min-h-[calc(100dvh-60px)] bg-background">
                <div className="mx-auto max-w-[640px] px-4 md:px-8 py-14 md:py-20">
                    {/* Profile header */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-on-brand text-lg font-medium select-none">
                            {initial}
                        </div>
                        <div className="min-w-0">
                            {displayName && (
                                <p className="text-lg font-medium text-on-background truncate">{displayName}</p>
                            )}
                            <p className="text-sm text-on-background-secondary truncate">{email}</p>
                        </div>
                    </div>

                    {/* Billing & credit */}
                    <Section title="Billing">
                        {orgLoading ? (
                            <Spinner />
                        ) : org ? (
                            <BillingPanel
                                org={org}
                                isAdmin={isAdmin}
                                checkoutLoading={checkoutLoading}
                                cancelLoading={cancelLoading}
                                onSubscribe={handleSubscribe}
                                onCancel={handleCancelSubscription}
                                onOpenRecharge={() => setShowRecharge(true)}
                                onOpenAutoReload={() => setShowAutoReload(true)}
                            />
                        ) : (
                            <LoadError what="billing" />
                        )}
                    </Section>

                    {/* Organization */}
                    <Section title="Organization">
                        {orgLoading ? (
                            <Spinner />
                        ) : org ? (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="text-xs text-on-background-secondary">Name</p>
                                    <p className="mt-0.5 text-base font-medium text-on-background">{org.name}</p>
                                </div>

                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs text-on-background-secondary">
                                            {org.members.length} {org.members.length === 1 ? "member" : "members"}
                                        </p>
                                        {isAdmin && org.members.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowUsage(true)}
                                                className="text-xs text-brand hover:text-brand-variant transition-colors cursor-pointer"
                                            >
                                                View usage
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
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
                                            <p className="text-sm text-on-background-secondary italic">No members yet.</p>
                                        )}
                                    </div>
                                </div>

                                {isAdmin && (
                                    <form onSubmit={handleInvite} className="flex flex-col gap-2">
                                        <p className="text-xs text-on-background-secondary">Invite a teammate</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                required
                                                placeholder="colleague@company.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                className="h-10 flex-1 rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background placeholder:text-on-background-secondary-variant focus:border-brand transition-colors duration-150"
                                            />
                                            <button
                                                type="submit"
                                                disabled={inviteLoading}
                                                className="h-10 px-4 rounded-xs border border-brand bg-brand text-on-brand text-sm font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                                            >
                                                {inviteLoading ? "Sending…" : "Send invite"}
                                            </button>
                                        </div>
                                        {inviteSent && <p className="text-xs text-brand">Invite sent.</p>}
                                        {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
                                    </form>
                                )}
                            </div>
                        ) : (
                            <LoadError what="organization" />
                        )}
                    </Section>

                    {/* Plain destructive actions — no boxed "danger zone" */}
                    <div className="mt-10 flex flex-col items-start gap-3 border-t border-divider pt-8">
                        {isMember && (
                            <button
                                type="button"
                                onClick={() => { setLeaveError(null); setShowLeaveConfirm(true); }}
                                className="text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                                Leave organization
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </main>

            {showRecharge && org && (
                <RechargeModal
                    loading={checkoutLoading === "recharge"}
                    onClose={() => setShowRecharge(false)}
                    onCharge={handleRecharge}
                />
            )}

            {showAutoReload && org && (
                <AutoReloadModal
                    org={org}
                    saving={arSaving}
                    onClose={() => setShowAutoReload(false)}
                    onSave={async (patch) => {
                        const ok = await handleSaveAutoReload(patch);
                        if (ok) setShowAutoReload(false);
                    }}
                />
            )}

            {showUsage && org && (
                <UsageModal orgId={org.id} onClose={() => setShowUsage(false)} />
            )}

            {showLeaveConfirm && org && (
                <Modal title="Leave organization?" onClose={() => setShowLeaveConfirm(false)}>
                    <p className="text-sm text-on-background-secondary leading-relaxed mb-4">
                        You'll lose access to <strong className="text-on-background">{org.name}</strong> and its credit.
                        You can set up a new organization or accept another invite afterward.
                    </p>
                    {leaveError && (
                        <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xs px-3 py-2">
                            {leaveError}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={leaveLoading}
                            onClick={() => setShowLeaveConfirm(false)}
                            className="flex-1 h-10 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium hover:bg-brand-soft transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={leaveLoading}
                            onClick={handleLeaveOrganization}
                            className="flex-1 h-10 rounded-xs border border-red-600 bg-red-600 text-white text-sm font-medium hover:bg-red-700 hover:border-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {leaveLoading ? "Leaving…" : "Leave"}
                        </button>
                    </div>
                </Modal>
            )}
            <Footer />
        </>
    );
}

const AR_DEFAULTS = { threshold: 5, amount: 20, monthly_cap: 100 };

type CheckoutKind = "subscribe" | "recharge" | null;

function BillingPanel({
    org,
    isAdmin,
    checkoutLoading,
    cancelLoading,
    onSubscribe,
    onCancel,
    onOpenRecharge,
    onOpenAutoReload,
}: {
    org: OrgData;
    isAdmin: boolean;
    checkoutLoading: CheckoutKind;
    cancelLoading: boolean;
    onSubscribe: () => void;
    onCancel: () => void;
    onOpenRecharge: () => void;
    onOpenAutoReload: () => void;
}) {
    const isPro = org.pro_plan_active;
    const isEnding = isPro && !!org.subscription_cancel_at;
    const endsOn = org.subscription_cancel_at
        ? new Date(org.subscription_cancel_at).toLocaleDateString(undefined, {
              month: "short", day: "numeric", year: "numeric",
          })
        : null;

    const ar = org.auto_reload;
    const arStatus = ar.enabled
        ? `On · below ${ar.threshold ?? AR_DEFAULTS.threshold}, add ${ar.amount ?? AR_DEFAULTS.amount}`
        : "Off";

    return (
        <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
                {/* Available credit */}
                <div>
                    <p className="text-xs text-on-background-secondary">Available credit</p>
                    <p className="mt-1 text-3xl font-semibold text-on-background tracking-tight">
                        {org.credit_usd.toFixed(2)}
                    </p>
                </div>

                {/* Current plan */}
                <div>
                    <p className="text-xs text-on-background-secondary">Current plan</p>
                    <div className="mt-1.5">
                        <span
                            className={`inline-block text-xs font-semibold tracking-wider uppercase rounded-xs px-2 py-1 border ${
                                isPro
                                    ? "text-brand bg-brand-soft border-brand/30"
                                    : "text-on-background-secondary bg-background border-divider"
                            }`}
                        >
                            {isPro ? (isEnding ? `Pro · ends ${endsOn}` : "Pro") : "Free"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Free → upgrade pitch */}
            {isAdmin && !isPro && (
                <div className="rounded-md border border-brand/30 bg-brand-soft p-4">
                    <p className="text-sm font-medium text-on-background">Upgrade to Pro</p>
                    <p className="mt-1 text-sm text-on-background-secondary leading-relaxed">
                        Get 15.00 plus a 5.00 bonus credit every month.
                    </p>
                    <button
                        type="button"
                        disabled={checkoutLoading !== null}
                        onClick={onSubscribe}
                        className="mt-4 h-9 px-4 rounded-xs border border-brand bg-brand text-on-brand text-sm font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {checkoutLoading === "subscribe" ? "Redirecting…" : "Upgrade to Pro · $15/mo"}
                    </button>
                </div>
            )}

            {/* Pro → status + cancel */}
            {isAdmin && isPro && (
                <p className="text-sm text-on-background-secondary">
                    {isEnding
                        ? `Your Pro plan ends on ${endsOn}. You'll keep any remaining credit.`
                        : "Your Pro plan renews monthly."}
                    {!isEnding && (
                        <button
                            type="button"
                            disabled={cancelLoading}
                            onClick={onCancel}
                            className="ml-2 text-red-600 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {cancelLoading ? "Cancelling…" : "Cancel"}
                        </button>
                    )}
                </p>
            )}

            {/* Pro-only billing controls (Stripe collects/manages the card) */}
            {isAdmin && isPro && (
                <div className="flex flex-col divide-y divide-divider border-t border-divider">
                    <SettingRow label="Add credit" description="Top up your balance anytime.">
                        <SecondaryButton onClick={onOpenRecharge}>Add credit</SecondaryButton>
                    </SettingRow>
                    <SettingRow label="Auto-reload" description={arStatus}>
                        <SecondaryButton onClick={onOpenAutoReload}>
                            {ar.enabled ? "Edit" : "Set up"}
                        </SecondaryButton>
                    </SettingRow>
                </div>
            )}
        </div>
    );
}

function RechargeModal({
    loading,
    onClose,
    onCharge,
}: {
    loading: boolean;
    onClose: () => void;
    onCharge: (amountUsd: number) => void;
}) {
    const [amount, setAmount] = useState("20");
    const num = Number(amount);
    const valid = Number.isFinite(num) && num >= 5 && num <= 500;

    return (
        <Modal title="Add credit" onClose={onClose}>
            <p className="text-sm text-on-background-secondary mb-4">
                Choose how much credit to add. Minimum 5, maximum 500.
            </p>
            <div className="flex items-center gap-2 rounded-xs border border-divider-strong focus-within:border-brand transition-colors px-3 h-11">
                <input
                    type="number"
                    min={5}
                    max={500}
                    step={1}
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-on-background focus:outline-none"
                />
                <span className="text-on-background-secondary text-sm">credits</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {[10, 20, 50, 100].map((v) => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(String(v))}
                        className={`h-8 px-3 rounded-xs border text-xs font-medium transition-colors cursor-pointer ${
                            num === v
                                ? "border-brand bg-brand-soft text-brand"
                                : "border-divider-strong bg-background text-on-background-secondary hover:text-on-background"
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-10 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium hover:bg-brand-soft transition-colors duration-200 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={!valid || loading}
                    onClick={() => onCharge(num)}
                    className="flex-1 h-10 rounded-xs border border-brand bg-brand text-on-brand text-sm font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Redirecting…" : valid ? `Add ${num.toFixed(0)} credits` : "Add credit"}
                </button>
            </div>
        </Modal>
    );
}

function AutoReloadModal({
    org,
    saving,
    onClose,
    onSave,
}: {
    org: OrgData;
    saving: boolean;
    onClose: () => void;
    onSave: (patch: {
        enabled: boolean;
        threshold?: number | null;
        amount?: number | null;
        monthly_cap?: number | null;
    }) => void;
}) {
    const ar = org.auto_reload;
    const [enabled, setEnabled] = useState(ar.enabled);
    const [threshold, setThreshold] = useState(String(ar.threshold ?? AR_DEFAULTS.threshold));
    const [amount, setAmount] = useState(String(ar.amount ?? AR_DEFAULTS.amount));
    const [cap, setCap] = useState(String(ar.monthly_cap ?? AR_DEFAULTS.monthly_cap));

    return (
        <Modal title="Auto-reload" onClose={onClose}>
            <p className="text-sm text-on-background-secondary mb-5">
                Automatically top up when your credit runs low, so work never stops mid-task.
            </p>

            <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-on-background">Enable auto-reload</span>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="h-4 w-4 accent-brand cursor-pointer"
                />
            </label>

            <div className={`mt-5 flex flex-col gap-4 ${enabled ? "" : "opacity-50 pointer-events-none"}`}>
                <ModalField
                    label="When credit drops below"
                    value={threshold}
                    onChange={setThreshold}
                />
                <ModalField
                    label="Add this much credit"
                    value={amount}
                    onChange={setAmount}
                />
                <ModalField
                    label="Don't spend more than (per month)"
                    value={cap}
                    onChange={setCap}
                />
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-10 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium hover:bg-brand-soft transition-colors duration-200 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={saving}
                    onClick={() => onSave({
                        enabled,
                        threshold: enabled ? Number(threshold) : null,
                        amount: enabled ? Number(amount) : null,
                        monthly_cap: enabled ? Number(cap) : null,
                    })}
                    className="flex-1 h-10 rounded-xs border border-brand bg-brand text-on-brand text-sm font-medium hover:bg-brand-variant hover:border-brand-variant transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
        </Modal>
    );
}

function ModalField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-on-background-secondary">{label}</span>
            <div className="flex items-center gap-1 rounded-xs border border-divider-strong focus-within:border-brand transition-colors px-2.5 h-9 w-28">
                <input
                    type="number"
                    min={1}
                    step={1}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-sm text-on-background focus:outline-none"
                />
            </div>
        </label>
    );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className={`w-full ${wide ? "max-w-[520px]" : "max-w-[420px]"} max-h-[85vh] overflow-y-auto rounded-md border border-divider bg-background p-6 shadow-lg`}
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-base font-semibold text-on-background mb-4">{title}</p>
                {children}
            </div>
        </div>
    );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
                <p className="text-sm text-on-background">{label}</p>
                {description && <p className="text-xs text-on-background-secondary mt-0.5 truncate">{description}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function SecondaryButton({
    onClick,
    disabled,
    children,
}: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="h-9 px-4 rounded-xs border border-divider-strong bg-background text-on-background text-sm font-medium hover:bg-brand-soft hover:border-brand transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
            {children}
        </button>
    );
}

function UsageModal({ orgId, onClose }: { orgId: number; onClose: () => void }) {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${BACKEND}/organizations/${orgId}/usage`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (!active) return;
            if (!res.ok) {
                setError("Couldn't load usage.");
            } else {
                setData(await res.json());
            }
            setLoading(false);
        })();
        return () => { active = false; };
    }, [orgId]);

    const max = data && data.members.length
        ? Math.max(...data.members.map((m) => m.cost_usd), 0.0001)
        : 1;

    return (
        <Modal title="Member usage" onClose={onClose} wide>
            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : data && data.members.length > 0 ? (
                <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                        <p className="text-xs text-on-background-secondary">Credit consumed per member</p>
                        <p className="text-sm font-medium text-on-background tabular-nums">
                            {data.total_cost_usd.toFixed(2)} total
                        </p>
                    </div>
                    <div className="flex flex-col divide-y divide-divider">
                        {data.members.map((m) => {
                            const label = m.full_name ?? m.email ?? m.user_id.slice(0, 8);
                            const pct = m.cost_usd > 0 ? Math.max(3, (m.cost_usd / max) * 100) : 0;
                            return (
                                <div key={m.user_id} className="py-2.5">
                                    <div className="mb-1.5 flex items-center justify-between gap-3">
                                        <span className="truncate text-sm text-on-background">
                                            {label}
                                            {m.role === "admin" && (
                                                <span className="ml-2 text-[10px] uppercase tracking-wider text-on-background-secondary">
                                                    admin
                                                </span>
                                            )}
                                        </span>
                                        <span className="shrink-0 text-sm font-medium text-on-background tabular-nums">
                                            {m.cost_usd.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-divider/60">
                                        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="mt-1 text-[11px] text-on-background-secondary">
                                        {m.runs} {m.runs === 1 ? "run" : "runs"}
                                        {m.last_used_at &&
                                            ` · last ${new Date(m.last_used_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-sm italic text-on-background-secondary">No usage yet.</p>
            )}
        </Modal>
    );
}

function MemberRow({ name, email, userId, badge }: { name?: string | null; email?: string; userId: string; badge: string }) {
    const display = name ?? email ?? userId.slice(0, 8);
    const initial = display.charAt(0).toUpperCase();
    return (
        <div className="flex items-center gap-3 py-2">
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
        <section className="border-t border-divider pt-7 mt-8">
            <h2 className="text-sm font-semibold text-on-background mb-5">{title}</h2>
            {children}
        </section>
    );
}

function Spinner() {
    return (
        <div className="flex items-center justify-center py-4">
            <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
    );
}

function LoadError({ what }: { what: string }) {
    return (
        <p className="text-sm text-on-background-secondary">
            Could not load {what}. <a href="/account" className="text-brand hover:underline">Refresh</a>.
        </p>
    );
}
