// EchoVision2D.tsx
import { Dimensions, SpeakerPosition, StageData } from "@/types/speaker";
import { mapSpeakersToSvg, VIEWBOX_HEIGHT, VIEWBOX_WIDTH, HALL } from "./utils";
import CoverageCone from "./CoverageCone";
import { useMemo } from "react";

type Props = {
  dimensions?: Dimensions;
  speakerPosition?: SpeakerPosition[];
  stage_area?: StageData;
};

const SPEAKER_COLORS: Record<string, string> = {
  main: "#ffffff",
  subwoofer: "#3b82f6",
  delay: "#facc15",
  fill: "#22c55e",
  monitor: "#f97316",
};

export default function EchoVision2D({
  dimensions,
  speakerPosition,
  stage_area,
}: Props) {
  if (!dimensions) return null;

  const svgSpeakers = mapSpeakersToSvg(speakerPosition ?? [], dimensions);
  // Sort subwoofers to the front so they are drawn first (layered underneath)
  const sortedSpeakers = useMemo(() => {
    return [...svgSpeakers].sort((a, b) => {
      if (a.type === "subwoofer" && b.type !== "subwoofer") return -1;
      if (a.type !== "subwoofer" && b.type === "subwoofer") return 1;
      return 0;
    });
  }, [svgSpeakers]);
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className="w-full h-full bg-zinc-900 rounded-xl"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ===== CLIP PATH ===== */}
      <defs>
        <clipPath id="hall-clip">
          <rect x={HALL.x} y={HALL.y} width={HALL.width} height={HALL.height} />
        </clipPath>
      </defs>

      {/* ===== HALL ===== */}
      <rect
        x={HALL.x}
        y={HALL.y}
        width={HALL.width}
        height={HALL.height}
        fill="none"
        stroke="#777"
        strokeWidth={4}
      />

      {/* ===== STAGE ===== */}
      <rect
        x={HALL.x + HALL.width * 0.2}
        y={0}
        width={HALL.width * 0.6}
        height={
          stage_area?.width_m
            ? ((stage_area.width_m / dimensions.width_m) * HALL.height) / 3
            : 40
        }
        fill="#333"
      />
      <text
        x={HALL.x + HALL.width / 2}
        y={212}
        textAnchor="middle"
        fill="white"
        fontSize={18}
      >
        STAGE
      </text>

      {/* ===== SPEAKERS ===== */}
      <g clipPath="url(#hall-clip)">
        {sortedSpeakers.map((sp, i) => {
          const color = SPEAKER_COLORS[sp.type] || "#fff";

          return (
            <g
              key={i}
              transform={`translate(${sp.cx}, ${sp.cy}) rotate(${sp.angle_horizontal ?? 0})`}
            >
              {/* Coverage */}
              {sp.type !== "subwoofer" && <CoverageCone color={color} />}

              {/* Speaker Icon */}
              {sp.type === "subwoofer" ? (
                <rect
                  x={-18}
                  y={-18}
                  width={36}
                  height={36}
                  rx={6}
                  fill={color}
                />
              ) : (
                <circle r={14} fill={color} />
              )}

              {/* Direction Indicator */}
              {sp.type !== "subwoofer" && (
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={55}
                  stroke={color}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* ===== LEGEND ===== */}
      <g transform="translate(20, 420)">
        <text fill="white" fontSize={32} fontWeight="bold">
          Speakers
        </text>

        {Object.entries(SPEAKER_COLORS).map(([type, color], i) => (
          <g key={type} transform={`translate(0, ${60 + i * 46})`}>
            <rect x={0} y={-14} width={20} height={20} rx={4} fill={color} />
            <text
              x={32}
              y={0}
              fill="white"
              fontSize={22}
              dominantBaseline="middle"
            >
              {type}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
