import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Automation from "../components/landing/Automation";
import MultiConnect from "../components/landing/MultiConnect";
import CTABand from "../components/landing/CTABand";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    const location = useLocation();

    useEffect(() => {
        const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
        if (!target) return;
        // Wait a frame so the section is mounted before scrolling.
        requestAnimationFrame(() => {
            document.getElementById(target)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
        // Clear the state so a back/forward or refresh doesn't re-scroll.
        window.history.replaceState({}, "");
    }, [location.state]);

    return (
        <>
            <Nav />
            <main>
                <Hero />
                <CTABand />
                <Automation />
                <HowItWorks />
                <MultiConnect />
            </main>
            <Footer />
        </>
    );
}
