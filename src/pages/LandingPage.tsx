import { useRef } from "react";
import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import PainSolution from "../components/landing/PainSolution";
import WorkflowBuilder from "../components/landing/WorkflowBuilder";
import HowItWorks from "../components/landing/HowItWorks";
import UseCases from "../components/landing/UseCases";
import Integrations from "../components/landing/Integrations";
import CtaBand from "../components/landing/CtaBand";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    const ctaRef = useRef<HTMLElement | null>(null);

    return (
        <>
            <Nav />
            <main>
                <Hero />
                <Integrations />
                <PainSolution />
                <WorkflowBuilder />
                <HowItWorks />
                <UseCases />
                <CtaBand refCallback={(el) => (ctaRef.current = el)} />
            </main>
            <Footer />
        </>
    );
}
