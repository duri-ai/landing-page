import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Automation from "../components/landing/Automation";
import CTABand from "../components/landing/CTABand";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    return (
        <>
            <Nav />
            <main>
                <Hero />
                <HowItWorks />
                <Automation />
                <CTABand />
            </main>
            <Footer />
        </>
    );
}
