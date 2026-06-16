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

type Source = {
    logoSrc: string | null;
    label: string;
    metric: string;
    metricLabel: string;
    appearFrame: number;
    flowFrame: number;
};

const SOURCES: Source[] = [
    {
        logoSrc: "logos/third_party/square.png",
        label: "Square",
        metric: "$4,820",
        metricLabel: "POS sales",
        appearFrame: 10,
        flowFrame: 70,
    },
    {
        logoSrc: "logos/third_party/google.svg",
        label: "Google Ads",
        metric: "$1,240",
        metricLabel: "Ad spend",
        appearFrame: 20,
        flowFrame: 82,
    },
    {
        logoSrc: "logos/third_party/shopify.svg",
        label: "Shopify",
        metric: "142",
        metricLabel: "Orders",
        appearFrame: 30,
        flowFrame: 94,
    },
    {
        logoSrc: "logos/third_party/clover.svg",
        label: "Clover",
        metric: "$3,180",
        metricLabel: "POS sales",
        appearFrame: 40,
        flowFrame: 106,
    },
];

const PDF_BUILD_START = 110;

function SourceCard({ src, frame }: { src: Source; frame: number }) {
    const appear = interpolate(frame - src.appearFrame, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - src.appearFrame, [0, 16], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pulse = interpolate(frame - src.flowFrame, [0, 8, 20], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                position: "relative",
                width: 340,
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
            ) : (
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: theme.onBackground,
                        color: theme.onBrand,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                    }}
                >
                    {src.label[0]}
                </div>
            )}
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
                        fontSize: 12,
                        color: theme.onBackgroundSecondary,
                        marginTop: 4,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontWeight: 600,
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

    const pdfHeaderIn = interpolate(frame - PDF_BUILD_START, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pdfHeaderLift = interpolate(frame - PDF_BUILD_START, [0, 14], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pdfChartIn = interpolate(frame - (PDF_BUILD_START + 10), [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const pdfRowsIn = interpolate(frame - (PDF_BUILD_START + 24), [0, 18], [0, 1], {
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
                    padding: "80px 100px",
                    opacity: stageIn,
                    display: "flex",
                    alignItems: "center",
                    gap: 50,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        position: "relative",
                    }}
                >
                    {SOURCES.map((s) => (
                        <SourceCard key={s.label} src={s} frame={frame} />
                    ))}
                </div>

                <div style={{ flex: 1, position: "relative", height: 660 }}>
                    {SOURCES.map((s) => {
                        const t = (frame - s.flowFrame) / 16;
                        if (t < 0 || t > 1.2) return null;
                        const x = interpolate(t, [0, 1], [0, 100], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const startY = ((SOURCES.indexOf(s) + 0.5) / SOURCES.length) * 100;
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
                                    boxShadow: `0 0 12px ${theme.brand}`,
                                    opacity: op,
                                }}
                            />
                        );
                    })}

                    <div
                        style={{
                            background: theme.background,
                            border: `1.5px solid ${theme.onBackground}`,
                            borderRadius: 6,
                            overflow: "hidden",
                            boxShadow: "0 30px 80px -32px rgba(0,50,32,0.32)",
                            display: "flex",
                            flexDirection: "column",
                            height: 660,
                        }}
                    >
                        <div
                            style={{
                                background: theme.onBackground,
                                color: theme.onBrand,
                                padding: "12px 22px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 999,
                                    background: theme.onBrand,
                                    opacity: 0.6,
                                }}
                            />
                            <span
                                style={{
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    fontSize: 13,
                                    letterSpacing: "0.14em",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                }}
                            >
                                weekly_close.pdf
                            </span>
                        </div>
                        <div style={{ padding: "32px 36px", flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
                            <div
                                style={{
                                    opacity: pdfHeaderIn,
                                    transform: `translateY(${pdfHeaderLift}px)`,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: "0.16em",
                                        textTransform: "uppercase",
                                        color: theme.onBackgroundSecondary,
                                    }}
                                >
                                    Weekly close · May 5 to May 11
                                </span>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 14,
                                        marginTop: 2,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 38,
                                            fontWeight: 600,
                                            color: theme.onBackground,
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        $9,240
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            color: theme.brand,
                                            fontWeight: 600,
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        +12.4%
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: theme.onBackgroundSecondary,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Net revenue
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    opacity: pdfChartIn,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
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
                                        gap: 5,
                                        height: 130,
                                    }}
                                >
                                    {chartBars.map((h, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                flex: 1,
                                                background:
                                                    i === chartBars.length - 1 ? theme.brand : theme.onBackground,
                                                height: `${h * pdfChartIn}%`,
                                                borderRadius: 2,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                                        fontSize: 11,
                                        color: theme.onBackgroundSecondary,
                                    }}
                                >
                                    <span>Apr 28</span>
                                    <span>May 11</span>
                                </div>
                            </div>

                            <div
                                style={{
                                    opacity: pdfRowsIn,
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: 24,
                                    paddingTop: 24,
                                    borderTop: `1px solid ${theme.divider}`,
                                }}
                            >
                                {[
                                    { label: "POS sales", value: "$8,000" },
                                    { label: "Ad spend", value: "$1,240" },
                                    { label: "Orders", value: "142" },
                                ].map((m) => (
                                    <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span
                                            style={{
                                                fontSize: 11,
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
                                                fontWeight: 600,
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
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
