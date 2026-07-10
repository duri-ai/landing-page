import { Link } from "react-router-dom";
import Nav from "../components/landing/Nav";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-on-background">
            <Nav />

            <main className="max-w-3xl mx-auto px-[24px] py-[48px]">
                <h1 className="text-3xl font-bold mb-[8px]">Privacy Policy</h1>
                <p className="text-on-background-secondary mb-[32px]">Last updated: July 10, 2026</p>

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
                            <strong>Conversation data.</strong> We store your conversation messages,
                            session activity records, and session state so you can return to a session
                            and Duri can continue the task. We delete this data when you delete the
                            session or after 30 days without activity. We may retain separate systemic
                            logs, such as timestamps, model names, token counts, and error traces, to
                            debug failures, maintain the Service, and detect abuse.
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
                            file, Duri may retain a copy of that data as part of the session. Files you
                            upload and files Duri downloads or creates are also stored with the
                            session. We delete these stored copies and files when you delete the
                            session or after 30 days without activity. Deleting a Duri session does
                            not reverse actions already completed in a third-party service.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Browser session data.</strong> When Duri uses its browser tool, the
                            browser runs through a hosted browser provider and the desktop app embeds
                            a view of it. We may capture page text, visited URLs, screenshots, and
                            browser profile data such as session cookies so the agent can perform and
                            resume the task. We delete the browser session and its associated profile
                            when you delete the Duri session or after 30 days without activity.
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
                            pasting an API key). Before authorization, Duri shows the available
                            permissions and requests the ones selected for that connection.
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
                        <h2 className="text-xl font-semibold mb-[8px]">Google user data</h2>
                        <p className="mb-[12px]">
                            When you connect a Google product, Duri receives your Google account ID,
                            name, and email address to identify the connected account. Depending on the
                            product, permissions you select, and task you request, raw Google user data
                            may also include:
                        </p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mb-[12px]">
                            <li>
                                Gmail messages, threads, drafts, labels, sender and recipient details,
                                and messages Duri sends or organizes for you.
                            </li>
                            <li>
                                Google Drive files you select or Duri creates, plus content and metadata
                                from Google Docs, Sheets, Slides, and Forms that you ask Duri to work
                                with, including form responses when authorized.
                            </li>
                            <li>
                                Google Calendar availability, calendars, events, attendees, and sharing
                                settings that you authorize Duri to read or manage.
                            </li>
                            <li>
                                Google Meet spaces, participants, settings, recordings, and transcripts
                                that you authorize Duri to access.
                            </li>
                            <li>
                                Google Chat spaces, memberships, and messages that you authorize Duri
                                to read, create, or manage.
                            </li>
                        </ul>
                        <p className="mb-[12px]">
                            <strong>How we use it.</strong> We use Google user data only to perform the
                            task you request, show you the result, maintain session continuity, protect
                            the Service, and troubleshoot the Google integration. We may derive
                            aggregated or deidentified operational metrics such as request counts,
                            feature usage, latency, token usage, and error rates solely to operate,
                            secure, or improve user-facing features.
                        </p>
                        <p className="mb-[12px]">
                            <strong>How we transfer it.</strong> We transfer Google user data only when
                            necessary to complete a user-requested task. This may include a destination
                            service you direct Duri to update and service providers acting on our
                            behalf, such as cloud hosting, hosted browser, and AI model providers. We
                            do not sell Google user data or share it with advertisers, data brokers, or
                            other information resellers.
                        </p>
                        <p className="mb-[12px]">
                            <strong>AI, advertising, and lending restrictions.</strong> Neither Duri nor
                            our service providers use raw or derived Google Workspace data to develop,
                            improve, or train general-purpose AI or machine-learning models. We do not
                            use Google user data for targeted advertising, advertising profiles,
                            creditworthiness decisions, or lending.
                        </p>
                        <p className="mb-[12px]">
                            <strong>Protection, retention, and deletion.</strong> Google user data is
                            encrypted in transit and at rest, and production access is restricted and
                            logged. Google data retained in a Duri session, including associated files,
                            is deleted when you delete the session or after 30 days without activity.
                            Disconnecting a Google integration deletes its stored authorization tokens
                            and prevents future access. Systemic logs may be retained for up to 1 year
                            as described below. Deletion from Duri does not delete data that remains in
                            Google or another service where you directed Duri to write it.
                        </p>
                        <p>
                            <strong>Google Limited Use.</strong> Duri's use and transfer of information
                            received from Google APIs adheres to the{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                className="text-brand underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Google API Services User Data Policy
                            </a>
                            {", including the Limited Use requirements."}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How we protect your data</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>All traffic is encrypted in transit with TLS.</li>
                            <li>Data at rest is encrypted at the storage layer (AES-256 in S3 and RDS).</li>
                            <li>
                                Third-party credentials and sensitive session data are encrypted at
                                rest and decrypted only when needed to provide the Service.
                            </li>
                            <li>
                                Agent code runs in per-session sandboxes that don't share filesystem
                                state with other users. Runtime sandbox contents are discarded after
                                execution; persisted session data follows the retention schedule below.
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
                            <li>
                                Session data, including conversation messages, session activity
                                records, session state, data retained from a task, and attached,
                                downloaded, or generated files: until you delete the session or it has
                                been inactive for 30 days.
                            </li>
                            <li>
                                Browser session and profile data: deleted with the associated Duri
                                session.
                            </li>
                            <li>
                                Systemic logs and error traces: up to 1 year, then deleted. These may
                                be retained separately after session data is deleted.
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
