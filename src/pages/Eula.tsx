import { Link } from "react-router-dom";

function Eula() {
    return (
        <div className="min-h-screen bg-background text-on-background">
            <header className="w-full px-[14px] lg:px-[48px] py-[16px] border-b border-divider">
                <Link to="/">
                    <img src="/logos/duri.svg" className="h-[24px]" alt="Duri Logo" />
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-[24px] py-[48px]">
                <h1 className="text-3xl font-bold mb-[8px]">End-User License Agreement</h1>
                <p className="text-on-background-secondary mb-[32px]">Last updated: April 6, 2026</p>

                <div className="space-y-[24px] text-[1rem] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">1. Agreement to Terms</h2>
                        <p>
                            This End-User License Agreement ("Agreement") is a legal agreement between you
                            ("User") and Duri ("Company", "we", "our") governing your use of the Duri
                            platform, including all associated software, services, and integrations
                            (collectively, the "Service"). By accessing or using the Service, you agree
                            to be bound by the terms of this Agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">2. License Grant</h2>
                        <p>
                            We grant you a limited, non-exclusive, non-transferable, revocable license to
                            access and use the Service for your internal business operations, subject to
                            the terms of this Agreement and any applicable subscription plan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">3. Permitted Use</h2>
                        <p>You may use the Service to:</p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mt-[8px]">
                            <li>Automate back-office operations including data processing, reporting, and integrations</li>
                            <li>Connect authorized third-party services (e.g., QuickBooks Online, Shopify, Google Workspace)</li>
                            <li>Create and execute tasks and workflows within the platform</li>
                            <li>Access and process your business data through connected integrations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">4. Restrictions</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mt-[8px]">
                            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                            <li>Use the Service to process data you are not authorized to access</li>
                            <li>Share your account credentials or allow unauthorized access</li>
                            <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
                            <li>Attempt to circumvent security measures or access controls</li>
                            <li>Resell, sublicense, or redistribute the Service without our written consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">5. Third-Party Integrations</h2>
                        <p>
                            The Service enables connections to third-party platforms. Your use of those
                            platforms is governed by their respective terms of service and privacy policies.
                            We are not responsible for the availability, accuracy, or policies of third-party
                            services. You are responsible for maintaining valid authorization with any
                            connected services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">6. Data Ownership</h2>
                        <p>
                            You retain all ownership rights to your data. We do not claim ownership over
                            any data you process through the Service. We access your data solely to provide
                            the Service as directed by you. For details on how we handle your data, see
                            our <Link to="/privacy" className="text-brand underline">Privacy Policy</Link>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">7. Service Availability</h2>
                        <p>
                            We strive to maintain high availability but do not guarantee uninterrupted
                            access. The Service may be temporarily unavailable due to maintenance, updates,
                            or circumstances beyond our control. We will make reasonable efforts to notify
                            you of planned downtime.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, the Service is provided "as is" without
                            warranties of any kind. We shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages arising from your use of the Service,
                            including but not limited to loss of data, business interruption, or financial
                            losses resulting from automated actions performed by the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">9. User Responsibility</h2>
                        <p>
                            You are responsible for reviewing and verifying the results of any automated
                            tasks performed by the Service. While we strive for accuracy, AI-powered
                            automation may occasionally produce errors. You agree to review critical
                            operations before they are finalized.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">10. Termination</h2>
                        <p>
                            Either party may terminate this Agreement at any time. Upon termination,
                            your access to the Service will cease. We will retain your data for a
                            reasonable period to allow for data export, after which it will be deleted
                            in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">11. Changes to This Agreement</h2>
                        <p>
                            We may modify this Agreement at any time. Material changes will be communicated
                            via email or through the Service. Your continued use of the Service after
                            changes take effect constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">12. Governing Law</h2>
                        <p>
                            This Agreement shall be governed by and construed in accordance with the laws
                            of the jurisdiction in which the Company is incorporated, without regard to
                            conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">13. Contact</h2>
                        <p>
                            For questions about this Agreement, contact us at{" "}
                            <a href="mailto:info@duri-ai.com" className="text-brand underline">info@duri-ai.com</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Eula;
