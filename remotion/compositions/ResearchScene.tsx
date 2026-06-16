import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { theme } from "../theme";

type Tile = {
    grad: string;
    likes: string;
    isReel?: boolean;
};

type Account = {
    handle: string;
    avatarGrad: string;
    followers: string;
    posts: Tile[];
    metrics: { label: string; value: string }[];
    isYou: boolean;
};

const ACCOUNTS: Account[] = [
    {
        handle: "@blackpinegoods",
        avatarGrad: `linear-gradient(135deg, ${theme.brand}, ${theme.brandDark})`,
        followers: "8.4k",
        posts: [
            { grad: "linear-gradient(135deg, #f4d4a1, #c08454)", likes: "1,204" },
            { grad: "linear-gradient(160deg, #2e4f3b, #143025)", likes: "892", isReel: true },
            { grad: "linear-gradient(120deg, #e8d9c2, #a37e4e)", likes: "1,508" },
            { grad: "linear-gradient(135deg, #c4a784, #5d4226)", likes: "744" },
        ],
        metrics: [
            { label: "Avg engagement", value: "4.2%" },
            { label: "Reels / week", value: "2" },
            { label: "Saves", value: "612" },
        ],
        isYou: true,
    },
    {
        handle: "@yardbirdsupply",
        avatarGrad: `linear-gradient(135deg, #c97a5c, #6a3621)`,
        followers: "21.6k",
        posts: [
            { grad: "linear-gradient(135deg, #d29a7e, #6f3a26)", likes: "3,420" },
            { grad: "linear-gradient(140deg, #f0c8a8, #8a5630)", likes: "2,118", isReel: true },
            { grad: "linear-gradient(160deg, #5c3a26, #2a1810)", likes: "1,884", isReel: true },
            { grad: "linear-gradient(130deg, #e3b48a, #9a6738)", likes: "2,706" },
        ],
        metrics: [
            { label: "Avg engagement", value: "6.8%" },
            { label: "Reels / week", value: "5" },
            { label: "Saves", value: "1,840" },
        ],
        isYou: false,
    },
];

function PostTile({
    tile,
    delay,
    frame,
}: {
    tile: Tile;
    delay: number;
    frame: number;
}) {
    const t = frame - delay;
    const op = interpolate(t, [0, 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const scale = interpolate(t, [0, 12], [0.94, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const likeIn = interpolate(t, [16, 28], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "1 / 1",
                background: tile.grad,
                borderRadius: 4,
                opacity: op,
                transform: `scale(${scale})`,
                overflow: "hidden",
                boxShadow: "0 6px 18px -10px rgba(0,50,32,0.25)",
            }}
        >
            {tile.isReel ? (
                <div
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 22,
                        height: 22,
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(6px)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 12,
                    }}
                >
                    ▶
                </div>
            ) : null}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                    padding: "20px 10px 8px",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    opacity: likeIn,
                }}
            >
                <span style={{ fontSize: 12, opacity: 0.9 }}>♥</span>
                <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {tile.likes}
                </span>
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
    const op = interpolate(frame - appearFrame, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearFrame, [0, 14], [12, 0], {
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
                borderRadius: 8,
                padding: "22px 24px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                opacity: op,
                transform: `translateY(${lift}px)`,
                boxShadow: account.isYou
                    ? "0 20px 60px -28px rgba(0,50,32,0.28)"
                    : "0 10px 32px -22px rgba(0,50,32,0.18)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
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
                                fontSize: 18,
                                fontWeight: 600,
                                color: theme.onBackground,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {account.handle}
                        </span>
                        {account.isYou ? (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: theme.brand,
                                    background: theme.brandSoft,
                                    border: `1px solid ${theme.brand}`,
                                    padding: "2px 6px",
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    letterSpacing: "0.12em",
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
                            letterSpacing: "0.04em",
                            fontWeight: 500,
                            marginTop: 1,
                        }}
                    >
                        {account.followers} followers
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {account.posts.map((p, i) => (
                    <PostTile
                        key={i}
                        tile={p}
                        delay={appearFrame + 8 + i * 6}
                        frame={frame}
                    />
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    paddingTop: 16,
                    borderTop: `1px solid ${theme.divider}`,
                    gap: 12,
                }}
            >
                {account.metrics.map((m, i) => {
                    const metricIn = interpolate(
                        frame - (appearFrame + 50 + i * 4),
                        [0, 14],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    return (
                        <div
                            key={m.label}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                opacity: metricIn,
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
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: theme.onBackground,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {m.value}
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
                    padding: "70px 100px",
                    opacity: stageIn,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 50,
                }}
            >
                {ACCOUNTS.map((acct, i) => (
                    <div key={acct.handle} style={{ flex: 1 }}>
                        <AccountCard account={acct} appearFrame={i * 14} frame={frame} />
                    </div>
                ))}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
