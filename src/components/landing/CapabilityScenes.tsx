import { MascotGroup } from "./DuriMascot";

const base = import.meta.env.BASE_URL;
const L = (f: string) => `${base}logos/third_party/${f}`;

const FOREST = "#003220";
const MINT = "#7bd3a6";
const BRAND = "#00a86b";
const INK_SOFT = "#d7d3cc";
const AMBER = "#e0a93b";

function SoftBackdrop() {
    return (
        <ellipse
            cx="150"
            cy="150"
            rx="120"
            ry="104"
            fill={MINT}
            opacity="0.14"
        />
    );
}

/* Scene 1 — multi-step work fanning across the tools. */
function SceneTools() {
    const tiles = [
        { x: 40, y: 24, logo: "gsheets.png", n: "1" },
        { x: 129, y: 12, logo: "shopify-bag.svg", n: "2" },
        { x: 218, y: 24, logo: "gmail.png", n: "3" },
    ];
    const curves = [
        "M61 68 C61 112 112 122 149 150",
        "M150 56 C150 104 150 122 150 148",
        "M239 68 C239 112 188 122 151 150",
    ];
    return (
        <svg viewBox="0 0 300 250" className="w-full h-auto" role="img" aria-label="Duri running multi-step work across your tools">
            <SoftBackdrop />
            {curves.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={BRAND}
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            ))}
            <circle cx="150" cy="150" r="3.5" fill={BRAND} />
            {tiles.map((t) => (
                <g key={t.logo}>
                    <rect
                        x={t.x}
                        y={t.y}
                        width="44"
                        height="44"
                        rx="12"
                        fill="#fff"
                        stroke={INK_SOFT}
                        strokeWidth="1.5"
                    />
                    <image href={L(t.logo)} x={t.x + 10} y={t.y + 10} width="24" height="24" />
                    <circle cx={t.x + 3} cy={t.y + 3} r="8" fill={BRAND} />
                    <text
                        x={t.x + 3}
                        y={t.y + 6.5}
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fontWeight="700"
                        fill="#fff"
                    >
                        {t.n}
                    </text>
                </g>
            ))}
            <MascotGroup transform="translate(94 129) scale(0.8)" />
        </svg>
    );
}

/* Scene 2 — Duri driving a browser on its own. */
function SceneBrowser() {
    return (
        <svg viewBox="0 0 300 250" className="w-full h-auto" role="img" aria-label="Duri driving a browser on its own">
            <SoftBackdrop />
            <MascotGroup transform="translate(8 140) scale(0.72)" />

            {/* control link from mascot to the cursor */}
            <path
                d="M96 176 C130 168 150 158 176 150"
                fill="none"
                stroke={BRAND}
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeDasharray="1 6"
                strokeLinecap="round"
            />

            {/* browser window */}
            <g>
                <rect x="120" y="44" width="164" height="130" rx="12" fill="#fff" stroke={FOREST} strokeWidth="2.4" />
                <line x1="120" y1="70" x2="284" y2="70" stroke={FOREST} strokeWidth="2.4" />
                <circle cx="134" cy="57" r="3" fill="#e15c5c" />
                <circle cx="145" cy="57" r="3" fill="#e0a93b" />
                <circle cx="156" cy="57" r="3" fill="#5fb96a" />
                <rect x="176" y="51" width="96" height="12" rx="6" fill="#f2efe9" />
                {/* page content */}
                <rect x="138" y="86" width="118" height="8" rx="4" fill="#ece9e4" />
                <rect x="138" y="102" width="86" height="8" rx="4" fill="#ece9e4" />
                {/* target button */}
                <rect x="138" y="126" width="70" height="22" rx="6" fill={BRAND} />
                <text x="173" y="141" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#fff">
                    Submit
                </text>
            </g>

            {/* click ripple + cursor on the button */}
            <circle cx="186" cy="150" r="13" fill="none" stroke={BRAND} strokeWidth="2" opacity="0.55" />
            <path d="M180 146 L196 153 L189 155 L187 163 Z" fill={FOREST} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
    );
}

/* Scene 3 — scheduled runs, success/failure tracked, learns from it. */
function SceneSchedule() {
    const rows = [
        { y: 96, ok: true, day: "Mon", note: "done" },
        { y: 120, ok: true, day: "Tue", note: "done" },
        { y: 144, ok: false, day: "Wed", note: "need review" },
    ];
    return (
        <svg viewBox="0 0 300 250" className="w-full h-auto" role="img" aria-label="Duri running on a schedule and tracking each result">
            <SoftBackdrop />
            <MascotGroup transform="translate(8 140) scale(0.72)" />

            {/* log / schedule panel */}
            <g>
                <rect x="118" y="40" width="168" height="140" rx="12" fill="#fff" stroke={FOREST} strokeWidth="2.4" />
                {/* header: clock + cadence */}
                <circle cx="137" cy="61" r="8.5" fill="none" stroke={FOREST} strokeWidth="2.2" />
                <path d="M137 56 L137 61 L141 63.5" fill="none" stroke={FOREST} strokeWidth="2.2" strokeLinecap="round" />
                <text x="153" y="65" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill={FOREST}>
                    Daily · 9:00
                </text>
                <line x1="118" y1="78" x2="286" y2="78" stroke="#ece9e4" strokeWidth="1.5" />

                {rows.map((r) => (
                    <g key={r.day}>
                        {r.ok ? (
                            <>
                                <circle cx="137" cy={r.y} r="8" fill={BRAND} />
                                <path
                                    d={`M133.5 ${r.y} l2.5 2.5 l4.5 -5`}
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </>
                        ) : (
                            <>
                                {/* amber warning triangle */}
                                <path
                                    d={`M137 ${r.y - 8} L145.5 ${r.y + 6} L128.5 ${r.y + 6} Z`}
                                    fill={AMBER}
                                    stroke="none"
                                    strokeLinejoin="round"
                                />
                                <line
                                    x1="137" y1={r.y - 2.5} x2="137" y2={r.y + 1.5}
                                    stroke="#fff" strokeWidth="1.8" strokeLinecap="round"
                                />
                                <circle cx="137" cy={r.y + 3.8} r="1.1" fill="#fff" />
                            </>
                        )}
                        <text x="153" y={r.y + 4} fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill={FOREST}>
                            {r.day}
                        </text>
                        <text x="192" y={r.y + 4} fontFamily="Inter, sans-serif" fontSize="11" fill={r.ok ? "#4d7063" : AMBER} fontWeight={r.ok ? 400 : 600}>
                            {r.note}
                        </text>
                    </g>
                ))}
            </g>

            {/* feedback loop back to the mascot */}
            <path
                d="M118 158 C86 178 60 166 58 146"
                fill="none"
                stroke={BRAND}
                strokeOpacity="0.6"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path d="M58 146 l-4 6 l8 0 Z" fill={BRAND} transform="rotate(-16 58 146)" />
        </svg>
    );
}

type Cap = { key: string; scene: () => React.JSX.Element; title: string; line: string };

const CAPS: Cap[] = [
    {
        key: "tools",
        scene: SceneTools,
        title: "Work across your tools",
        line: "Multi-step jobs that span apps, start to finish.",
    },
    {
        key: "browser",
        scene: SceneBrowser,
        title: "Drives the browser",
        line: "Navigates, clicks, and fills forms on its own.",
    },
    {
        key: "schedule",
        scene: SceneSchedule,
        title: "On a schedule",
        line: "Runs on time, tracks each result, and flags what needs you.",
    },
];

const CARD_CLASS =
    "rounded-[16px] border-[1.5px] border-on-background bg-background overflow-hidden shadow-[0_24px_60px_-30px_rgba(0,50,32,0.22)]";

function ConnectorH() {
    return (
        <div className="w-7 shrink-0 flex items-center justify-center" aria-hidden>
            <span className="h-[5px] w-6 rounded-full bg-brand/55" />
        </div>
    );
}

function ConnectorV() {
    return (
        <div className="flex justify-center py-1" aria-hidden>
            <span className="w-[5px] h-6 rounded-full bg-brand/55" />
        </div>
    );
}

function Caption({ c }: { c: Cap }) {
    return (
        <figcaption className="px-1 text-center">
            <h3 className="text-[0.95rem] sm:text-[1rem] font-semibold tracking-[-0.01em] text-on-background">
                {c.title}
            </h3>
            <p className="mt-1 text-[0.8rem] sm:text-[0.85rem] leading-[1.45] text-on-background-secondary text-balance">
                {c.line}
            </p>
        </figcaption>
    );
}

export default function CapabilityScenes() {
    return (
        <div className="relative">
            {/* desktop: cards + connectors in one row (connectors center on
                the cards), captions aligned in a matching row below */}
            <div className="hidden md:block">
                <div className="flex items-center gap-1.5">
                    {CAPS.map((c, i) => (
                        <div key={c.key} className="contents">
                            <div className="flex-1 min-w-0">
                                <div className={CARD_CLASS}>{c.scene()}</div>
                            </div>
                            {i < CAPS.length - 1 && <ConnectorH />}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-1.5">
                    {CAPS.map((c, i) => (
                        <div key={c.key} className="contents">
                            <div className="flex-1 min-w-0">
                                <Caption c={c} />
                            </div>
                            {i < CAPS.length - 1 && <div className="w-7 shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* mobile: stacked, vertical connectors between cards */}
            <div className="md:hidden flex flex-col gap-2">
                {CAPS.map((c, i) => (
                    <div key={c.key} className="contents">
                        <figure className="flex flex-col">
                            <div className={CARD_CLASS}>{c.scene()}</div>
                            <div className="mt-3">
                                <Caption c={c} />
                            </div>
                        </figure>
                        {i < CAPS.length - 1 && <ConnectorV />}
                    </div>
                ))}
            </div>
        </div>
    );
}
