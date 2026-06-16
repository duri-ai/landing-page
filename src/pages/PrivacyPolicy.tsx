import { Link } from "react-router-dom";
import Nav from "../components/landing/Nav";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-on-background">
            <Nav />

            <main className="max-w-3xl mx-auto px-[24px] py-[48px]">
                <h1 className="text-3xl font-bold mb-[8px]">Privacy Policy</h1>
                <p className="text-on-background-secondary mb-[32px]">Last updated: June 16, 2026</p>

                <div className="space-y-[24px] text-[1rem] leading-relaxed">
                    <section>
                        <p>
                            Duri is an AI assistant that does back-office work on your behalf: sending
                            emails, updating spreadsheets, generating reports, searching the web,
                            scheduling meetings, and so on. To do any of that, we have to handle some
                            data about you and the accounts you ask Duri to act on. This page explains
                            what we collect, why, and what we deliberately do not keep.
                        </p>
                        <p className="mt-[12px]">
                            "Duri", "we", "our", and "us" refer to Duri AI, Inc. "You" refers to the
                            person using Duri, whether that's an individual user or an employee acting
                            for a company.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">What we collect</h2>
                        <p className="mb-[12px]">
                            We try not to collect anything we don't need. In practice, these are the
                            categories:
                        </p>

                        <p className="mb-[8px]">
                            <strong>Account and organization data.</strong> Your name, email address,
                            hashed password (handled by Supabase, our authentication provider), the
                            name of your organization and your role inside it, your time zone, and the
                            language preference we infer from your prompt.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Billing data.</strong> If you're on a paid plan, we store your
                            Stripe customer and subscription IDs, plan tier, current credit balance,
                            and invoice history. We never see your card number, Stripe handles that.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Conversation data.</strong> We do not store the content of your
                            conversations with Duri. The agent reads your prompt, runs the task, and
                            returns the result; the back-and-forth is not persisted on our side. The
                            only conversation-adjacent record we keep is a systemic log line per
                            request (timestamp, model name, token counts, error traces), streamed
                            through Firehose so we can debug failures and detect abuse.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Third-party credentials.</strong> When you connect a third-party
                            service, the service hands us an OAuth token or API key. We store those
                            encrypted in our database with a key we cannot read at rest, and they are
                            decrypted only inside the running session that needs them. We never see or
                            store your password for the third-party service.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Data Duri reads or writes through a conversation.</strong> When
                            the agent reads an email, updates a row in a spreadsheet, or downloads a
                            file you uploaded, that content lives inside the active session only. It
                            is stored encrypted alongside your third-party credentials, behind the
                            same key we cannot read, so even we cannot look at it. When the session
                            ends the data is gone.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Browser session data.</strong> When Duri uses its browser tool, the
                            browser runs on our infrastructure (via Browserbase) and the desktop app
                            embeds a view of it. We capture page text, the URLs visited, and periodic
                            screenshots so the agent can react to what it sees. If you sign into a
                            website inside that session, the session cookies live in that browser
                            instance until the session ends, then they're discarded.
                        </p>

                        <p>
                            <strong>Usage and telemetry.</strong> Timestamps, the LLM model name and
                            token counts used for each turn, the rough cost of each request, error
                            traces, and the IP address and user agent on authentication events. We
                            use this to bill you accurately, detect abuse, fix bugs, and improve
                            quality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Integrations you connect</h2>
                        <p className="mb-[12px]">
                            You can connect Duri to third-party services so the agent can act in them
                            on your behalf. Each connection is authorized by you through the third
                            party's standard OAuth flow (or, where OAuth isn't supported, by you
                            pasting an API key). We ask for the narrowest scope the agent needs.
                        </p>
                        <p className="mb-[12px]">
                            The credentials you authorize are encrypted at the column level with a
                            separate key, decrypted only inside the running agent session, and never
                            written to a log. Disconnecting an integration deletes the tokens
                            immediately; deleting your account removes them along with everything
                            else under your account. Disconnecting does not undo work the agent
                            already performed in that service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How we protect your data</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>All traffic is encrypted in transit with TLS.</li>
                            <li>Data at rest is encrypted at the storage layer (AES-256 in S3 and RDS).</li>
                            <li>
                                Third-party credentials and any data the agent reads or writes through
                                a conversation are encrypted at the column level with a separate key
                                we cannot read at rest, and are decrypted only inside the running
                                session that needs them.
                            </li>
                            <li>
                                Agent code runs in per-session sandboxes that don't share filesystem
                                state with other users. Session contents are discarded when the
                                session ends.
                            </li>
                            <li>
                                Access to production systems is restricted to a small number of named
                                engineers, requires MFA, and is logged.
                            </li>
                            <li>
                                We run dependency and image scans on our deploys and rotate long-lived
                                secrets on a schedule.
                            </li>
                        </ul>
                        <p className="mt-[12px]">
                            No service can promise perfect security, and we won't. If we discover a
                            breach that affects you, we'll tell you within the timelines applicable
                            laws require.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How long we keep it</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>Account profile data: while your account exists, plus 30 days after deletion.</li>
                            <li>Billing and tax records: 7 years, because tax authorities expect that.</li>
                            <li>Systemic logs and error traces: 1 year, then deleted.</li>
                            <li>
                                Conversation content: not retained. The agent reads it, acts on it,
                                and we don't keep a copy.
                            </li>
                            <li>
                                Data Duri reads or writes through a conversation, and the encrypted
                                files attached to that session: discarded the moment the session
                                ends. Once the session is gone, even the encrypted blobs are gone.
                            </li>
                            <li>
                                Third-party credentials: until you disconnect the integration or
                                delete your account.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Where your data is processed</h2>
                        <p>
                            Duri is a Canadian company. Our primary infrastructure runs in AWS
                            regions in Canada. When you sign in from outside Canada, your data is
                            transferred to and processed there. For users in the EEA, the UK, and
                            Switzerland, we rely on Standard Contractual Clauses (and the UK Addendum
                            / Swiss equivalents where applicable) for those transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Contact</h2>
                        <p>
                            Privacy questions, data requests, and any other inquiry:{" "}
                            <a href="mailto:info@duri-ai.com" className="text-brand underline">info@duri-ai.com</a>.
                        </p>
                        <p className="mt-[8px]">
                            For our other policies, see the{" "}
                            <Link to="/eula" className="text-brand underline">End-User License Agreement</Link>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;
