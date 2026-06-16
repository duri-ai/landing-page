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

const PROMPT = "How am I doing against @your.rival this week?";
const PROMPT_END = 92;
const RESULT_START = 130;

type Account = {
    handle: string;
    avatarGrad: string;
    photoSrc: string;
    caption: string;
    timeAgo: string;
    isYou: boolean;
    stats: { label: string; value: string; emphasize?: boolean }[];
};

const ACCOUNTS: Account[] = [
    {
        handle: "@yourshop",
        avatarGrad: `linear-gradient(135deg, ${theme.brand}, ${theme.brandDark})`,
        photoSrc: "research_photos/yours.jpg",
        caption: "Lemon tart, back on the counter all week.",
        timeAgo: "3 days ago",
        isYou: true,
        stats: [
            { label: "Reach", value: "24.1k", emphasize: true },
            { label: "Engagement", value: "4.2%" },
            { label: "Saves", value: "612" },
        ],
    },
    {
        handle: "@your.rival",
        avatarGrad: `linear-gradient(135deg, #c97a5c, #6a3621)`,
        photoSrc: "research_photos/rival.jpg",
        caption: "New small batch, every Friday at 7.",
        timeAgo: "2 days ago",
        isYou: false,
        stats: [
            { label: "Reach", value: "58.7k", emphasize: true },
            { label: "Engagement", value: "6.8%" },
            { label: "Saves", value: "1,840" },
        ],
    },
];

function Composer({ frame }: { frame: number }) {
    const visibleChars = Math.max(
        0,
        Math.min(
            PROMPT.length,
            Math.floor(interpolate(frame, [10, 80], [0, PROMPT.length])),
        ),
    );
    const visible = PROMPT.slice(0, visibleChars);
    const collapse = interpolate(frame, [RESULT_START - 30, RESULT_START - 4], [1, 0], {
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
                padding: "22px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 18px 44px -24px rgba(0,50,32,0.24)",
                transform: `scaleY(${collapse})`,
                transformOrigin: "top",
                opacity: collapse,
                marginBottom: collapse > 0 ? 20 : -200,
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
                    fontSize: 26,
                    lineHeight: 1.4,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    minHeight: 44,
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

function AccountCard({
    account,
    appearFrame,
    frame,
}: {
    account: Account;
    appearFrame: number;
    frame: number;
}) {
    const op = interpolate(frame - appearFrame, [0, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearFrame, [0, 22], [16, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const photoIn = interpolate(frame - (appearFrame + 8), [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                background: theme.background,
                border: account.isYou
                    ? `1.5px solid ${theme.onBackground}`
                    : `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 10,
                padding: "28px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 22,
                opacity: op,
                transform: `translateY(${lift}px)`,
                boxShadow: account.isYou
                    ? "0 32px 80px -32px rgba(0,50,32,0.36)"
                    : "0 16px 40px -24px rgba(0,50,32,0.22)",
                height: "100%",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        background: account.avatarGrad,
                        border: `2px solid ${theme.background}`,
                        boxShadow: `0 0 0 1.5px ${theme.dividerStrong}`,
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                            style={{
                                fontSize: 24,
                                fontWeight: 800,
                                color: theme.onBackground,
                                letterSpacing: "-0.012em",
                            }}
                        >
                            {account.handle}
                        </span>
                        {account.isYou ? (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: theme.brandDark,
                                    background: theme.brandSoft,
                                    border: `1px solid ${theme.brand}`,
                                    padding: "3px 7px",
                                    borderRadius: 3,
                                    fontWeight: 800,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                }}
                            >
                                You
                            </span>
                        ) : null}
                    </div>
                    <span
                        style={{
                            fontSize: 13,
                            color: theme.onBackgroundSecondary,
                            fontWeight: 600,
                            marginTop: 2,
                            letterSpacing: "0.04em",
                        }}
                    >
                        Top post · {account.timeAgo}
                    </span>
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: 6,
                    overflow: "hidden",
                    background: theme.backgroundWarm,
                    opacity: photoIn,
                }}
            >
                <Img
                    src={staticFile(account.photoSrc)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            <p
                style={{
                    fontSize: 15,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.45,
                    margin: 0,
                }}
            >
                {account.caption}
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 16,
                    paddingTop: 20,
                    borderTop: `1px solid ${theme.divider}`,
                }}
            >
                {account.stats.map((s, i) => {
                    const inFrame = interpolate(
                        frame - (appearFrame + 60 + i * 4),
                        [0, 16],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    return (
                        <div
                            key={s.label}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                opacity: inFrame,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 11,
                                    color: theme.onBackgroundSecondary,
                                    fontWeight: 800,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {s.label}
                            </span>
                            <span
                                style={{
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    fontSize: s.emphasize ? 30 : 24,
                                    fontWeight: 800,
                                    color: theme.onBackground,
                                    letterSpacing: "-0.012em",
                                    lineHeight: 1,
                                }}
                            >
                                {s.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const ResearchScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const stageIn = spring({ frame, fps, config: { damping: 200 } });

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
                    padding: "60px 100px",
                    opacity: stageIn,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                <Composer frame={frame} />

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "center",
                        gap: 40,
                    }}
                >
                    {ACCOUNTS.map((acct, i) => (
                        <div key={acct.handle} style={{ flex: 1, display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                <AccountCard
                                    account={acct}
                                    appearFrame={RESULT_START + i * 14}
                                    frame={frame}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
