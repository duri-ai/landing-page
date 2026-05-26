import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";

type MemberInfo = {
    id: string;
    email: string;
    full_name: string | null;
};

type WorkspaceData = {
    id: number;
    name: string;
    admin: MemberInfo;
    members: MemberInfo[];
    token_balance: number;
};

export default function AccountPage() {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
    const [workspaceLoading, setWorkspaceLoading] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSent, setInviteSent] = useState(false);

    const role = user?.user_metadata?.role as string | undefined;
    const workspaceId = user?.user_metadata?.workspace_id as string | undefined;
    const freeTokenBalanceId = user?.user_metadata?.token_balance_id as string | undefined;

    const [freeTokenBalance, setFreeTokenBalance] = useState<number | null>(null);

    useEffect(() => {
        if (!workspaceId) return;
        setWorkspaceLoading(true);
        supabase
            .rpc("get_workspace_with_members", { p_workspace_id: parseInt(workspaceId) })
            .then(({ data }) => {
                setWorkspace(data as WorkspaceData);
                setWorkspaceLoading(false);
            });
    }, [workspaceId]);

    useEffect(() => {
        if (role !== "free" || !freeTokenBalanceId) return;
        supabase
            .rpc("get_token_balance", { p_token_balance_id: parseInt(freeTokenBalanceId) })
            .then(({ data }) => {
                if (data !== null) setFreeTokenBalance(data as number);
            });
    }, [role, freeTokenBalanceId]);

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
        setInviteError(null);
        setInviteSent(false);
        setInviteLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-member`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ email: inviteEmail }),
            },
        );

        const result = await res.json();
        if (!res.ok) {
            setInviteError(result.error ?? "Failed to send invite.");
        } else {
            setInviteSent(true);
            setInviteEmail("");
        }
        setInviteLoading(false);
    }

    const roleLabel: Record<string, string> = {
        free: "Free",
        admin: "Team (Admin)",
        member: "Team (Member)",
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

                        {/* Workspace section — admin and member only */}
                        {(role === "admin" || role === "member") && (
                            <Section title="Workspace">
                                {!workspaceId ? (
                                    <p className="text-sm text-on-background-secondary">
                                        Workspace not found.{" "}
                                        <a href="/pricing" className="text-brand hover:underline">Contact support</a>.
                                    </p>
                                ) : workspaceLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                                    </div>
                                ) : workspace ? (
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-on-background">{workspace.name}</p>
                                                <p className="text-xs text-on-background-secondary mt-0.5">
                                                    {workspace.token_balance.toLocaleString()} tokens remaining
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-on-background-secondary uppercase tracking-wider mb-3">
                                                Members
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {/* Admin row */}
                                                <MemberRow
                                                    name={workspace.admin.full_name}
                                                    email={workspace.admin.email}
                                                    badge="Admin"
                                                />
                                                {/* Member rows */}
                                                {workspace.members.map((m) => (
                                                    <MemberRow
                                                        key={m.id}
                                                        name={m.full_name}
                                                        email={m.email}
                                                        badge="Member"
                                                    />
                                                ))}
                                                {workspace.members.length === 0 && (
                                                    <p className="text-xs text-on-background-secondary italic">
                                                        No members yet.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Invite form — admin only */}
                                        {role === "admin" && (
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
                                                    <p className="mt-2 text-xs text-brand">
                                                        Invite sent successfully.
                                                    </p>
                                                )}
                                                {inviteError && (
                                                    <p className="mt-2 text-xs text-red-600">{inviteError}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-on-background-secondary">
                                        Could not load workspace.
                                    </p>
                                )}
                            </Section>
                        )}

                        <Section title="Subscription">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-on-background">
                                        {roleLabel[role ?? "free"] ?? "Free"} plan
                                    </p>
                                    <p className="text-xs text-on-background-secondary mt-0.5">
                                        {role === "free" && (
                                            freeTokenBalance !== null
                                                ? `${freeTokenBalance.toLocaleString()} tokens remaining.`
                                                : "No tokens remaining."
                                        )}
                                        {role === "admin" && "Unlimited runs, all integrations."}
                                        {role === "member" && "Member of a Team workspace."}
                                    </p>
                                </div>
                                {role !== "member" && (
                                    <a href="/pricing" className="text-xs text-brand hover:underline">
                                        {role === "free" ? "Upgrade" : "Manage"}
                                    </a>
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

function MemberRow({ name, email, badge }: { name: string | null; email: string; badge: string }) {
    const initial = (name ?? email).charAt(0).toUpperCase();
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand text-xs font-medium select-none">
                {initial}
            </div>
            <div className="flex-1 min-w-0">
                {name && <p className="text-sm text-on-background truncate">{name}</p>}
                <p className="text-xs text-on-background-secondary truncate">{email}</p>
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
