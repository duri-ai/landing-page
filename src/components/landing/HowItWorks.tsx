import { ArrowRight } from "lucide-react";

const base = import.meta.env.BASE_URL;
const logo = (slug: string) => `${base}logos/third_party/${slug}`;

type Column = {
    title: string;
    sources: { src: string; alt: string }[];
    target: { src: string; alt: string };
};

const COLUMNS: Column[] = [
    {
        title: "Automate operations",
        sources: [
            { src: logo("shopify.svg"), alt: "Shopify" },
            { src: logo("shopify.svg"), alt: "Shopify" },
            { src: logo("shopify.svg"), alt: "Shopify" },
        ],
        target: { src: logo("quickbooks.svg"), alt: "QuickBooks" },
    },
    {
        title: "Automate reporting",
        sources: [
            { src: logo("clover.svg"), alt: "Clover" },
            { src: logo("excel.svg"), alt: "Sheets" },
            { src: logo("shopify.svg"), alt: "Shopify" },
        ],
        target: { src: logo("gmail.svg"), alt: "Gmail" },
    },
];

function Flow({ col }: { col: Column }) {
    return (
        <div className="flex items-center justify-center gap-4 sm:gap-6 h-full">
            <div className="flex flex-col items-center gap-2">
                {col.sources.map((s, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xs border border-divider-strong bg-background"
                    >
                        <img src={s.src} alt={s.alt} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                    </div>
                ))}
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-on-background-secondary flex-none" aria-hidden />
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xs border-[1.5px] border-on-background bg-background">
                <img src={col.target.src} alt={col.target.alt} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </div>
        </div>
    );
}

export default function HowItWorks() {
    return (
        <section id="how" className="w-full bg-background border-t border-divider">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
                <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 md:gap-x-20">
                    {COLUMNS.map((col) => (
                        <h2
                            key={col.title}
                            className="text-[clamp(1.25rem,2.6vw,2.125rem)] leading-[1.12] tracking-[-0.02em] font-medium text-on-background text-balance"
                        >
                            {col.title}{" "}
                            <span className="text-brand">in plain language</span>.
                        </h2>
                    ))}
                </div>
                <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-x-6 sm:gap-x-12 md:gap-x-20">
                    {COLUMNS.map((col) => (
                        <div
                            key={col.title}
                            className="rounded-xs border border-divider bg-background-warm py-8 sm:py-10"
                        >
                            <Flow col={col} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
