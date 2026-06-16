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
const RESULT_START = 120;

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
                padding: "20px 22px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                opacity: op,
                boxShadow: account.isYou
                    ? "0 28px 70px -28px rgba(0,50,32,0.34)"
                    : "0 14px 38px -22px rgba(0,50,32,0.22)",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 999,
                        background: account.avatarGrad,
                        border: `2px solid ${theme.background}`,
                        boxShadow: `0 0 0 1.5px ${theme.dividerStrong}`,
                        flexShrink: 0,
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
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
                                    fontSize: 9,
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
                            fontSize: 12,
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
                    aspectRatio: "16 / 9",
                    borderRadius: 6,
                    overflow: "hidden",
                    background: theme.backgroundWarm,
                    opacity: photoIn,
                    flex: "0 0 auto",
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
                    fontSize: 16,
                    color: theme.onBackground,
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.4,
                    margin: 0,
                }}
            >
                {account.caption}
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 14,
                    paddingTop: 14,
                    borderTop: `1px solid ${theme.divider}`,
                    marginTop: "auto",
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
                                minWidth: 0,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
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
                                    fontSize: s.emphasize ? 30 : 23,
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
                    padding: "50px 80px",
                    opacity: stageIn,
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                <Composer frame={frame} />

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 30,
                        minHeight: 0,
                    }}
                >
                    {ACCOUNTS.map((acct, i) => (
                        <div
                            key={acct.handle}
                            style={{
                                flex: "1 1 0",
                                minWidth: 0,
                                display: "flex",
                            }}
                        >
                            <AccountCard
                                account={acct}
                                appearFrame={RESULT_START + i * 12}
                                frame={frame}
                            />
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
