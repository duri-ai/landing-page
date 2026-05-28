import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";

type Plan = {
    id: string;
    name: string;
    price: string;
    period: string;
    tagline: string;
    features: string[];
    cta: string;
    highlighted: boolean;
};

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "forever",
        tagline: "Try it out at your own pace.",
        features: [
            "5 automation runs per month",
            "1 integration",
            "Basic scheduling",
            "Community support",
        ],
        cta: "Get started free",
        highlighted: false,
    },
    {
        id: "team",
        name: "Team",
        price: "$29",
        period: "per user / month",
        tagline: "For teams ready to run their operations on Duri.",
        features: [
            "Unlimited automation runs",
            "All integrations",
            "Full scheduling and reporting",
            "Email support",
            "Shared playbook library",
        ],
        cta: "Get started",
        highlighted: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "contact us",
        tagline: "For larger organizations with custom needs.",
        features: [
            "Everything in Team",
            "Dedicated onboarding",
            "Priority support with SLA",
            "SSO and access controls",
            "Custom integrations",
        ],
        cta: "Contact us",
        highlighted: false,
    },
];

// Maps user role → the pricing card that represents it
const ROLE_TO_PLAN: Record<string, string> = {
    free: "free",
    admin: "team",
};

// Maps pricing card → the role that will be stored
const PLAN_TO_ROLE: Record<string, "free" | "admin"> = {
    free: "free",
    team: "admin",
};

export default function PricingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.user_metadata?.role as string | undefined;
    const currentPlanId = role ? (ROLE_TO_PLAN[role] ?? null) : null;
    const [updating, setUpdating] = useState<string | null>(null);

    async function handlePlanChange(planId: string) {
        const newRole = PLAN_TO_ROLE[planId];
        if (!newRole || !user) return;
        setUpdating(planId);
        await supabase.auth.updateUser({ data: { role: newRole } });
        setUpdating(null);
    }

    const ctaClassName = (highlighted: boolean, isCurrent: boolean) =>
        `mt-9 w-full inline-flex items-center justify-center rounded-xs border text-sm font-medium px-5 py-3 transition-colors duration-200 ${
            isCurrent
                ? "bg-transparent border-divider text-on-background-secondary cursor-default"
                : highlighted
                    ? "bg-on-brand text-brand border-on-brand hover:bg-brand-soft hover:text-on-background cursor-pointer"
                    : "bg-brand text-on-brand border-brand hover:bg-brand-variant hover:border-brand-variant cursor-pointer"
        }`;

    return (
        <>
            <Nav />
            <main className="min-h-[calc(100dvh-60px)] bg-background">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 duri-grid-bg opacity-[0.4] pointer-events-none" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" aria-hidden />

                    <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 pt-14 md:pt-20 pb-6 text-center">
                        <p className="duri-eyebrow mb-4">Pricing</p>
                        <h1 className="duri-monument max-w-2xl mx-auto">
                            Simple pricing,<br />
                            <span className="text-brand">no surprises.</span>
                        </h1>
                        <p className="duri-section-lede mt-5 mx-auto text-center">
                            Start free and scale when you're ready. No lock-in.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1280px] px-4 md:px-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                        {plans.map((plan) => {
                            const isCurrent = currentPlanId === plan.id;
                            // Members are invite-only — pricing cards are view-only for them
                            const isMember = role === "member";

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-xs border p-8 transition-shadow duration-200 ${
                                        plan.highlighted
                                            ? "border-brand bg-brand shadow-[0_4px_32px_0_rgba(0,168,107,0.18)]"
                                            : "border-divider bg-background hover:border-divider-strong"
                                    }`}
                                >
                                    {isCurrent && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="inline-block bg-brand-soft text-brand text-xs font-medium px-3 py-1 rounded-xs border border-brand/20">
                                                Your plan
                                            </span>
                                        </div>
                                    )}
                                    {!isCurrent && plan.highlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="inline-block bg-on-background text-background text-xs font-medium px-3 py-1 rounded-xs">
                                                Most popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <p className={`text-sm font-medium uppercase tracking-widest ${plan.highlighted ? "text-on-brand/70" : "text-on-background-secondary"}`}>
                                            {plan.name}
                                        </p>
                                        <div className="mt-3 flex items-end gap-1.5">
                                            <span className={`text-4xl font-medium tracking-tight ${plan.highlighted ? "text-on-brand" : "text-on-background"}`}>
                                                {plan.price}
                                            </span>
                                            {plan.id !== "enterprise" && (
                                                <span className={`text-sm mb-1 ${plan.highlighted ? "text-on-brand/60" : "text-on-background-secondary"}`}>
                                                    / {plan.period}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`mt-3 text-sm leading-relaxed ${plan.highlighted ? "text-on-brand/80" : "text-on-background-secondary"}`}>
                                            {plan.tagline}
                                        </p>

                                        <ul className="mt-7 space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2.5">
                                                    <CheckIcon
                                                        className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-on-brand" : "text-brand"}`}
                                                    />
                                                    <span className={`text-sm ${plan.highlighted ? "text-on-brand/90" : "text-on-background"}`}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {plan.id === "enterprise" ? (
                                        <a
                                            href={isCurrent || isMember ? undefined : "mailto:info@duri-ai.com?subject=Enterprise%20inquiry"}
                                            className={ctaClassName(plan.highlighted, isCurrent || isMember)}
                                        >
                                            {isCurrent ? "Current plan" : plan.cta}
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={isCurrent || isMember || updating === plan.id}
                                            onClick={() => {
                                                if (isCurrent || isMember) return;
                                                if (user) {
                                                    handlePlanChange(plan.id);
                                                } else {
                                                    navigate(`/signup?plan=${plan.id}`);
                                                }
                                            }}
                                            className={ctaClassName(plan.highlighted, isCurrent || isMember)}
                                        >
                                            {updating === plan.id
                                                ? "Updating..."
                                                : isCurrent
                                                    ? "Current plan"
                                                    : plan.cta}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-10 text-center text-xs text-on-background-secondary">
                        All prices in USD. Enterprise billed annually.{" "}
                        <a href="/privacy" className="underline underline-offset-2 hover:text-on-background transition-colors">
                            Privacy Policy
                        </a>
                        {" "}·{" "}
                        <a href="/eula" className="underline underline-offset-2 hover:text-on-background transition-colors">
                            Terms
                        </a>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
