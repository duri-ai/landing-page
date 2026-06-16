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

type Order = {
    storeFrame: number;
    syncFrame: number;
    storeIndex: number;
    rowIndex: number;
    orderNo: string;
    line: string;
    qtyDelta: number;
};

const STORES = [
    { name: "Storefront ATL" },
    { name: "Storefront LAX" },
    { name: "Storefront YYZ" },
];

const SKUS = [
    { sku: "TEE-BLK-M", item: "Cotton Tee, Black, M", startQty: 32 },
    { sku: "TOTE-NAT", item: "Canvas Tote, Natural", startQty: 18 },
    { sku: "HAT-OLV", item: "5-Panel Cap, Olive", startQty: 24 },
    { sku: "MUG-12OZ", item: "Stoneware Mug, 12oz", startQty: 46 },
    { sku: "PIN-STAR", item: "Enamel Pin, Star", startQty: 58 },
];

const ORDERS: Order[] = [
    { storeFrame: 24, syncFrame: 48, storeIndex: 0, rowIndex: 0, orderNo: "#10247", line: "Cotton Tee × 2", qtyDelta: -2 },
    { storeFrame: 72, syncFrame: 96, storeIndex: 1, rowIndex: 3, orderNo: "#7813", line: "Stoneware Mug × 1", qtyDelta: -1 },
    { storeFrame: 120, syncFrame: 144, storeIndex: 2, rowIndex: 1, orderNo: "#3091", line: "Canvas Tote × 3", qtyDelta: -3 },
];

const PARTICLE_DURATION = 18;

function StoreCard({
    name,
    activeOrder,
    frame,
}: {
    name: string;
    activeOrder?: Order;
    frame: number;
}) {
    const ordVisible = activeOrder
        ? interpolate(
              frame - activeOrder.storeFrame,
              [0, 10, 60, 70],
              [0, 1, 1, 0.7],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        : 0;
    const lift = activeOrder
        ? interpolate(frame - activeOrder.storeFrame, [0, 12], [6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
          })
        : 0;
    const pulse = activeOrder
        ? interpolate(
              frame - activeOrder.storeFrame,
              [0, 14, 28],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        : 0;

    return (
        <div
            style={{
                position: "relative",
                width: 380,
                background: theme.background,
                border: `1.5px solid ${theme.dividerStrong}`,
                borderRadius: 8,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 12px 32px -20px rgba(0,50,32,0.18)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: 10,
                    border: `2px solid ${theme.brand}`,
                    opacity: pulse,
                    pointerEvents: "none",
                }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Img
                    src={staticFile("logos/third_party/shopify.svg")}
                    style={{ width: 36, height: 36 }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: theme.onBackground,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.1,
                        }}
                    >
                        {name}
                    </span>
                    <span
                        style={{
                            fontSize: 13,
                            color: theme.onBackgroundSecondary,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            marginTop: 2,
                        }}
                    >
                        Live
                    </span>
                </div>
            </div>

            {activeOrder ? (
                <div
                    style={{
                        opacity: ordVisible,
                        transform: `translateY(${lift}px)`,
                        background: theme.brandSoft,
                        border: `1px solid ${theme.brand}`,
                        borderRadius: 5,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                            style={{
                                fontSize: 12,
                                color: theme.brandDark,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                            }}
                        >
                            Order {activeOrder.orderNo}
                        </span>
                        <span
                            style={{
                                fontSize: 16,
                                color: theme.onBackground,
                                fontWeight: 500,
                                marginTop: 2,
                            }}
                        >
                            {activeOrder.line}
                        </span>
                    </div>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 999,
                            background: theme.brand,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        height: 56,
                        background: theme.backgroundWarm,
                        border: `1px dashed ${theme.divider}`,
                        borderRadius: 5,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 12,
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            color: theme.onBackgroundSecondary,
                            letterSpacing: "0.04em",
                        }}
                    >
                        —
                    </span>
                </div>
            )}
        </div>
    );
}

function SheetRow({
    sku,
    item,
    qty,
    highlight,
    deltaText,
}: {
    sku: string;
    item: string;
    qty: number;
    highlight: number;
    deltaText: string | null;
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 100px 110px",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: `1px solid ${theme.divider}`,
                background:
                    highlight > 0
                        ? `color-mix(in oklch, ${theme.brandSoft} ${Math.round(highlight * 100)}%, ${theme.background})`
                        : theme.background,
                transition: "background 200ms ease",
            }}
        >
            <span
                style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 14,
                    color: theme.onBackgroundSecondary,
                    letterSpacing: "0.02em",
                }}
            >
                {sku}
            </span>
            <span style={{ fontSize: 16, color: theme.onBackground, fontWeight: 500 }}>
                {item}
            </span>
            <span
                style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 18,
                    color: theme.onBackground,
                    fontWeight: 600,
                    textAlign: "right",
                }}
            >
                {qty}
            </span>
            <span
                style={{
                    textAlign: "right",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 14,
                    color: deltaText ? theme.brand : theme.onBackgroundSecondary,
                    fontWeight: 600,
                    opacity: deltaText ? interpolate(highlight, [0, 0.3, 1], [0, 1, 1]) : 0.4,
                }}
            >
                {deltaText ?? "—"}
            </span>
        </div>
    );
}

export const OperationsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const stageIn = spring({ frame, fps, config: { damping: 200 } });

    const qtys = SKUS.map((s) => s.startQty);
    const highlights: number[] = SKUS.map(() => 0);
    const deltas: (string | null)[] = SKUS.map(() => null);

    for (const o of ORDERS) {
        if (frame >= o.syncFrame) {
            qtys[o.rowIndex] = SKUS[o.rowIndex].startQty + o.qtyDelta;
            deltas[o.rowIndex] = `${o.qtyDelta}`;
            highlights[o.rowIndex] = Math.max(
                highlights[o.rowIndex],
                interpolate(frame - o.syncFrame, [0, 6, 40], [0, 1, 0.15], {
                    extrapolateRight: "clamp",
                }),
            );
        }
    }

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
                    gap: 64,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    {STORES.map((s, idx) => {
                        const order = ORDERS.find(
                            (o) => o.storeIndex === idx && frame >= o.storeFrame && frame < o.storeFrame + 90,
                        );
                        return (
                            <StoreCard
                                key={s.name}
                                name={s.name}
                                activeOrder={order}
                                frame={frame}
                            />
                        );
                    })}
                </div>

                <div style={{ flex: 1, position: "relative", height: 640 }}>
                    {ORDERS.map((o) => {
                        if (frame < o.storeFrame + 4 || frame > o.syncFrame + 6) return null;
                        const t = (frame - (o.storeFrame + 4)) / PARTICLE_DURATION;
                        const x = interpolate(t, [0, 1], [0, 100], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const yByStore = [12, 50, 88][o.storeIndex];
                        const yByRow = (o.rowIndex + 1) * 16 - 4;
                        const y = interpolate(t, [0, 1], [yByStore, yByRow], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        const opacity = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
                        return (
                            <div
                                key={`${o.storeIndex}-${o.syncFrame}`}
                                style={{
                                    position: "absolute",
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    width: 14,
                                    height: 14,
                                    borderRadius: 999,
                                    background: theme.brand,
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: `0 0 12px ${theme.brand}`,
                                    opacity,
                                }}
                            />
                        );
                    })}

                    <div
                        style={{
                            background: theme.background,
                            border: `1.5px solid ${theme.dividerStrong}`,
                            borderRadius: 8,
                            overflow: "hidden",
                            boxShadow: "0 20px 60px -28px rgba(0,50,32,0.22)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "14px 20px",
                                background: theme.backgroundWarm,
                                borderBottom: `1px solid ${theme.divider}`,
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 5,
                                    background: theme.brand,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: theme.onBrand,
                                    fontWeight: 700,
                                    fontSize: 18,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                ⊞
                            </div>
                            <span
                                style={{
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    fontSize: 14,
                                    color: theme.onBackgroundSecondary,
                                    letterSpacing: "0.04em",
                                }}
                            >
                                inventory.sheet
                            </span>
                            <span style={{ flex: 1 }} />
                            <span
                                style={{
                                    fontSize: 12,
                                    color: theme.onBackgroundSecondary,
                                    fontWeight: 600,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Live sync
                            </span>
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 999,
                                    background: theme.brand,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "140px 1fr 100px 110px",
                                padding: "12px 20px",
                                background: theme.backgroundWarm,
                                borderBottom: `1px solid ${theme.divider}`,
                                fontSize: 11,
                                color: theme.onBackgroundSecondary,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                            }}
                        >
                            <span>SKU</span>
                            <span>Item</span>
                            <span style={{ textAlign: "right" }}>Qty</span>
                            <span style={{ textAlign: "right" }}>Δ</span>
                        </div>
                        {SKUS.map((s, idx) => (
                            <SheetRow
                                key={s.sku}
                                sku={s.sku}
                                item={s.item}
                                qty={qtys[idx]}
                                highlight={highlights[idx]}
                                deltaText={deltas[idx]}
                            />
                        ))}
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
