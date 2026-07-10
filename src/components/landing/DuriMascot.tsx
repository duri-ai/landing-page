const FOREST = "#003220";
const MINT = "#7bd3a6";
const BRAND = "#00a86b";

/**
 * The Duri mascot as an SVG group, drawn in its own ~140x152 local
 * coordinate space. Embeddable in any parent <svg> via transform so the
 * three hero scenes can place the same character at different scales.
 */
export function MascotGroup({ transform }: { transform?: string }) {
    return (
        <g
            transform={transform}
            fill="none"
            stroke={FOREST}
            strokeLinejoin="round"
            strokeLinecap="round"
        >
            {/* antenna */}
            <line x1="70" y1="40" x2="70" y2="20" strokeWidth="3.2" />
            <circle cx="70" cy="14" r="6.5" fill={MINT} strokeWidth="3.2" />

            {/* ears (behind head) */}
            <ellipse cx="33" cy="78" rx="8" ry="13" fill={MINT} strokeWidth="3" />
            <ellipse cx="107" cy="78" rx="8" ry="13" fill={MINT} strokeWidth="3" />

            {/* body */}
            <path
                d="M47 146 C47 118 58 113 70 113 C82 113 93 118 93 146 Z"
                fill="#fff"
                strokeWidth="3.2"
            />
            {/* chest mark */}
            <text
                x="70"
                y="137"
                textAnchor="middle"
                fontFamily="Inter, system-ui, sans-serif"
                fontSize="16"
                fontWeight="700"
                fill={BRAND}
                stroke="none"
            >
                d
            </text>

            {/* head */}
            <rect x="34" y="40" width="72" height="66" rx="27" fill="#fff" strokeWidth="3.4" />

            {/* face panel */}
            <rect x="44" y="55" width="52" height="39" rx="18" fill={FOREST} stroke="none" />

            {/* blush */}
            <circle cx="49" cy="89" r="3" fill={MINT} stroke="none" opacity="0.5" />
            <circle cx="91" cy="89" r="3" fill={MINT} stroke="none" opacity="0.5" />

            {/* eyes */}
            <ellipse cx="61" cy="74" rx="4.6" ry="6" fill={MINT} stroke="none" />
            <ellipse cx="79" cy="74" rx="4.6" ry="6" fill={MINT} stroke="none" />

            {/* smile */}
            <path d="M62.5 83 Q70 89.5 77.5 83" stroke={MINT} strokeWidth="3" />
        </g>
    );
}

/** Standalone mascot, for use outside a scene SVG. */
export default function DuriMascot({
    width = 120,
    className,
}: {
    width?: number;
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 140 152"
            width={width}
            height={(width * 152) / 140}
            className={className}
            role="img"
            aria-label="Duri, the assistant"
        >
            <MascotGroup />
        </svg>
    );
}
