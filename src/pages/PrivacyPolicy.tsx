import { Link } from "react-router-dom";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-on-background">
            <header className="w-full px-[14px] lg:px-[48px] py-[16px] border-b border-divider">
                <Link to="/">
                    <img src="/logos/duri.svg" className="h-[24px]" alt="Duri Logo" />
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-[24px] py-[48px]">
                <h1 className="text-3xl font-bold mb-[8px]">Privacy Policy</h1>
                <p className="text-on-background-secondary mb-[32px]">Last updated: April 6, 2026</p>

                <div className="space-y-[24px] text-[1rem] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">1. Introduction</h2>
                        <p>
                            Duri ("we", "our", or "us") operates the Duri platform — an AI-powered back-office
                            automation service. This Privacy Policy explains how we collect, use, disclose, and
                            safeguard your information when you use our application and services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">2. Information We Collect</h2>
                        <p className="mb-[8px]"><strong>Account Information:</strong> When you create an account, we collect your name, email address, and authentication credentials.</p>
                        <p className="mb-[8px]"><strong>Third-Party Service Credentials:</strong> When you connect integrations (e.g., QuickBooks Online, Shopify, Google Workspace), we securely store the OAuth tokens required to access those services on your behalf. We do not store your passwords for third-party services.</p>
                        <p className="mb-[8px]"><strong>Usage Data:</strong> We collect information about how you interact with our platform, including tasks created, features used, and session metadata.</p>
                        <p><strong>Business Data:</strong> Data processed through connected third-party services (e.g., invoices, customer records, spreadsheets) is accessed and processed only as directed by you to perform requested tasks.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>To provide and maintain our services</li>
                            <li>To execute tasks and automations you request</li>
                            <li>To authenticate with third-party services on your behalf</li>
                            <li>To improve and optimize our platform</li>
                            <li>To communicate with you about your account and service updates</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">4. Data Sharing and Disclosure</h2>
                        <p>
                            We do not sell your personal information. We may share data with:
                        </p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mt-[8px]">
                            <li><strong>Third-Party Services:</strong> Only as necessary to perform tasks you request (e.g., creating an invoice in QuickBooks)</li>
                            <li><strong>Infrastructure Providers:</strong> Cloud hosting and database services that process data on our behalf under strict confidentiality agreements</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data, including
                            encryption in transit and at rest, secure credential storage, and access controls.
                            OAuth tokens for third-party services are stored encrypted and are only used to
                            perform actions you explicitly request.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">6. Data Retention</h2>
                        <p>
                            We retain your account data for as long as your account is active. Task execution
                            data and session logs are retained for a limited period to support debugging and
                            service improvement. You may request deletion of your data at any time by
                            contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mt-[8px]">
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Disconnect any third-party integration at any time, which revokes our access</li>
                            <li>Export your data in a portable format</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">8. Third-Party Integrations</h2>
                        <p>
                            Our platform connects to third-party services such as QuickBooks Online, Shopify, and
                            Google Workspace. Each integration requires your explicit authorization via OAuth. We
                            only request the minimum permissions necessary to perform the services you request.
                            You can revoke access to any connected service at any time through your account
                            settings or directly through the third-party service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any
                            material changes by posting the updated policy on this page and updating the
                            "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">10. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:info@duri-ai.com" className="text-brand underline">info@duri-ai.com</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;
