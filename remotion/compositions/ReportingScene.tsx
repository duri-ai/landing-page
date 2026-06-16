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

const PROMPT = "Email a weekly gross sales report to myEmail@gmail.com.";

const PROMPT_END = 100;
const STAGE_REVEAL = 120;
const PDF_FADE_IN = 130;
const PDF_BUILD = 170;
const SENT_BADGE = 320;

type Source = {
    label: string;
    sub: string;
    metric: string;
    metricLabel: string;
    appearOffset: number;
    sourcedOffset: number;
    renderMark: () => React.ReactNode;
};

function ShopifyMark() {
    return (
        <Img
            src={staticFile("logos/third_party/shopify.svg")}
            style={{ width: 36, height: 36 }}
        />
    );
}
function SquareMark() {
    return (
        <Img
            src={staticFile("logos/third_party/square.png")}
            style={{ width: 36, height: 36, borderRadius: 6 }}
        />
    );
}
function AmazonMark() {
    return (
        <div
            style={{
                width: 44,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Img
                src={staticFile("logos/third_party/amazon.png")}
                style={{ width: 44, height: 36, objectFit: "contain" }}
            />
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
        sourcedOffset: 80,
        renderMark: SquareMark,
    },
    {
        label: "Shopify",
        sub: "Online sales",
        metric: "$5,626",
        metricLabel: "This week",
        appearOffset: 12,
        sourcedOffset: 110,
        renderMark: ShopifyMark,
    },
    {
        label: "Amazon",
        sub: "Marketplace sales",
        metric: "$2,184",
        metricLabel: "This week",
        appearOffset: 24,
        sourcedOffset: 140,
        renderMark: AmazonMark,
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
    const caretOn = Math.floor(frame / 8) % 2 === 0;
    const showCaret = frame < PROMPT_END;
    return (
        <div
            style={{
                background: theme.background,
                border: `1.5px solid ${theme.onBackground}`,
                borderRadius: 10,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: "0 18px 44px -24px rgba(0,50,32,0.24)",
            }}
        >
            <div
                style={{
                    fontSize: 12,
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
                    fontSize: 28,
                    lineHeight: 1.35,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    minHeight: 38,
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
    const appearAt = STAGE_REVEAL + src.appearOffset;
    const op = interpolate(frame - appearAt, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sourcedAt = STAGE_REVEAL + src.sourcedOffset;
    const sourcedPulse = interpolate(frame - sourcedAt, [0, 10, 30], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sourcedSettled = frame > sourcedAt + 10 ? 1 : 0;
    return (
        <div
            style={{
                position: "relative",
                background: theme.background,
                border: `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 9,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: op,
                boxShadow: "0 10px 28px -22px rgba(0,50,32,0.18)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: 11,
                    border: `2px solid ${theme.brand}`,
                    opacity: sourcedPulse,
                    pointerEvents: "none",
                }}
            />
            {src.renderMark()}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span
                    style={{
                        fontSize: 21,
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
                        marginTop: 3,
                    }}
                >
                    {src.sub}
                </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span
                    style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 28,
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
                        fontSize: 10,
                        color: sourcedSettled ? theme.brand : theme.onBackgroundSecondary,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginTop: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    {sourcedSettled ? (
                        <>
                            <span
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: 999,
                                    background: theme.brand,
                                    display: "inline-block",
                                }}
                            />
                            Sourced
                        </>
                    ) : (
                        src.metricLabel
                    )}
                </span>
            </div>
        </div>
    );
}

export const ReportingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const stageIn = spring({ frame, fps, config: { damping: 200 } });

    const pdfOp = interpolate(frame - PDF_FADE_IN, [0, 22], [0, 1], {
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
                    padding: "50px 80px",
                    opacity: stageIn,
                    flexDirection: "column",
                    gap: 26,
                }}
            >
                <Composer frame={frame} />

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 40,
                        minHeight: 0,
                    }}
                >
                    <div
                        style={{
                            flex: "0 0 480px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {SOURCES.map((s) => (
                            <SourceCard key={s.label} src={s} frame={frame} />
                        ))}
                    </div>

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            position: "relative",
                            display: "flex",
                            alignItems: "stretch",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                background: theme.background,
                                border: `1.5px solid ${theme.onBackground}`,
                                borderRadius: 4,
                                boxShadow: "0 36px 90px -30px rgba(0,50,32,0.36)",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                overflow: "hidden",
                                opacity: pdfOp,
                            }}
                        >
                            <div
                                style={{
                                    background: theme.backgroundWarm,
                                    borderBottom: `1px solid ${theme.divider}`,
                                    padding: "22px 28px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        background: "#d33b3b",
                                        color: "#fff",
                                        padding: "10px 14px",
                                        borderRadius: 5,
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                                        fontSize: 16,
                                        fontWeight: 800,
                                        letterSpacing: "0.18em",
                                        lineHeight: 1,
                                    }}
                                >
                                    PDF
                                </div>
                                <span
                                    style={{
                                        fontSize: 24,
                                        color: theme.onBackground,
                                        fontWeight: 700,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    weekly_sales.pdf
                                </span>
                                <span
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: 13,
                                        color: theme.onBackgroundSecondary,
                                        letterSpacing: "0.16em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                    }}
                                >
                                    Generated · 1 page
                                </span>
                            </div>

                            <div
                                style={{
                                    padding: "26px 36px 28px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 22,
                                    flex: 1,
                                }}
                            >
                                <div style={{ opacity: headerIn, display: "flex", flexDirection: "column", gap: 6 }}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Week of Jun 9 to Jun 15
                                    </span>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                                        <span
                                            style={{
                                                fontSize: 54,
                                                fontWeight: 600,
                                                color: theme.onBackground,
                                                letterSpacing: "-0.026em",
                                                lineHeight: 1,
                                            }}
                                        >
                                            $11,758
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 18,
                                                color: theme.brand,
                                                fontWeight: 800,
                                            }}
                                        >
                                            +14.8%
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: theme.onBackgroundSecondary,
                                            letterSpacing: "0.16em",
                                            textTransform: "uppercase",
                                            fontWeight: 700,
                                            marginTop: 2,
                                        }}
                                    >
                                        Gross sales
                                    </span>
                                </div>

                                <div style={{ opacity: chartIn, display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Daily gross
                                    </span>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 96 }}>
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
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
                                        paddingTop: 16,
                                        borderTop: `1px solid ${theme.divider}`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        By channel
                                    </span>
                                    {[
                                        { label: "Shopify", pct: 78, value: "$5,626" },
                                        { label: "Square", pct: 55, value: "$3,948" },
                                        { label: "Amazon", pct: 30, value: "$2,184" },
                                    ].map((b) => (
                                        <div key={b.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: 13,
                                                }}
                                            >
                                                <span style={{ color: theme.onBackground, fontWeight: 700 }}>
                                                    {b.label}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                                                        color: theme.onBackground,
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {b.value}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    height: 5,
                                                    borderRadius: 999,
                                                    background: theme.divider,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width: `${b.pct * breakdownIn}%`,
                                                        background: theme.onBackground,
                                                        borderRadius: 999,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 30,
                                    right: 28,
                                    background: theme.background,
                                    border: `1.5px solid ${theme.brand}`,
                                    borderRadius: 6,
                                    padding: "10px 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    opacity: sentIn,
                                    transform: `translateY(${sentLift}px)`,
                                    boxShadow: "0 14px 36px -20px rgba(0,50,32,0.24)",
                                }}
                            >
                                <Img
                                    src={staticFile("logos/third_party/gmail.png")}
                                    style={{ width: 22, height: 22, objectFit: "contain" }}
                                />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 800,
                                            color: theme.onBackground,
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        Sent to myEmail@gmail.com
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 10,
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
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
