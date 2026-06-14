import { useNavigate } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import { useAuth } from "../contexts/AuthContext";

type Feature = { text: string; subs?: string[] };

type Plan = {
    id: "free" | "pro";
    name: string;
    price: string;
    period: string;
    tagline: string;
    features: Feature[];
    cta: string;
    highlighted: boolean;
};

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "$5",
        period: "in credits",
        tagline: "Spin up your org and see what Duri can automate for you.",
        features: [
            { text: "$5.00 in credits to get you started" },
            { text: "Invite your team" },
            { text: "Credits shared across every member in the organization" },
        ],
        cta: "Get started for free",
        highlighted: false,
    },
    {
        id: "pro",
        name: "Pro",
        price: "$15",
        period: "/ month",
        tagline: "For organizations running real work on Duri.",
        features: [
            {
                text: "20.00 in credits every month",
                subs: [
                    "15.00 plus a 5.00 bonus credit",
                    "1 credit is worth $1",
                    "Recharge anytime, or turn on auto-reload",
                ],
            },
            { text: "Invite your team" },
            { text: "Credits shared across every member in the organization" },
        ],
        cta: "Select",
        highlighted: true,
    },
];

export default function PricingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCta = () => {
        navigate(user ? "/account" : "/signup");
    };

    const ctaClassName = (highlighted: boolean) =>
        `mt-9 w-full inline-flex items-center justify-center rounded-xs border text-sm font-medium px-5 py-3 transition-colors duration-200 cursor-pointer ${
            highlighted
                ? "bg-on-brand text-brand border-on-brand hover:bg-brand-soft hover:text-on-background"
                : "bg-brand text-on-brand border-brand hover:bg-brand-variant hover:border-brand-variant"
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
                            One <span className="text-brand">shared credit</span><br />
                            for your whole team.
                        </h1>
                        <p className="duri-section-lede mt-5 mx-auto text-center">
                            Pay only for what you use.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[820px] px-4 md:px-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-xs border p-8 transition-shadow duration-200 ${
                                    plan.highlighted
                                        ? "border-brand bg-brand shadow-[0_4px_32px_0_rgba(0,168,107,0.18)]"
                                        : "border-divider bg-background hover:border-divider-strong"
                                }`}
                            >
                                <div className="flex-1">
                                    <p className={`text-sm font-medium uppercase tracking-widest ${plan.highlighted ? "text-on-brand/70" : "text-on-background-secondary"}`}>
                                        {plan.name}
                                    </p>
                                    <div className="mt-3 flex items-end gap-1.5">
                                        <span className={`text-4xl font-medium tracking-tight ${plan.highlighted ? "text-on-brand" : "text-on-background"}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm mb-1 ${plan.highlighted ? "text-on-brand/60" : "text-on-background-secondary"}`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`mt-3 text-sm leading-relaxed ${plan.highlighted ? "text-on-brand/80" : "text-on-background-secondary"}`}>
                                        {plan.tagline}
                                    </p>

                                    <ul className="mt-7 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature.text} className="flex items-start gap-2.5">
                                                <CheckIcon
                                                    className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-on-brand" : "text-brand"}`}
                                                />
                                                <span className="flex flex-col">
                                                    <span className={`text-sm ${plan.highlighted ? "text-on-brand/90" : "text-on-background"}`}>
                                                        {feature.text}
                                                    </span>
                                                    {feature.subs?.map((sub) => (
                                                        <span
                                                            key={sub}
                                                            className={`text-xs mt-0.5 ${plan.highlighted ? "text-on-brand/60" : "text-on-background-secondary"}`}
                                                        >
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCta}
                                    className={ctaClassName(plan.highlighted)}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="mt-10 text-center text-xs text-on-background-secondary">
                        All prices in USD. Credits never expire while your plan is active.{" "}
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
