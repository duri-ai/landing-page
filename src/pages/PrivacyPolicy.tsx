import { Link } from "react-router-dom";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-on-background">
            <nav className="bg-background sticky w-full z-20 top-0 border-b border-divider min-w-xs">
                <div className="flex items-center justify-between p-4 md:py-0 md:px-8">
                    <Link to="/">
                        <img src={`${import.meta.env.BASE_URL}logos/duri.svg`} className="h-5" alt="Duri Text Logo" />
                    </Link>
                    <div className="inline-flex items-center gap-3 md:py-4" aria-hidden="true">
                        <span className="invisible box-border border-2 border-transparent font-normal leading-5 rounded-xs text-sm px-3 py-[5px] md:px-5 md:py-2.5 select-none">
                            Request a Demo
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-[24px] py-[48px]">
                <h1 className="text-3xl font-bold mb-[8px]">Privacy Policy</h1>
                <p className="text-on-background-secondary mb-[32px]">Last updated: June 3, 2026</p>

                <div className="space-y-[24px] text-[1rem] leading-relaxed">
                    <section>
                        <p>
                            Duri is an AI assistant that does back-office work on your behalf: sending emails,
                            updating spreadsheets, posting to Notion, running QuickBooks reports, searching the
                            web, scheduling meetings, and so on. To do any of that, we have to handle data about
                            you and the people and accounts you work with. This page explains what we collect,
                            why, who we share it with, and what you can do about it.
                        </p>
                        <p className="mt-[12px]">
                            This policy covers the Duri desktop app, the web app at duri-ai.com, and our API.
                            If you signed an enterprise agreement with us, that agreement controls wherever it
                            disagrees with this page.
                        </p>
                        <p className="mt-[12px]">
                            "Duri", "we", "our", and "us" refer to Duri AI, Inc. "You" refers to the person
                            using Duri, whether that's an individual user or an employee acting for a company.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">What we collect</h2>
                        <p className="mb-[12px]">
                            We try not to collect anything we don't need. In practice, these are the categories:
                        </p>

                        <p className="mb-[8px]">
                            <strong>Account and organization data.</strong> Your name, email address, hashed
                            password (handled by Supabase, our authentication provider), the name of your
                            organization and your role inside it, your time zone, and the language preference
                            we infer from your browser.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Billing data.</strong> If you're on a paid plan, we store your Stripe
                            customer and subscription IDs, plan tier, current credit balance, and invoice
                            history. We never see your card number — Stripe handles that.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Conversation data.</strong> Everything you send to Duri (instructions, follow
                            ups, files you upload, screenshots from the embedded browser) and everything Duri
                            sends back (replies, agent reasoning, tool call arguments and results, generated
                            files). We need this to run the agent and to let you scroll back through past work.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Connection tokens.</strong> When you connect a third-party service (Gmail,
                            Notion, Shopify, etc.), the service hands us an OAuth token or API key. We store
                            those encrypted in our database and use them only to take the actions you ask Duri
                            to take. We never see or store your password for the third-party service.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Data Duri reads or writes through a connection.</strong> When the agent
                            reads an email, updates a row in a spreadsheet, posts a message to a Notion page,
                            or downloads a file from your Drive, that content passes through our servers. We
                            keep what's needed to power the current conversation (so the agent can refer back
                            to "the file you just uploaded") and clear most of it on the retention schedule
                            below.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Browser session data.</strong> When Duri uses its browser tool, the browser
                            runs on our infrastructure (via Browserbase) and the desktop app embeds a view of
                            it. We capture page text, the URLs visited, and periodic screenshots so the agent
                            can react to what it sees. If you sign into a website inside that session, the
                            session cookies live in that browser instance until the session ends.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Files you upload, files we generate.</strong> Any attachment you give the
                            agent, and any output the agent saves on your behalf, lives in Amazon S3 storage we
                            control. Each file is scoped to your account.
                        </p>

                        <p className="mb-[8px]">
                            <strong>Usage and telemetry.</strong> Timestamps, the LLM model name and token
                            counts used for each turn, the rough cost of each request, error traces, and the
                            IP address and user agent on authentication events. We use this to bill you
                            accurately, detect abuse, fix bugs, and improve quality.
                        </p>

                        <p>
                            <strong>Demo and waitlist info.</strong> If you fill out a form on our marketing
                            site, we store what you typed (typically email and company name) so we can follow
                            up.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How we use it</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>Run the agent and execute the tasks you give it.</li>
                            <li>Keep your account working: sign-in, billing, support.</li>
                            <li>Debug failures and improve reliability.</li>
                            <li>Detect abuse and protect the service.</li>
                            <li>Comply with legal obligations (tax records, lawful requests).</li>
                            <li>
                                Improve quality by reviewing failure cases. By default we may sample a small
                                number of conversations for internal evaluation. You can opt out — see "Your
                                choices" below. We do not use your data to train third-party foundation models.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Third parties we share with</h2>
                        <p className="mb-[12px]">
                            We do not sell your personal information. We do share data with vendors we rely on
                            to run the service. Each of them only receives what they need to do their part, and
                            we have data processing agreements with them where the law requires.
                        </p>

                        <p className="mb-[8px]"><strong>Cloud and infrastructure.</strong></p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mb-[12px]">
                            <li>
                                <strong>Amazon Web Services (AWS)</strong> — hosts our application, database
                                (Postgres / RDS), file storage (S3), and the sandbox environment where agent
                                code runs.
                            </li>
                            <li>
                                <strong>Supabase</strong> — handles authentication (email/password and OAuth
                                sign-in) and stores the application database.
                            </li>
                        </ul>

                        <p className="mb-[8px]"><strong>Large language model providers.</strong> The agent passes the relevant parts of your conversation, your instructions, and any data the agent has fetched to one of these models to generate a response. We do not allow these providers to train on your data.</p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mb-[12px]">
                            <li>Anthropic (Claude) — primary model</li>
                            <li>OpenAI — used for some sub-tasks and embeddings</li>
                            <li>Google (Gemini) — used as an alternate model</li>
                            <li>Amazon Bedrock — used for hosted alternates</li>
                        </ul>

                        <p className="mb-[8px]"><strong>Other operational vendors.</strong></p>
                        <ul className="list-disc pl-[24px] space-y-[4px] mb-[12px]">
                            <li>
                                <strong>Stripe</strong> — payment processing. Receives your email and the
                                checkout session; Stripe handles card data and PCI compliance directly.
                            </li>
                            <li>
                                <strong>Resend</strong> — sends transactional email (sign-up confirmations,
                                invites, password resets).
                            </li>
                            <li>
                                <strong>Sentry</strong> — receives error stack traces, browser/OS information,
                                and the URL where the error happened, so we can fix bugs.
                            </li>
                            <li>
                                <strong>LangSmith</strong> — receives a sample of LLM prompts and responses for
                                debugging and evaluation. You can opt out (see "Your choices").
                            </li>
                            <li>
                                <strong>Tavily</strong> — runs web searches the agent requests. Receives the
                                search query.
                            </li>
                            <li>
                                <strong>Browserbase</strong> — runs the browser the agent drives. Receives the
                                URLs the agent visits and the actions it takes on your behalf.
                            </li>
                            <li>
                                <strong>Apify</strong> — runs web scraping when the agent needs structured data
                                from a website.
                            </li>
                        </ul>

                        <p>
                            We may add or change vendors as the product grows. We'll keep this list current.
                            We may also share data when we have to: lawful requests, fraud investigation, to
                            protect someone's safety, or in connection with a sale of the business (we'll
                            notify you if that happens).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Integrations you connect</h2>
                        <p className="mb-[12px]">
                            You can connect Duri to third-party services so the agent can act in them on your
                            behalf. Today the supported integrations are Google Workspace (Gmail, Drive, Docs,
                            Sheets, Slides, Forms, Calendar, Chat, Meet), Microsoft 365 (Outlook mail, Calendar,
                            OneDrive, Excel, OneNote, SharePoint, Teams, Planner, Bookings), Notion, Airtable,
                            Trello, Shopify, QuickBooks Online, Meta (Facebook and Instagram), Twitter/X,
                            Clover, and Apify.
                        </p>
                        <p className="mb-[12px]">
                            Each connection is authorized by you through the third party's standard OAuth flow
                            (or, where OAuth isn't supported, by you pasting an API key). We ask for the
                            narrowest scope the agent needs. You can disconnect any integration at any time
                            from Duri's settings. Disconnecting deletes the tokens we hold for that service.
                            It does not undo work the agent already performed in that service.
                        </p>
                        <p className="mb-[12px]">
                            <strong>Google APIs.</strong> Duri's use and transfer to any other app of information
                            received from Google APIs adheres to the{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                className="text-brand underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google API Services User Data Policy
                            </a>
                            , including the Limited Use requirements. We use Google user data only to provide
                            and improve the user-facing features you ask the agent to perform (for example,
                            reading or sending an email at your instruction). We do not use Google user data
                            for advertising, do not sell it, and do not use it to train generalized AI models.
                            Human access to Google user data is restricted to specific support cases you've
                            opened or where required by law.
                        </p>
                        <p>
                            <strong>Microsoft Graph and other APIs.</strong> The same principle applies. We use
                            data only for the actions you authorize, store the minimum needed, and follow each
                            provider's API terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How we protect your data</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>All traffic is encrypted in transit with TLS.</li>
                            <li>Data at rest is encrypted at the storage layer (AES-256 in S3 and RDS).</li>
                            <li>
                                Third-party OAuth tokens are encrypted at the column level with a separate key
                                and decrypted only at the moment of use.
                            </li>
                            <li>
                                Agent code runs in per-session sandboxes that don't share filesystem state
                                with other users.
                            </li>
                            <li>
                                Access to production systems is restricted to a small number of named
                                engineers, requires MFA, and is logged. Direct database access for support
                                cases requires a written ticket.
                            </li>
                            <li>
                                We run dependency and image scans on our deploys and rotate long-lived
                                secrets on a schedule.
                            </li>
                        </ul>
                        <p className="mt-[12px]">
                            No service can promise perfect security, and we won't. If we discover a breach
                            that affects you, we'll tell you within the timelines applicable laws require.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">How long we keep it</h2>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>Account profile data: while your account exists, plus 30 days after deletion.</li>
                            <li>Conversations, tool outputs, and uploaded files: 90 days by default. Enterprise plans can configure this.</li>
                            <li>Connection tokens: until you disconnect the integration or delete your account.</li>
                            <li>Billing and tax records: 7 years, because tax authorities expect that.</li>
                            <li>Error logs and security audit events: 30 days.</li>
                            <li>Backup snapshots: rolled forward on a 35-day window, then overwritten.</li>
                        </ul>
                        <p className="mt-[12px]">
                            When data hits its retention horizon, we delete it from primary storage. It may
                            persist in backups for the backup window above before it's overwritten.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Your choices</h2>
                        <p className="mb-[8px]">You can:</p>
                        <ul className="list-disc pl-[24px] space-y-[4px]">
                            <li>See and edit your profile and connections from the Account settings page.</li>
                            <li>Disconnect any integration. The tokens go away immediately.</li>
                            <li>
                                Export your data or request its deletion by emailing{" "}
                                <a href="mailto:privacy@duri-ai.com" className="text-brand underline">privacy@duri-ai.com</a>.
                                We'll respond within 30 days.
                            </li>
                            <li>
                                Opt out of having your conversations sampled for internal quality evaluation
                                by emailing the same address. (We never use them to train third-party models
                                in any case.)
                            </li>
                            <li>
                                Close your account from the Account page. That triggers the deletion timeline
                                above.
                            </li>
                        </ul>

                        <p className="mt-[12px]">
                            If you're in the European Economic Area, the UK, or Switzerland, you have rights
                            under the GDPR or equivalent — access, rectification, erasure, restriction,
                            portability, and objection. The legal bases we rely on are performance of our
                            contract with you, your consent (for optional things like model evaluation), our
                            legitimate interests in running and securing the service, and compliance with
                            legal obligations.
                        </p>

                        <p className="mt-[12px]">
                            If you're a California resident, you have rights under the CCPA: to know what we
                            collect, to delete, to correct, to opt out of "sale" or "sharing" (we don't sell or
                            share for cross-context advertising), and to non-discrimination for exercising any
                            of these. Email the address above to use them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Cookies and similar technologies</h2>
                        <p>
                            Our website and apps use a small set of cookies and local storage entries: the
                            Supabase session cookie that keeps you signed in, a CSRF token, and a few
                            preference flags (theme, last-used integration). We do not use marketing,
                            advertising, or cross-site tracking cookies. We do not embed third-party analytics
                            SDKs in the user-facing app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Where your data is processed</h2>
                        <p>
                            Duri is a US company. Our primary infrastructure runs in AWS regions in the United
                            States. When you sign in from outside the US, your data is transferred to and
                            processed there. For users in the EEA, the UK, and Switzerland, we rely on
                            Standard Contractual Clauses (and the UK Addendum / Swiss equivalents where
                            applicable) for those transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Children</h2>
                        <p>
                            Duri is not designed for children. We don't knowingly collect information from
                            anyone under 16 in the EEA/UK, or under 13 in the United States. If you believe a
                            child has signed up, email{" "}
                            <a href="mailto:privacy@duri-ai.com" className="text-brand underline">privacy@duri-ai.com</a> and we'll delete the account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Changes to this policy</h2>
                        <p>
                            We update this page when something material changes. The date at the top reflects
                            the most recent revision. For changes that affect how we handle your data in a
                            meaningful way, we'll send you an email at least 30 days before the change takes
                            effect. Smaller edits (clarifications, fixing a typo, adding a new vendor that
                            does the same thing as an existing one) we'll just post here.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-[8px]">Contact</h2>
                        <p>
                            Privacy questions, data requests, and complaints:{" "}
                            <a href="mailto:privacy@duri-ai.com" className="text-brand underline">privacy@duri-ai.com</a>.
                        </p>
                        <p className="mt-[8px]">
                            General questions:{" "}
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
