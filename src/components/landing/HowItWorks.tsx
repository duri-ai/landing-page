import OperationsScene from "./scenes/OperationsScene";
import ReportingScene from "./scenes/ReportingScene";

const CARDS = [
    {
        id: "operations",
        eyebrow: "Operations",
        title: "Sync many stores into one ledger.",
        body: "Tell Duri what to do. It pulls orders, refunds, and payouts from every Shopify store you run and writes them into QuickBooks, every day, without you watching.",
        Scene: OperationsScene,
        reverse: false,
    },
    {
        id: "reporting",
        eyebrow: "Reporting",
        title: "One report from many sources.",
        body: "POS sales from Clover and Square, line items in Google Sheets, orders from Shopify. Duri reconciles them into a single PDF and emails it where it needs to go.",
        Scene: ReportingScene,
        reverse: true,
    },
];

export default function HowItWorks() {
    return (
        <section id="how" className="w-full bg-background border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <div className="mb-14 md:mb-20 max-w-[44rem] mx-auto text-center">
                    <p className="duri-eyebrow mb-4">How Duri works</p>
                    <h2 className="duri-section-title text-balance">
                        Real work, handed off in plain language.
                    </h2>
                </div>

                <div className="flex flex-col gap-16 sm:gap-20 md:gap-28">
                    {CARDS.map(({ id, eyebrow, title, body, Scene, reverse }) => (
                        <div
                            key={id}
                            className={`grid gap-8 md:gap-12 lg:gap-16 items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] ${
                                reverse ? "lg:[&>*:first-child]:order-2" : ""
                            }`}
                        >
                            <div className="max-w-[34rem]">
                                <p className="duri-eyebrow mb-4">{eyebrow}</p>
                                <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.12] tracking-[-0.018em] font-medium text-on-background text-balance">
                                    {title}
                                </h3>
                                <p className="mt-4 text-[0.975rem] leading-[1.6] text-on-background-secondary">
                                    {body}
                                </p>
                            </div>
                            <div className="w-full">
                                <Scene />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
