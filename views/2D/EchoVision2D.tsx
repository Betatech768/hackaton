// Types
import { Dimensions, SpeakerPosition } from "@/types/speaker";

// utils
import { mapSpeakersToSvg, VIEWBOX_HEIGHT, VIEWBOX_WIDTH } from "./utils";
import CoverageCone from "./CoverageCone";

type Props = {
  dimensions?: Dimensions;
  speakerPosition?: SpeakerPosition[];
};
const SPEAKER_COLORS: Record<string, string> = {
  main: "#ffff", // w
  subwoofer: "#3b82f6", // blue
  delay: "#facc15", // yellow
  fill: "#22c55e", // green
};

const LEGEND_WIDTH = 240;
const HALL_x_OFFSET = LEGEND_WIDTH + 20;
const HALL_WIDTH = VIEWBOX_WIDTH - HALL_x_OFFSET - 20;

export default function EchoVision2D({ dimensions, speakerPosition }: Props) {
  if (!dimensions) return null;

  const svgSpeakers = mapSpeakersToSvg(speakerPosition ?? [], dimensions);

  console.log(svgSpeakers);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className="bg-zinc-900 rounded-xl"
    >
      {/* Hall */}
      <rect
        x={HALL_x_OFFSET}
        y={0}
        width={HALL_WIDTH + 300}
        height={VIEWBOX_HEIGHT}
        fill="none"
        stroke="#777"
        strokeWidth={4}
      />

      {/* Stage */}
      <rect
        x={HALL_x_OFFSET + HALL_WIDTH * 0.39}
        y={0}
        width={HALL_WIDTH * 0.6}
        height={80}
        fill="#333"
      />
      <text
        x={HALL_x_OFFSET + HALL_WIDTH * 0.7}
        y={50}
        textAnchor="middle"
        fill="white"
        fontSize={18}
      >
        STAGE
      </text>
      {/* Speakers */}
      {svgSpeakers.map((sp, i) => {
        const color = SPEAKER_COLORS[sp.type] || "#fff";

        return (
          <g
            key={i}
            transform={`translate(${sp.cx + HALL_x_OFFSET}, ${sp.cy}) rotate(${sp.angle_horizontal})`}
          >
            {/* Coverage */}
            {sp.type !== "subwoofer" && <CoverageCone color={color} />}

            {/* Speaker body */}
            {sp.type === "subwoofer" ? (
              <rect
                x={-20}
                y={-20}
                width={40}
                height={40}
                rx={6}
                fill={color}
              />
            ) : (
              <circle r={16} fill={color} />
            )}

            {/* Direction arrow */}
            {sp.type !== "subwoofer" && (
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={60}
                stroke={color}
                strokeWidth={6}
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(-520, 350)`}>
        {/* Title */}
        <text fill="white" fontSize={78} fontWeight="bold" y={0}>
          Speakers
        </text>

        {/* List */}
        <g transform="translate(0, 100)">
          {svgSpeakers.map((sp, i) => {
            const color = SPEAKER_COLORS[sp.type] || "#fff";

            return (
              <g key={i} transform={`translate(0, ${i * 80})`}>
                {/* Color box */}
                <rect x={0} y={10} width={24} height={24} rx={4} fill={color} />

                {/* Text */}
                <text
                  x={40}
                  y={28}
                  fill="white"
                  fontSize={56}
                  dominantBaseline="middle"
                >
                  {sp.description ?? sp.type}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
