import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const ReportingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = spring({ frame, fps, config: { damping: 200 } });

    return (
        <AbsoluteFill style={{ background: theme.background, fontFamily: theme.fontFamily }}>
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, ${theme.brand} 8%, transparent) 0%, transparent 70%)`,
                }}
            />
            <AbsoluteFill
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: fadeIn,
                }}
            >
                <div
                    style={{
                        fontSize: 96,
                        fontWeight: 500,
                        letterSpacing: "-0.024em",
                        color: theme.onBackground,
                    }}
                >
                    <span style={{ color: theme.brand }}>Reporting</span> scene
                </div>
            </AbsoluteFill>
            <AbsoluteFill
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 80,
                    opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
                }}
            >
                <div
                    style={{
                        fontSize: 20,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: theme.onBackgroundSecondary,
                        fontWeight: 600,
                    }}
                >
                    Sources to a single PDF, in plain language
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
