import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Nav from "../components/landing/Nav";

export default function CheckoutReturnPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate("/login");
            return;
        }
        if (!sessionId) {
            navigate("/account");
            return;
        }

        const interval = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    clearInterval(interval);
                    navigate("/account");
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user, loading, sessionId, navigate]);

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                            <path d="M4 11.5l5 5 9-9" stroke="#00a86b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-on-background">Payment successful</h1>
                    <p className="mt-2 text-sm text-on-background-secondary">
                        Your credit has been added. Redirecting to your account in {countdown}…
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/account")}
                        className="mt-6 text-sm text-brand hover:underline cursor-pointer"
                    >
                        Go now
                    </button>
                </div>
            </div>
        </div>
    );
}
