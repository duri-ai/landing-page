import { useRef } from "react";
import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import WorkflowBuilder from "../components/landing/WorkflowBuilder";
import HowItWorks from "../components/landing/HowItWorks";
import Integrations from "../components/landing/Integrations";
import CtaBand from "../components/landing/CtaBand";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    const ctaRef = useRef<HTMLElement | null>(null);

    const scrollToDemo = () => {
        ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <Nav onDemoClick={scrollToDemo} />
            <main>
                <Hero />
                <WorkflowBuilder />
                <HowItWorks />
                <Integrations />
                <CtaBand refCallback={(el) => (ctaRef.current = el)} />
            </main>
            <Footer />
        </>
    );
}
