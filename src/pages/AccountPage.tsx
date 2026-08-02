import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowRightIcon,
    CheckIcon,
    CopyIcon,
    DownloadIcon,
    ExternalLinkIcon,
    MonitorIcon,
    SmartphoneIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../supabase/client";
import { track } from "../utils/analytics";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

const DESKTOP_URL = "https://duri-ai.com";

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
    plan: "free" | "starter" | "pro";
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

type Invoice = {
    id: string;
    number: string | null;
    status: string;
    amount_paid_usd: number;
    amount_due_usd: number;
    currency: string;
    created_at: string | null;
    period_end: string | null;
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
    description: string | null;
};

const BACKEND = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/+$/, "");

// TEMP GATE — Shopify App-Store review. When true, the Pro upgrade routes
// through Shopify Billing instead of Stripe. Set false to restore the
// normal Stripe subscription flow. Flip back to true to re-enable Shopify.
const SHOPIFY_BILLING_GATE = false;

const AR_DEFAULTS = { threshold: 5, amount: 20, monthly_cap: 100 };

type CheckoutKind = "subscribe" | "recharge" | null;

type SectionId = "billing" | "usage" | "invoices" | "team" | "account";

const SECTIONS: { id: SectionId; label: string; adminOnly?: boolean }[] = [
    { id: "billing", label: "Billing" },
    { id: "usage", label: "Usage", adminOnly: true },
    { id: "invoices", label: "Invoices", adminOnly: true },
    { id: "team", label: "Team" },
    { id: "account", label: "Account" },
];

export default function AccountPage() {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [org, setOrg] = useState<OrgData | null>(null);
    const [orgLoading, setOrgLoading] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSent, setInviteSent] = useState(false);

    const [checkoutLoading, setCheckoutLoading] = useState<CheckoutKind>(null);
    const [portalLoading, setPortalLoading] = useState(false);
    const [arSaving, setArSaving] = useState(false);
    const [arError, setArError] = useState<string | null>(null);

    const [showRecharge, setShowRecharge] = useState(false);
    const [showAutoReload, setShowAutoReload] = useState(false);

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [leaveError, setLeaveError] = useState<string | null>(null);

    const isAdmin = org?.current_user_role === "admin";
    const isMember = org?.current_user_role === "member";

    const visibleSections = SECTIONS.filter((s) => !s.adminOnly || isAdmin);
    const requested = searchParams.get("section") as SectionId | null;
    // Fall back when the section is unknown, or when a member deep-links to
    // an admin-only view (roles can change between visits).
    const activeSection: SectionId =
        requested && visibleSections.some((s) => s.id === requested)
            ? requested
            : "billing";

    function goToSection(id: SectionId) {
        setSearchParams(id === "billing" ? {} : { section: id }, { replace: true });
    }

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

    async function handleSubscribe(plan: "starter" | "pro" = "pro") {
        if (!org) return;
        // TEMP GATE — Shopify App-Store review: route paid plans through
        // Shopify Billing instead of Stripe. Disabled via SHOPIFY_BILLING_GATE;
        // the normal Stripe subscription flow runs below when it's off.
        if (SHOPIFY_BILLING_GATE) {
            window.location.href = `${BACKEND}/shopify-billing/install`;
            return;
        }
        setCheckoutLoading("subscribe");
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/subscribe?organization_id=${org.id}&plan=${plan}`,
            { method: "POST", headers: { Authorization: `Bearer ${session?.access_token}` } },
        );
        const data = await res.json().catch(() => null);
        setCheckoutLoading(null);
        if (data?.url) {
            window.location.href = data.url;
        } else if (data?.changed || data?.subscribed) {
            // No redirect: either an in-place plan change or a subscription
            // started against the card already on file. Reflect the new plan
            // and credit.
            await refetchOrg();
        }
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
        if (res.ok) {
            setArError(null);
            await refetchOrg();
        } else {
            const body = await res.json().catch(() => null);
            const detail = typeof body?.detail === "string" ? body.detail : "";
            setArError(
                detail.includes("/stripe/payment-method")
                    ? "Add a card to turn on auto-reload."
                    : detail || "Couldn't save auto-reload. Try again.",
            );
        }
        setArSaving(false);
        return res.ok;
    }

    async function handleManageSubscription() {
        if (!org) return;
        setPortalLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${BACKEND}/stripe/portal?organization_id=${org.id}`,
            { method: "POST", headers: { Authorization: `Bearer ${session?.access_token}` } },
        );
        const data = await res.json().catch(() => null);
        if (res.ok && data?.url) {
            window.location.href = data.url;
        } else {
            setPortalLoading(false);
        }
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
            const result = await res.json().catch(() => ({}));
            setLeaveError(result.detail ?? "Couldn't leave the organization.");
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
                <div className="mx-auto max-w-[1080px] px-4 md:px-8 py-10 md:py-14">
                    <MobileDesktopNotice />

                    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pb-7">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand text-base font-medium select-none">
                                {initial}
                            </div>
                            <div className="min-w-0">
                                {displayName && (
                                    <p className="truncate text-[17px] font-semibold tracking-[-0.01em] text-on-background">
                                        {displayName}
                                    </p>
                                )}
                                <p className="truncate text-sm text-on-background-secondary">{email}</p>
                            </div>
                        </div>

                        {org && (
                            <div className="flex items-center gap-2.5 text-sm">
                                <span className="max-w-[220px] truncate text-on-background-secondary">
                                    {org.name}
                                </span>
                                <PlanChip org={org} />
                            </div>
                        )}
                    </header>

                    <div className="grid gap-8 border-t border-divider pt-7 lg:grid-cols-[176px_minmax(0,1fr)] lg:gap-12">
                        <nav aria-label="Account sections" className="lg:sticky lg:top-24 lg:self-start">
                            <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
                                {visibleSections.map((s) => {
                                    const active = s.id === activeSection;
                                    return (
                                        <li key={s.id} className="shrink-0 lg:shrink">
                                            <button
                                                type="button"
                                                onClick={() => goToSection(s.id)}
                                                aria-current={active ? "page" : undefined}
                                                className={`w-full whitespace-nowrap rounded-xs px-3 py-2 text-left text-sm transition-colors duration-150 cursor-pointer ${
                                                    active
                                                        ? "bg-brand-soft font-medium text-brand"
                                                        : "text-on-background-secondary hover:bg-background-warm hover:text-on-background"
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="min-w-0">
                            {orgLoading ? (
                                <PanelSkeleton />
                            ) : !org ? (
                                <LoadError what="your account" />
                            ) : activeSection === "billing" ? (
                                <BillingSection
                                    org={org}
                                    isAdmin={isAdmin}
                                    checkoutLoading={checkoutLoading}
                                    portalLoading={portalLoading}
                                    onSubscribe={handleSubscribe}
                                    onManageSubscription={handleManageSubscription}
                                    onOpenRecharge={() => setShowRecharge(true)}
                                    onOpenAutoReload={() => { setArError(null); setShowAutoReload(true); }}
                                    onViewInvoices={() => goToSection("invoices")}
                                />
                            ) : activeSection === "usage" ? (
                                <UsageSection orgId={org.id} />
                            ) : activeSection === "invoices" ? (
                                <InvoicesSection orgId={org.id} />
                            ) : activeSection === "team" ? (
                                <TeamSection
                                    org={org}
                                    isAdmin={isAdmin}
                                    inviteEmail={inviteEmail}
                                    inviteLoading={inviteLoading}
                                    inviteError={inviteError}
                                    inviteSent={inviteSent}
                                    onInviteEmailChange={setInviteEmail}
                                    onInvite={handleInvite}
                                />
                            ) : (
                                <AccountSection
                                    email={email}
                                    displayName={displayName}
                                    orgName={org.name}
                                    role={org.current_user_role}
                                    isMember={isMember}
                                    onSignOut={handleSignOut}
                                    onLeave={() => { setLeaveError(null); setShowLeaveConfirm(true); }}
                                />
                            )}
                        </div>
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
                    error={arError}
                    onClose={() => setShowAutoReload(false)}
                    onSave={async (patch) => {
                        const ok = await handleSaveAutoReload(patch);
                        if (ok) setShowAutoReload(false);
                    }}
                />
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

/* ── Billing ─────────────────────────────────────────────────────── */

function BillingSection({
    org,
    isAdmin,
    checkoutLoading,
    portalLoading,
    onSubscribe,
    onManageSubscription,
    onOpenRecharge,
    onOpenAutoReload,
    onViewInvoices,
}: {
    org: OrgData;
    isAdmin: boolean;
    checkoutLoading: CheckoutKind;
    portalLoading: boolean;
    onSubscribe: (plan: "starter" | "pro") => void;
    onManageSubscription: () => void;
    onOpenRecharge: () => void;
    onOpenAutoReload: () => void;
    onViewInvoices: () => void;
}) {
    const isPro = org.pro_plan_active;
    const isEnding = isPro && !!org.subscription_cancel_at;
    const endsOn = org.subscription_cancel_at ? formatDate(org.subscription_cancel_at) : null;
    const ar = org.auto_reload;

    return (
        <div className="flex flex-col gap-7">
            <SectionHeading title="Billing" />

            <div className="rounded-md border border-divider bg-background-warm p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs text-on-background-secondary">Available credit</p>
                        <p className="mt-1 text-[30px] leading-none font-semibold tracking-[-0.02em] text-on-background tabular-nums">
                            {org.credit_usd.toFixed(2)}
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="flex flex-wrap gap-2">
                            <SecondaryButton onClick={onOpenRecharge}>Add credit</SecondaryButton>
                            {isPro && (
                                <SecondaryButton onClick={onViewInvoices}>Invoices</SecondaryButton>
                            )}
                        </div>
                    )}
                </div>
                {isAdmin && isPro && (
                    <p className="mt-4 border-t border-divider pt-3 text-xs text-on-background-secondary">
                        {ar.enabled
                            ? `Auto-reload on. Below ${ar.threshold ?? AR_DEFAULTS.threshold}, add ${ar.amount ?? AR_DEFAULTS.amount}, up to ${ar.monthly_cap ?? AR_DEFAULTS.monthly_cap} a month.`
                            : "Auto-reload is off, so work stops when credit runs out."}
                    </p>
                )}
            </div>

            {isAdmin && org.plan !== "pro" && (
                <div className="rounded-md border border-brand/30 bg-brand-soft p-5">
                    <p className="text-sm font-semibold text-on-background">
                        {org.plan === "starter" ? "Upgrade to Pro" : "Upgrade your plan"}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-on-background-secondary">
                        {org.plan === "starter"
                            ? "Move to Pro for a larger monthly allowance. You're charged only the prorated difference."
                            : "Get a monthly credit allowance for your whole team."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {org.plan === "free" && (
                            <button
                                type="button"
                                disabled={checkoutLoading !== null}
                                onClick={() => onSubscribe("starter")}
                                className="h-9 rounded-xs border border-brand bg-background px-4 text-sm font-medium text-brand transition-colors duration-200 cursor-pointer hover:bg-background-warm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {checkoutLoading === "subscribe" ? "Working…" : "Starter · $20/mo"}
                            </button>
                        )}
                        <button
                            type="button"
                            disabled={checkoutLoading !== null}
                            onClick={() => onSubscribe("pro")}
                            className="h-9 rounded-xs border border-brand bg-brand px-4 text-sm font-medium text-on-brand transition-colors duration-200 cursor-pointer hover:border-brand-variant hover:bg-brand-variant disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {checkoutLoading === "subscribe" ? "Working…" : "Pro · $50/mo"}
                        </button>
                    </div>
                </div>
            )}

            {isAdmin && isPro && (
                <div className="flex flex-col divide-y divide-divider border-t border-divider">
                    <SettingRow
                        label="Subscription"
                        description={isEnding ? `Ends ${endsOn}. You keep remaining credit.` : "Renews monthly"}
                    >
                        <SecondaryButton onClick={onManageSubscription} disabled={portalLoading}>
                            {portalLoading ? "Opening…" : "Manage"}
                        </SecondaryButton>
                    </SettingRow>
                    <SettingRow
                        label="Auto-reload"
                        description={
                            ar.enabled
                                ? `Spent ${ar.spent_this_mo.toFixed(2)} of ${ar.monthly_cap ?? AR_DEFAULTS.monthly_cap} this month`
                                : "Top up automatically when credit runs low"
                        }
                    >
                        <SecondaryButton onClick={onOpenAutoReload}>
                            {ar.enabled ? "Edit" : "Set up"}
                        </SecondaryButton>
                    </SettingRow>
                </div>
            )}

            {!isAdmin && (
                <p className="text-sm text-on-background-secondary">
                    Your organization's admin manages billing.
                </p>
            )}
        </div>
    );
}

/* ── Usage ───────────────────────────────────────────────────────── */

const USAGE_RANGES: { label: string; days: number | null }[] = [
    { label: "7d", days: 7 },
    { label: "14d", days: 14 },
    { label: "30d", days: 30 },
    { label: "60d", days: 60 },
    { label: "90d", days: 90 },
    { label: "All", days: null },
];

function UsageSection({ orgId }: { orgId: number }) {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState<number | null>(30);

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            const url = days == null
                ? `${BACKEND}/organizations/${orgId}/usage`
                : `${BACKEND}/organizations/${orgId}/usage?days=${days}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (!active) return;
            if (!res.ok) {
                setError("Couldn't load usage.");
                setData(null);
            } else {
                setData(await res.json());
            }
            setLoading(false);
        })();
        return () => { active = false; };
    }, [orgId, days]);

    const max = data && data.members.length
        ? Math.max(...data.members.map((m) => m.cost_usd), 0.0001)
        : 1;
    const hasUsage = !!data && data.members.some((m) => m.cost_usd > 0);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeading title="Usage" />
                <div className="inline-flex rounded-xs border border-divider p-0.5">
                    {USAGE_RANGES.map((r) => (
                        <button
                            key={r.label}
                            type="button"
                            onClick={() => setDays(r.days)}
                            aria-pressed={days === r.days}
                            className={`rounded-xs px-2.5 py-1 text-xs transition-colors duration-150 cursor-pointer ${
                                days === r.days
                                    ? "bg-brand-soft font-medium text-brand"
                                    : "text-on-background-secondary hover:text-on-background"
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <PanelSkeleton />
            ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : hasUsage && data ? (
                <>
                    <div className="flex items-baseline justify-between border-b border-divider pb-2.5">
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
                                <div key={m.user_id} className="py-3">
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
                                        {m.last_used_at && ` · last ${formatDate(m.last_used_at)}`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <EmptyState
                    title="No usage in this period"
                    body="Credit consumed by each member appears here once your team starts running tasks."
                />
            )}
        </div>
    );
}

/* ── Invoices ────────────────────────────────────────────────────── */

function InvoicesSection({ orgId }: { orgId: number }) {
    const [invoices, setInvoices] = useState<Invoice[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${BACKEND}/organizations/${orgId}/invoices`, {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (!active) return;
            if (!res.ok) {
                setError("Couldn't load invoices.");
                setInvoices(null);
            } else {
                const body = await res.json();
                setInvoices(body.invoices ?? []);
            }
            setLoading(false);
        })();
        return () => { active = false; };
    }, [orgId]);

    return (
        <div className="flex flex-col gap-5">
            <SectionHeading
                title="Invoices"
                description="Every payment on this organization. Open an invoice to view or print it."
            />

            {loading ? (
                <PanelSkeleton />
            ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : invoices && invoices.length > 0 ? (
                <ul className="flex flex-col divide-y divide-divider border-t border-divider">
                    {invoices.map((inv) => (
                        <li
                            key={inv.id}
                            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-on-background tabular-nums">
                                        {inv.amount_paid_usd > 0
                                            ? inv.amount_paid_usd.toFixed(2)
                                            : inv.amount_due_usd.toFixed(2)}
                                    </span>
                                    <InvoiceStatus status={inv.status} />
                                </div>
                                <p className="mt-0.5 truncate text-xs text-on-background-secondary">
                                    {formatDate(inv.created_at)}
                                    {inv.number && ` · ${inv.number}`}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                {inv.hosted_invoice_url && (
                                    <LinkAction href={inv.hosted_invoice_url} label="View invoice">
                                        <ExternalLinkIcon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                                        View
                                    </LinkAction>
                                )}
                                {inv.invoice_pdf && (
                                    <LinkAction href={inv.invoice_pdf} label="Download invoice PDF">
                                        <DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                                        PDF
                                    </LinkAction>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState
                    title="No invoices yet"
                    body="Once you subscribe or add credit, every payment shows up here with a printable receipt."
                />
            )}
        </div>
    );
}

function InvoiceStatus({ status }: { status: string }) {
    const paid = status === "paid";
    return (
        <span
            className={`rounded-xs px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                paid
                    ? "bg-brand-soft text-brand"
                    : "border border-divider text-on-background-secondary"
            }`}
        >
            {status}
        </span>
    );
}

function LinkAction({
    href,
    label,
    children,
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="inline-flex items-center gap-1.5 rounded-xs border border-divider-strong bg-background px-2.5 py-1.5 text-xs font-medium text-on-background transition-colors duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand"
        >
            {children}
        </a>
    );
}

/* ── Team ────────────────────────────────────────────────────────── */

function TeamSection({
    org,
    isAdmin,
    inviteEmail,
    inviteLoading,
    inviteError,
    inviteSent,
    onInviteEmailChange,
    onInvite,
}: {
    org: OrgData;
    isAdmin: boolean;
    inviteEmail: string;
    inviteLoading: boolean;
    inviteError: string | null;
    inviteSent: boolean;
    onInviteEmailChange: (v: string) => void;
    onInvite: (e: FormEvent) => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <SectionHeading
                title="Team"
                description={`${org.members.length} ${org.members.length === 1 ? "member" : "members"} in ${org.name}.`}
            />

            <div className="flex flex-col divide-y divide-divider border-t border-divider">
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
                    <p className="py-3 text-sm italic text-on-background-secondary">No members yet.</p>
                )}
            </div>

            {isAdmin && (
                <form onSubmit={onInvite} className="flex flex-col gap-2">
                    <label htmlFor="invite-email" className="text-xs text-on-background-secondary">
                        Invite a teammate
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <input
                            id="invite-email"
                            type="email"
                            required
                            placeholder="colleague@company.com"
                            value={inviteEmail}
                            onChange={(e) => onInviteEmailChange(e.target.value)}
                            className="h-10 min-w-0 flex-1 rounded-xs border border-divider-strong bg-background px-3 text-sm text-on-background transition-colors duration-150 placeholder:text-on-background-secondary-variant focus:border-brand"
                        />
                        <button
                            type="submit"
                            disabled={inviteLoading}
                            className="h-10 whitespace-nowrap rounded-xs border border-brand bg-brand px-4 text-sm font-medium text-on-brand transition-colors duration-200 cursor-pointer hover:border-brand-variant hover:bg-brand-variant disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {inviteLoading ? "Sending…" : "Send invite"}
                        </button>
                    </div>
                    {inviteSent && <p className="text-xs text-brand">Invite sent.</p>}
                    {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
                </form>
            )}
        </div>
    );
}

/* ── Account ─────────────────────────────────────────────────────── */

function AccountSection({
    email,
    displayName,
    orgName,
    role,
    isMember,
    onSignOut,
    onLeave,
}: {
    email: string;
    displayName?: string;
    orgName: string;
    role: "admin" | "member";
    isMember: boolean;
    onSignOut: () => void;
    onLeave: () => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <SectionHeading title="Account" />

            <dl className="flex flex-col divide-y divide-divider border-t border-divider">
                <DetailRow label="Name" value={displayName ?? "Not set"} />
                <DetailRow label="Email" value={email} />
                <DetailRow label="Organization" value={orgName} />
                <DetailRow label="Role" value={role === "admin" ? "Admin" : "Member"} />
            </dl>

            <div className="flex flex-col items-start gap-3 border-t border-divider pt-6">
                {isMember && (
                    <button
                        type="button"
                        onClick={onLeave}
                        className="text-sm text-red-600 transition-colors hover:text-red-700 cursor-pointer"
                    >
                        Leave organization
                    </button>
                )}
                <button
                    type="button"
                    onClick={onSignOut}
                    className="text-sm text-red-600 transition-colors hover:text-red-700 cursor-pointer"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-sm text-on-background-secondary">{label}</dt>
            <dd className="min-w-0 truncate text-sm text-on-background">{value}</dd>
        </div>
    );
}

/* ── Shared pieces ───────────────────────────────────────────────── */

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-on-background">{title}</h2>
            {description && (
                <p className="mt-1 text-sm leading-relaxed text-on-background-secondary">{description}</p>
            )}
        </div>
    );
}

function PlanChip({ org }: { org: OrgData }) {
    const label = org.plan === "pro" ? "Pro" : org.plan === "starter" ? "Starter" : "Free";
    const ending = org.pro_plan_active && !!org.subscription_cancel_at;
    return (
        <span
            className={`rounded-xs border px-2 py-1 text-xs font-semibold uppercase tracking-wider ${
                org.pro_plan_active
                    ? "border-brand/30 bg-brand-soft text-brand"
                    : "border-divider bg-background text-on-background-secondary"
            }`}
        >
            {ending ? `${label} · ending` : label}
        </span>
    );
}

function EmptyState({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-md border border-dashed border-divider-strong bg-background-warm px-5 py-8 text-center">
            <p className="text-sm font-medium text-on-background">{title}</p>
            <p className="mx-auto mt-1.5 max-w-[46ch] text-sm leading-relaxed text-on-background-secondary">
                {body}
            </p>
        </div>
    );
}

function PanelSkeleton() {
    return (
        <div className="flex flex-col gap-2.5" aria-hidden>
            <div className="h-20 w-full animate-pulse rounded-md bg-background-warm" />
            <div className="h-10 w-full animate-pulse rounded-xs bg-background-warm" />
            <div className="h-10 w-3/4 animate-pulse rounded-xs bg-background-warm" />
        </div>
    );
}

function formatDate(value: string | null): string {
    if (!value) return "";
    return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function MemberRow({ name, email, userId, badge }: { name?: string | null; email?: string; userId: string; badge: string }) {
    const display = name ?? email ?? userId.slice(0, 8);
    const initial = display.charAt(0).toUpperCase();
    return (
        <div className="flex items-center gap-3 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand text-xs font-medium select-none">
                {initial}
            </div>
            <div className="flex-1 min-w-0">
                {name && <p className="text-sm text-on-background truncate">{name}</p>}
                <p className="text-xs text-on-background-secondary truncate">{email ?? userId}</p>
            </div>
            <span className="shrink-0 rounded-xs border border-divider px-2 py-0.5 text-xs text-on-background-secondary">
                {badge}
            </span>
        </div>
    );
}

function MobileDesktopNotice() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        track("desktop_link_copied", { source: "account_mobile_banner" });
        try {
            await navigator.clipboard.writeText(DESKTOP_URL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard may be unavailable (older browser / insecure context).
            // Silently no-op — the URL is still visible in the chip for manual copy.
        }
    };

    return (
        <div
            role="note"
            className="sm:hidden duri-fade-up mb-7 rounded-[5px] border border-brand/25 bg-brand-soft p-4"
        >
            <div className="flex items-center gap-2 text-brand">
                <SmartphoneIcon className="w-[14px] h-[14px]" strokeWidth={1.8} aria-hidden />
                <ArrowRightIcon className="w-3 h-3 opacity-60" strokeWidth={2} aria-hidden />
                <MonitorIcon className="w-4 h-4" strokeWidth={1.8} aria-hidden />
            </div>
            <p className="mt-2.5 text-[15px] font-semibold tracking-[-0.005em] text-on-background">
                Duri runs on desktop
            </p>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-on-background-secondary">
                Account settings live here, but the app installs on macOS or Windows. Open this page on a desktop to download.
            </p>
            <button
                type="button"
                onClick={handleCopy}
                aria-live="polite"
                className="group mt-3.5 inline-flex items-center gap-2 rounded-[5px] border border-brand/30 bg-background hover:border-brand px-3 h-8 text-[12px] font-medium transition-colors duration-200 cursor-pointer"
            >
                <span className="text-on-background tabular-nums">duri-ai.com</span>
                <span className="text-divider-strong group-hover:text-brand transition-colors duration-200" aria-hidden>
                    ·
                </span>
                <span className="inline-flex items-center gap-1 text-brand">
                    {copied ? (
                        <>
                            <CheckIcon className="w-3 h-3" strokeWidth={2.5} aria-hidden />
                            Copied
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-3 h-3" strokeWidth={2} aria-hidden />
                            Copy link
                        </>
                    )}
                </span>
            </button>
        </div>
    );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
                <p className="text-sm text-on-background">{label}</p>
                {description && <p className="text-xs text-on-background-secondary mt-0.5">{description}</p>}
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
            className="h-9 whitespace-nowrap rounded-xs border border-divider-strong bg-background px-4 text-sm font-medium text-on-background transition-colors duration-200 cursor-pointer hover:border-brand hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
            {children}
        </button>
    );
}

function LoadError({ what }: { what: string }) {
    return (
        <p className="text-sm text-on-background-secondary">
            Could not load {what}. <a href="/account" className="text-brand hover:underline">Refresh</a>.
        </p>
    );
}

/* ── Modals (transient decisions only) ───────────────────────────── */

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className={`relative w-full ${wide ? "max-w-[520px]" : "max-w-[420px]"} max-h-[85vh] overflow-y-auto rounded-md border border-divider bg-background p-6 shadow-lg`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-xs text-on-background-secondary hover:bg-brand-soft hover:text-on-background transition-colors cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <p className="text-base font-semibold text-on-background mb-4 pr-8">{title}</p>
                {children}
            </div>
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
    error,
    onClose,
    onSave,
}: {
    org: OrgData;
    saving: boolean;
    error: string | null;
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
                We use the card already on file.
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

            {error && (
                <p className="mt-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xs px-3 py-2">
                    {error}
                </p>
            )}

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
