import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    Img,
} from "remotion";
import { theme } from "../theme";

const PROMPT =
    "Email a weekly gross sales and ROAS report to myEmail@gmail.com.";

const PROMPT_END = 100;
const SOURCES_START = 120;
const FLOWS_START = 200;
const PDF_REVEAL = 230;
const PDF_BUILD = 250;
const SENT_BADGE = 330;

type Source = {
    label: string;
    sub: string;
    metric: string;
    metricLabel: string;
    appearOffset: number;
    flowOffset: number;
    renderMark: () => React.ReactNode;
};

function ShopifyMark() {
    return (
        <Img
            src={staticFile("logos/third_party/shopify.svg")}
            style={{ width: 40, height: 40 }}
        />
    );
}
function SquareMark() {
    return (
        <Img
            src={staticFile("logos/third_party/square.png")}
            style={{ width: 40, height: 40, borderRadius: 7 }}
        />
    );
}
function MetaMark() {
    return (
        <div
            style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: "linear-gradient(135deg, #0064e0, #00a6ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.06em",
            }}
        >
            ∞
        </div>
    );
}

const SOURCES: Source[] = [
    {
        label: "Square",
        sub: "POS sales",
        metric: "$3,948",
        metricLabel: "This week",
        appearOffset: 0,
        flowOffset: 80,
        renderMark: SquareMark,
    },
    {
        label: "Shopify",
        sub: "Online sales",
        metric: "$5,626",
        metricLabel: "This week",
        appearOffset: 14,
        flowOffset: 102,
        renderMark: ShopifyMark,
    },
    {
        label: "Meta Ads",
        sub: "Spend / ROAS",
        metric: "3.2×",
        metricLabel: "$924 spent",
        appearOffset: 28,
        flowOffset: 124,
        renderMark: MetaMark,
    },
];

function Composer({ frame }: { frame: number }) {
    const visibleChars = Math.max(
        0,
        Math.min(
            PROMPT.length,
            Math.floor(interpolate(frame, [14, 88], [0, PROMPT.length])),
        ),
    );
    const visible = PROMPT.slice(0, visibleChars);
    const fade = interpolate(frame, [PROMPT_END, PROMPT_END + 18], [1, 0.7], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const caretOn = Math.floor(frame / 8) % 2 === 0;
    const showCaret = frame < PROMPT_END;

    return (
        <div
            style={{
                background: theme.background,
                border: `1.5px solid ${theme.onBackground}`,
                borderRadius: 10,
                padding: "26px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 18px 44px -24px rgba(0,50,32,0.24)",
                opacity: fade,
            }}
        >
            <div
                style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: theme.onBackgroundSecondary,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                }}
            >
                You
            </div>
            <div
                style={{
                    fontSize: 26,
                    lineHeight: 1.4,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    minHeight: 78,
                }}
            >
                {visible}
                {showCaret ? (
                    <span
                        style={{
                            display: "inline-block",
                            width: 3,
                            height: "1em",
                            background: theme.brand,
                            verticalAlign: "-0.18em",
                            marginLeft: 2,
                            opacity: caretOn ? 1 : 0,
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}

function SourceCard({ src, frame }: { src: Source; frame: number }) {
    const appearAt = SOURCES_START + src.appearOffset;
    const op = interpolate(frame - appearAt, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearAt, [0, 18], [12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const flowAt = FLOWS_START + src.flowOffset - 80;
    const pulse = interpolate(frame - flowAt, [0, 10, 26], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                position: "relative",
                background: theme.background,
                border: `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 9,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: op,
                transform: `translateY(${lift}px)`,
                boxShadow: "0 12px 32px -22px rgba(0,50,32,0.20)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: 11,
                    border: `2px solid ${theme.brand}`,
                    opacity: pulse,
                    pointerEvents: "none",
                }}
            />
            {src.renderMark()}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: theme.onBackground,
                        letterSpacing: "-0.012em",
                        lineHeight: 1.1,
                    }}
                >
                    {src.label}
                </span>
                <span
                    style={{
                        fontSize: 12,
                        color: theme.onBackgroundSecondary,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginTop: 4,
                    }}
                >
                    {src.sub}
                </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span
                    style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 26,
                        fontWeight: 800,
                        color: theme.onBackground,
                        letterSpacing: "-0.012em",
                        lineHeight: 1,
                    }}
                >
                    {src.metric}
                </span>
                <span
                    style={{
                        fontSize: 11,
                        color: theme.onBackgroundSecondary,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        marginTop: 5,
                    }}
                >
                    {src.metricLabel}
                </span>
            </div>
        </div>
    );
}

export const ReportingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const stageIn = spring({ frame, fps, config: { damping: 200 } });

    const pdfOp = interpolate(frame - PDF_REVEAL, [0, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pdfLift = interpolate(frame - PDF_REVEAL, [0, 22], [22, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const headerIn = interpolate(frame - PDF_BUILD, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const chartIn = interpolate(frame - (PDF_BUILD + 14), [0, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const breakdownIn = interpolate(frame - (PDF_BUILD + 32), [0, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const sentIn = interpolate(frame - SENT_BADGE, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sentLift = interpolate(frame - SENT_BADGE, [0, 18], [12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const chartBars = [42, 56, 50, 64, 48, 72, 60, 58, 66, 76, 70, 80, 88];

    return (
        <AbsoluteFill style={{ background: theme.background, fontFamily: theme.fontFamily }}>
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, ${theme.brand} 6%, transparent) 0%, transparent 70%)`,
                }}
            />
            <AbsoluteFill
                style={{
                    backgroundImage: `linear-gradient(to right, color-mix(in oklch, ${theme.onBackground} 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, ${theme.onBackground} 5%, transparent) 1px, transparent 1px)`,
                    backgroundSize: "88px 88px",
                    opacity: 0.6,
                }}
            />

            <AbsoluteFill
                style={{
                    padding: "70px 100px",
                    opacity: stageIn,
                    display: "flex",
                    gap: 60,
                    alignItems: "stretch",
                }}
            >
                <div
                    style={{
                        flex: "0 0 580px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                    }}
                >
                    <Composer frame={frame} />
                    {SOURCES.map((s) => (
                        <SourceCard key={s.label} src={s} frame={frame} />
                    ))}
                </div>

                <div style={{ flex: 1, position: "relative" }}>
                    {SOURCES.map((s, idx) => {
                        const flowAt = FLOWS_START + s.flowOffset - 80;
                        const t = (frame - flowAt) / 24;
                        if (t < 0 || t > 1.2) return null;
                        const x = interpolate(t, [0, 1], [-12, 50], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const startY = (idx + 1) * 22 + 16;
                        const y = interpolate(t, [0, 1], [startY, 50], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const op = interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
                        return (
                            <div
                                key={s.label}
                                style={{
                                    position: "absolute",
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    width: 14,
                                    height: 14,
                                    borderRadius: 999,
                                    background: theme.brand,
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: `0 0 18px ${theme.brand}`,
                                    opacity: op,
                                }}
                            />
                        );
                    })}

                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pdfOp,
                            transform: `translateY(${pdfLift}px)`,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: 760,
                                background: theme.background,
                                border: `1.5px solid ${theme.onBackground}`,
                                borderRadius: 4,
                                boxShadow: "0 44px 110px -36px rgba(0,50,32,0.38)",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 22,
                                    right: 22,
                                    background: "#d33b3b",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    borderRadius: 3,
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    fontSize: 13,
                                    fontWeight: 800,
                                    letterSpacing: "0.18em",
                                }}
                            >
                                PDF
                            </div>

                            <div style={{ padding: "36px 44px 26px" }}>
                                <span
                                    style={{
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                                        fontSize: 14,
                                        color: theme.onBackgroundSecondary,
                                        letterSpacing: "0.18em",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    weekly_sales.pdf
                                </span>
                            </div>

                            <div
                                style={{
                                    padding: "0 44px 36px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 32,
                                    flex: 1,
                                }}
                            >
                                <div style={{ opacity: headerIn, display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Week of Jun 9 to Jun 15
                                    </span>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                                        <span
                                            style={{
                                                fontSize: 64,
                                                fontWeight: 600,
                                                color: theme.onBackground,
                                                letterSpacing: "-0.026em",
                                                lineHeight: 1,
                                            }}
                                        >
                                            $9,574
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 22,
                                                color: theme.brand,
                                                fontWeight: 800,
                                            }}
                                        >
                                            +18.6%
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 14,
                                            color: theme.onBackgroundSecondary,
                                            letterSpacing: "0.16em",
                                            textTransform: "uppercase",
                                            fontWeight: 700,
                                            marginTop: 4,
                                        }}
                                    >
                                        Gross sales
                                    </span>
                                </div>

                                <div style={{ opacity: chartIn, display: "flex", flexDirection: "column", gap: 10 }}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Daily gross
                                    </span>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130 }}>
                                        {chartBars.map((h, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    flex: 1,
                                                    background:
                                                        i === chartBars.length - 1 ? theme.brand : theme.onBackground,
                                                    height: `${h * chartIn}%`,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        opacity: breakdownIn,
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 36,
                                        paddingTop: 20,
                                        borderTop: `1px solid ${theme.divider}`,
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: theme.onBackgroundSecondary,
                                                fontWeight: 800,
                                                letterSpacing: "0.18em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Blended ROAS
                                        </span>
                                        <span
                                            style={{
                                                fontFamily:
                                                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                                                fontSize: 44,
                                                fontWeight: 700,
                                                color: theme.onBackground,
                                                letterSpacing: "-0.02em",
                                                lineHeight: 1,
                                            }}
                                        >
                                            3.2×
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: theme.onBackgroundSecondary,
                                                fontWeight: 600,
                                                marginTop: 2,
                                            }}
                                        >
                                            $924 spent · $2,956 attributed
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: theme.onBackgroundSecondary,
                                                fontWeight: 800,
                                                letterSpacing: "0.18em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Orders
                                        </span>
                                        <span
                                            style={{
                                                fontFamily:
                                                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                                                fontSize: 44,
                                                fontWeight: 700,
                                                color: theme.onBackground,
                                                letterSpacing: "-0.02em",
                                                lineHeight: 1,
                                            }}
                                        >
                                            186
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: theme.onBackgroundSecondary,
                                                fontWeight: 600,
                                                marginTop: 2,
                                            }}
                                        >
                                            AOV $51.5 · across 3 channels
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                bottom: 48,
                                right: 36,
                                background: theme.background,
                                border: `1.5px solid ${theme.brand}`,
                                borderRadius: 6,
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                opacity: sentIn,
                                transform: `translateY(${sentLift}px)`,
                                boxShadow: "0 14px 36px -20px rgba(0,50,32,0.24)",
                            }}
                        >
                            <Img
                                src={staticFile("logos/third_party/gmail.svg")}
                                style={{ width: 26, height: 26 }}
                            />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 800,
                                        color: theme.onBackground,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Sent to myEmail@gmail.com
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: theme.onBackgroundSecondary,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        marginTop: 2,
                                    }}
                                >
                                    Monday, 9:00 AM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
