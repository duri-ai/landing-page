import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

const BACKEND = (import.meta.env.VITE_BACKEND_URL as string).replace(/\/+$/, "");

export default function CheckoutPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type") ?? "subscription";
    const redirected = useRef(false);

    useEffect(() => {
        if (loading || redirected.current) return;
        if (!user) { navigate("/login"); return; }

        const orgId = user.user_metadata?.organization_id as number | undefined;
        if (!orgId) { navigate("/onboarding"); return; }

        redirected.current = true;

        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const url = `${BACKEND}/stripe/checkout?organization_id=${orgId}${type === "refill" ? "&type=refill" : ""}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });

            const data = await res.json().catch(() => null);
            if (data?.url) { window.location.href = data.url; return; }

            const location = res.headers.get("location");
            if (location) { window.location.href = location; return; }

            navigate("/account");
        })();
    }, [user, loading, type, navigate]);

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                    <p className="text-sm text-on-background-secondary">Redirecting to checkout…</p>
                </div>
            </div>
        </div>
    );
}
