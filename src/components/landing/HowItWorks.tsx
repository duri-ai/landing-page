const base = import.meta.env.BASE_URL;

const CARDS = [
    {
        id: "operations",
        question: "Automate operations in plain language",
        videoSrc: `${base}videos/shopify-sync.mp4`,
    },
    {
        id: "reporting",
        question: "Automate reporting in plain language",
        videoSrc: `${base}videos/clover-pdf.mp4`,
    },
];

function VideoPlayer({ src }: { src: string }) {
    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden border border-[#b8e4cc] bg-black shadow-sm">
            <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover block"
            />
        </div>
    );
}

export default function HowItWorks() {
    return (
        <section id="how" className="w-full bg-background border-t border-divider">
            <div className="mx-auto max-w-[860px] px-6 md:px-8 py-12 md:py-24">
                <div className="mb-9 md:mb-16 text-center">
                    <h2 className="text-[clamp(1.85rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-0.018em] font-medium text-on-background mx-auto text-balance max-w-[40rem]">
                        Duri works across every tool in your business.
                    </h2>
                </div>
                <div className="flex flex-col gap-10 md:gap-16">
                    {CARDS.map((card) => (
                        <div key={card.id} className="flex flex-col gap-2.5 md:gap-3">
                            <div className="flex items-center gap-3 pl-[6px]">
                                <div className="w-[3px] self-stretch rounded-full bg-[#007a4d] flex-shrink-0" />
                                <h3 className="text-[clamp(1.15rem,2.3vw,1.8rem)] leading-[1.2] tracking-[-0.02em] font-semibold text-on-background">
                                    {card.question}
                                </h3>
                            </div>
                            <VideoPlayer src={card.videoSrc} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
