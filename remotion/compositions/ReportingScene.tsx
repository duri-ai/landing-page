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

const PROMPT = "Every Monday at 9am, email a weekly close PDF to ops@.";

const PHASE_PROMPT_END = 90;
const PHASE_SOURCES_START = 110;

type Source = {
    logoSrc: string | null;
    label: string;
    metric: string;
    metricLabel: string;
    appearOffset: number;
    flowOffset: number;
};

const SOURCES: Source[] = [
    {
        logoSrc: "logos/third_party/square.png",
        label: "Square",
        metric: "$4,820",
        metricLabel: "POS sales",
        appearOffset: 0,
        flowOffset: 80,
    },
    {
        logoSrc: "logos/third_party/google.svg",
        label: "Google Ads",
        metric: "$1,240",
        metricLabel: "Ad spend",
        appearOffset: 10,
        flowOffset: 110,
    },
    {
        logoSrc: "logos/third_party/shopify.svg",
        label: "Shopify",
        metric: "142",
        metricLabel: "Orders",
        appearOffset: 20,
        flowOffset: 140,
    },
    {
        logoSrc: "logos/third_party/clover.svg",
        label: "Clover",
        metric: "$3,180",
        metricLabel: "POS sales",
        appearOffset: 30,
        flowOffset: 170,
    },
];

function Composer({ frame }: { frame: number }) {
    const visibleChars = Math.max(
        0,
        Math.min(
            PROMPT.length,
            Math.floor(interpolate(frame, [12, 78], [0, PROMPT.length])),
        ),
    );
    const visible = PROMPT.slice(0, visibleChars);
    const sentLift = interpolate(frame, [PHASE_PROMPT_END, PHASE_PROMPT_END + 16], [0, -12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sentFade = interpolate(frame, [PHASE_PROMPT_END, PHASE_PROMPT_END + 16], [1, 0.55], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const caretOn = Math.floor(frame / 8) % 2 === 0;
    const showCaret = frame < PHASE_PROMPT_END;
    return (
        <div
            style={{
                background: theme.background,
                border: `1.5px solid ${theme.onBackground}`,
                borderRadius: 8,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 16px 40px -24px rgba(0,50,32,0.22)",
                transform: `translateY(${sentLift}px)`,
                opacity: sentFade,
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: theme.onBackgroundSecondary,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                }}
            >
                You
            </div>
            <div
                style={{
                    fontSize: 22,
                    lineHeight: 1.35,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    minHeight: 64,
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
    const appearAt = PHASE_SOURCES_START + src.appearOffset;
    const appear = interpolate(frame - appearAt, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearAt, [0, 16], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const flowAt = PHASE_SOURCES_START + src.flowOffset;
    const pulse = interpolate(frame - flowAt, [0, 8, 24], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                position: "relative",
                width: 380,
                background: theme.background,
                border: `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 7,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: appear,
                transform: `translateY(${lift}px)`,
                boxShadow: "0 10px 28px -22px rgba(0,50,32,0.18)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: 9,
                    border: `2px solid ${theme.brand}`,
                    opacity: pulse,
                    pointerEvents: "none",
                }}
            />
            {src.logoSrc ? (
                <Img src={staticFile(src.logoSrc)} style={{ width: 32, height: 32 }} />
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: theme.onBackground,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                    }}
                >
                    {src.label}
                </span>
                <span
                    style={{
                        fontSize: 11,
                        color: theme.onBackgroundSecondary,
                        marginTop: 4,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                    }}
                >
                    {src.metricLabel}
                </span>
            </div>
            <span
                style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 20,
                    color: theme.onBackground,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                }}
            >
                {src.metric}
            </span>
        </div>
    );
}

export const ReportingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const stageIn = spring({ frame, fps, config: { damping: 200 } });

    const PDF_APPEAR = PHASE_SOURCES_START + 40;
    const pdfIn = interpolate(frame - PDF_APPEAR, [0, 24], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pdfLift = interpolate(frame - PDF_APPEAR, [0, 24], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const PDF_CONTENT_START = PHASE_SOURCES_START + 220;
    const contentIn = interpolate(frame - PDF_CONTENT_START, [0, 26], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const SENT_BADGE = PHASE_SOURCES_START + 280;
    const sentIn = interpolate(frame - SENT_BADGE, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sentLift = interpolate(frame - SENT_BADGE, [0, 18], [8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const chartBars = [42, 56, 38, 64, 48, 72, 60, 54, 68, 76, 58, 62, 70, 80];

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
                    padding: "70px 90px",
                    opacity: stageIn,
                    display: "flex",
                    alignItems: "stretch",
                    gap: 60,
                }}
            >
                <div
                    style={{
                        flex: "0 0 460px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                    }}
                >
                    <Composer frame={frame} />
                    {SOURCES.map((s) => (
                        <SourceCard key={s.label} src={s} frame={frame} />
                    ))}
                </div>

                <div style={{ flex: 1, position: "relative" }}>
                    {SOURCES.map((s, idx) => {
                        const flowAt = PHASE_SOURCES_START + s.flowOffset;
                        const t = (frame - flowAt) / 22;
                        if (t < 0 || t > 1.2) return null;
                        const x = interpolate(t, [0, 1], [0, 100], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const startY = ((idx + 1.6) / (SOURCES.length + 1)) * 100;
                        const y = interpolate(t, [0, 1], [startY, 50], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const op = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
                        return (
                            <div
                                key={s.label}
                                style={{
                                    position: "absolute",
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    background: theme.brand,
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: `0 0 14px ${theme.brand}`,
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
                            flexDirection: "column",
                            justifyContent: "center",
                            opacity: pdfIn,
                            transform: `translateY(${pdfLift}px)`,
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto",
                                width: 540,
                                height: 720,
                                background: theme.background,
                                border: `1.5px solid ${theme.onBackground}`,
                                borderRadius: 4,
                                boxShadow: "0 40px 100px -36px rgba(0,50,32,0.35)",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 18,
                                    right: 18,
                                    background: "#d33b3b",
                                    color: "#fff",
                                    padding: "4px 10px",
                                    borderRadius: 3,
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.16em",
                                }}
                            >
                                PDF
                            </div>
                            <div style={{ padding: "30px 36px 24px" }}>
                                <span
                                    style={{
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                                        fontSize: 12,
                                        color: theme.onBackgroundSecondary,
                                        letterSpacing: "0.16em",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    weekly_close.pdf
                                </span>
                                <div
                                    style={{
                                        marginTop: 12,
                                        height: 1,
                                        background: theme.divider,
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    padding: "0 36px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 26,
                                    opacity: contentIn,
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.16em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Net revenue, May 5 to May 11
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 14,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 44,
                                                fontWeight: 600,
                                                color: theme.onBackground,
                                                letterSpacing: "-0.02em",
                                                lineHeight: 1,
                                            }}
                                        >
                                            $9,240
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                color: theme.brand,
                                                fontWeight: 700,
                                            }}
                                        >
                                            +12.4%
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: theme.onBackgroundSecondary,
                                            fontWeight: 700,
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Daily revenue
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                            gap: 4,
                                            height: 110,
                                        }}
                                    >
                                        {chartBars.map((h, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    flex: 1,
                                                    background:
                                                        i === chartBars.length - 1
                                                            ? theme.brand
                                                            : theme.onBackground,
                                                    height: `${h * contentIn}%`,
                                                    borderRadius: 2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: 18,
                                        paddingTop: 18,
                                        borderTop: `1px solid ${theme.divider}`,
                                    }}
                                >
                                    {[
                                        { label: "POS sales", value: "$8,000" },
                                        { label: "Ad spend", value: "$1,240" },
                                        { label: "Orders", value: "142" },
                                    ].map((m) => (
                                        <div
                                            key={m.label}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 4,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    color: theme.onBackgroundSecondary,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.14em",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                {m.label}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                                    fontSize: 22,
                                                    fontWeight: 700,
                                                    color: theme.onBackground,
                                                    letterSpacing: "-0.01em",
                                                }}
                                            >
                                                {m.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                bottom: 60,
                                right: 60,
                                background: theme.background,
                                border: `1.5px solid ${theme.brand}`,
                                borderRadius: 5,
                                padding: "10px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                opacity: sentIn,
                                transform: `translateY(${sentLift}px)`,
                                boxShadow: "0 12px 32px -20px rgba(0,50,32,0.22)",
                            }}
                        >
                            <Img
                                src={staticFile("logos/third_party/gmail.svg")}
                                style={{ width: 22, height: 22 }}
                            />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: theme.onBackground,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Sent to ops@
                                </span>
                                <span
                                    style={{
                                        fontSize: 10,
                                        color: theme.onBackgroundSecondary,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        fontWeight: 600,
                                        marginTop: 1,
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
