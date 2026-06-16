import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { theme } from "../theme";

const PROMPT = "How am I doing against @yardbirdsupply on Instagram this week?";

const PHASE_PROMPT_END = 92;
const PHASE_TOOLS_START = 112;
const PHASE_TOOLS_END = 210;
const PHASE_RESULT_START = 220;

type Tool = {
    label: string;
    sub: string;
    offset: number;
    color: string;
    render: () => React.ReactNode;
};

const InstagramMark = () => (
    <div
        style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background:
                "linear-gradient(135deg, #f9ce34, #ee2a7b 45%, #6228d7)",
            position: "relative",
        }}
    >
        <div
            style={{
                position: "absolute",
                inset: 5,
                border: "1.5px solid white",
                borderRadius: 5,
            }}
        />
        <div
            style={{
                position: "absolute",
                left: 10,
                top: 10,
                width: 6,
                height: 6,
                border: "1.5px solid white",
                borderRadius: 999,
            }}
        />
    </div>
);

const MetaMark = () => (
    <div
        style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "linear-gradient(135deg, #0064e0, #00a6ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "-0.06em",
        }}
    >
        ∞
    </div>
);

const ApifyMark = () => (
    <div
        style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "#97d700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0c1a00",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "-0.04em",
        }}
    >
        A
    </div>
);

const SearchMark = () => (
    <div
        style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: theme.background,
            border: `1.5px solid ${theme.onBackground}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.onBackground,
            position: "relative",
        }}
    >
        <div
            style={{
                width: 9,
                height: 9,
                border: `1.5px solid ${theme.onBackground}`,
                borderRadius: 999,
                position: "absolute",
                top: 6,
                left: 6,
            }}
        />
        <div
            style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                width: 1.5,
                height: 7,
                background: theme.onBackground,
                transform: "rotate(45deg)",
                transformOrigin: "top",
            }}
        />
    </div>
);

const TOOLS: Tool[] = [
    {
        label: "Instagram",
        sub: "Profiles, posts, reels",
        offset: 0,
        color: "#ee2a7b",
        render: () => <InstagramMark />,
    },
    {
        label: "Apify",
        sub: "Web scrape, public data",
        offset: 16,
        color: "#97d700",
        render: () => <ApifyMark />,
    },
    {
        label: "Meta Graph",
        sub: "Reach, impressions",
        offset: 32,
        color: "#0064e0",
        render: () => <MetaMark />,
    },
    {
        label: "Web search",
        sub: "Mentions, press",
        offset: 48,
        color: theme.onBackground,
        render: () => <SearchMark />,
    },
];

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
            { label: "Engagement", value: "4.2%" },
            { label: "Reels", value: "2" },
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
            { label: "Engagement", value: "6.8%" },
            { label: "Reels", value: "5" },
            { label: "Saves", value: "1,840" },
        ],
        isYou: false,
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
    const sentLift = interpolate(frame, [PHASE_PROMPT_END, PHASE_PROMPT_END + 16], [0, -10], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const sentFade = interpolate(frame, [PHASE_PROMPT_END, PHASE_PROMPT_END + 16], [1, 0.55], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const collapse = interpolate(frame, [PHASE_RESULT_START, PHASE_RESULT_START + 18], [1, 0], {
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
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 16px 40px -24px rgba(0,50,32,0.22)",
                transform: `translateY(${sentLift}px) scaleY(${collapse})`,
                transformOrigin: "top",
                opacity: sentFade * collapse,
                marginBottom: collapse > 0 ? 24 : -100,
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

function ToolChip({
    tool,
    frame,
}: {
    tool: Tool;
    frame: number;
}) {
    const appearAt = PHASE_TOOLS_START + tool.offset;
    const op = interpolate(frame - appearAt, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearAt, [0, 14], [8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const dotPulse = interpolate(
        ((frame - appearAt) % 30) / 30,
        [0, 0.5, 1],
        [0.3, 1, 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const collapsed = interpolate(frame, [PHASE_TOOLS_END, PHASE_TOOLS_END + 18], [1, 0.7], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                background: theme.background,
                border: `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 999,
                padding: "10px 16px 10px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                opacity: op * collapsed,
                transform: `translateY(${lift}px)`,
                boxShadow: "0 6px 16px -12px rgba(0,50,32,0.16)",
            }}
        >
            {tool.render()}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: theme.onBackground,
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                    }}
                >
                    {tool.label}
                </span>
                <span
                    style={{
                        fontSize: 10,
                        color: theme.onBackgroundSecondary,
                        letterSpacing: "0.1em",
                        marginTop: 3,
                        fontWeight: 600,
                    }}
                >
                    {tool.sub}
                </span>
            </div>
            <span
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: theme.brand,
                    opacity: dotPulse,
                    marginLeft: 4,
                }}
            />
        </div>
    );
}

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
    const op = interpolate(t, [0, 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const scale = interpolate(t, [0, 14], [0.94, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const likeIn = interpolate(t, [18, 30], [0, 1], {
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
                        background: "rgba(0,0,0,0.32)",
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
    const op = interpolate(frame - appearFrame, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const lift = interpolate(frame - appearFrame, [0, 18], [12, 0], {
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
                padding: "20px 22px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                opacity: op,
                transform: `translateY(${lift}px)`,
                boxShadow: account.isYou
                    ? "0 24px 60px -28px rgba(0,50,32,0.28)"
                    : "0 12px 32px -22px rgba(0,50,32,0.18)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: account.avatarGrad,
                        border: `2px solid ${theme.background}`,
                        boxShadow: `0 0 0 1.5px ${theme.dividerStrong}`,
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                            style={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: theme.onBackground,
                                letterSpacing: "-0.01em",
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
                                    padding: "2px 6px",
                                    borderRadius: 3,
                                    fontWeight: 800,
                                    letterSpacing: "0.14em",
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
                            letterSpacing: "0.04em",
                            fontWeight: 600,
                            marginTop: 1,
                        }}
                    >
                        {account.followers} followers
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {account.posts.map((p, i) => (
                    <PostTile
                        key={i}
                        tile={p}
                        delay={appearFrame + 14 + i * 6}
                        frame={frame}
                    />
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    paddingTop: 14,
                    borderTop: `1px solid ${theme.divider}`,
                    gap: 10,
                }}
            >
                {account.metrics.map((m, i) => {
                    const metricIn = interpolate(
                        frame - (appearFrame + 60 + i * 4),
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
                                    fontWeight: 800,
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
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                <Composer frame={frame} />

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 14,
                        justifyContent: "center",
                        opacity: interpolate(
                            frame,
                            [PHASE_RESULT_START, PHASE_RESULT_START + 18],
                            [1, 0],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                        ),
                    }}
                >
                    {TOOLS.map((t) => (
                        <ToolChip key={t.label} tool={t} frame={frame} />
                    ))}
                </div>

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
                                    appearFrame={PHASE_RESULT_START + i * 14}
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
