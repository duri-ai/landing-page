import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import Nav from "../components/landing/Nav";

export default function CheckoutPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = (searchParams.get("type") ?? "subscription") as "subscription" | "refill";
    const redirected = useRef(false);

    useEffect(() => {
        if (loading || redirected.current) return;
        if (!user) {
            navigate("/login");
            return;
        }

        const role = user.user_metadata?.role as string | undefined;
        if (role === "member") {
            navigate("/account");
            return;
        }

        redirected.current = true;

        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({ type }),
                },
            );
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                navigate("/pricing");
            }
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
