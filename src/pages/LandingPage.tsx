import { useEffect } from "react";
import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import Integrations from "../components/landing/Integrations";
import HowItWorks from "../components/landing/HowItWorks";
import Comparison from "../components/landing/Comparison";
import Automation from "../components/landing/Automation";
import CTABand from "../components/landing/CTABand";
import Footer from "../components/landing/Footer";

const DESIGN_WIDTH = 1280;

export default function LandingPage() {
    useEffect(() => {
        const body = document.body;

        const update = () => {
            const vw = window.innerWidth;
            if (vw < DESIGN_WIDTH) {
                const scale = vw / DESIGN_WIDTH;
                body.style.width = `${DESIGN_WIDTH}px`;
                body.style.minHeight = `${window.innerHeight / scale}px`;
                body.style.zoom = String(scale);
            } else {
                body.style.width = "";
                body.style.minHeight = "";
                body.style.zoom = "";
            }
        };

        update();
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
            body.style.width = "";
            body.style.minHeight = "";
            body.style.zoom = "";
        };
    }, []);

    return (
        <>
            <Nav />
            <main>
                <Hero />
                <Integrations />
                <HowItWorks />
                <Comparison />
                <Automation />
                <CTABand />
            </main>
            <Footer />
        </>
    );
}
