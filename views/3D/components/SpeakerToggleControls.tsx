// components/SpeakerToggleControls.tsx
"use client";

type SpeakerType =
  | "main"
  | "fill"
  | "monitor"
  | "delay"
  | "column"
  | "subwoofer";

const SPEAKER_COLORS: Record<SpeakerType, string> = {
  main: "#ffffff",
  subwoofer: "#3b82f6",
  delay: "#facc15",
  fill: "#22c55e",
  monitor: "#f97316",
  column: "#ef4444",
};

const SPEAKER_LABELS: Record<SpeakerType, string> = {
  main: "Main",
  subwoofer: "Subwoofer",
  delay: "Delay",
  fill: "Fill",
  monitor: "Monitor",
  column: "Column",
};

type Props = {
  availableTypes: SpeakerType[];
  visibleTypes: Set<SpeakerType>;
  onToggle: (type: SpeakerType) => void;
};

export default function SpeakerToggleControls({
  availableTypes,
  visibleTypes,
  onToggle,
}: Props) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10 opacity-30 hover:opacity-100 transition-opacity transition-duration-300">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">
        Coverage Display
      </h3>
      <div className="space-y-2">
        {availableTypes.map((type) => (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all ${
              visibleTypes.has(type)
                ? "bg-gray-100 shadow-sm"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{
                backgroundColor: visibleTypes.has(type)
                  ? SPEAKER_COLORS[type]
                  : "transparent",
                borderColor: SPEAKER_COLORS[type],
                opacity: visibleTypes.has(type) ? 0.8 : 0.4,
              }}
            />
            <span
              className={`text-sm font-medium ${
                visibleTypes.has(type) ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {SPEAKER_LABELS[type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
