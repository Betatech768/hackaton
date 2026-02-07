import * as THREE from "three";
import { useMemo } from "react";
import { SpeakerPosition } from "@/types/speaker";

type Props = {
  speaker: SpeakerPosition;
};

const COVERAGE_PRESETS: Record<string, { angle: number }> = {
  main: { angle: 65 },
  fill: { angle: 90 },
  monitor: { angle: 100 },
  delay: { angle: 70 },
  column: { angle: 40 },
  subwoofer: { angle: 180 },
};

const SPEAKER_COLORS: Record<string, string> = {
  main: "#ffffff",
  subwoofer: "#3b82f6",
  delay: "#facc15",
  fill: "#22c55e",
  monitor: "#f97316",
  column: "#ef4444",
};

const degToRad = (deg = 0) => (deg * Math.PI) / 180;

export default function CoverageRange({ speaker }: Props) {
  const { type, x, y, z, angle_horizontal = 0, range } = speaker;

  let angle_vertical = speaker.angle_vertical ?? 0;

  if (!range || range <= 0) return null;

  if (type === "main") {
    angle_vertical = angle_vertical + 45;
  }
  if (type === "monitor") {
    angle_vertical = angle_vertical + 300;
  }
  if (type === "delay") {
    angle_vertical = angle_vertical + 45;
  }
  const preset = COVERAGE_PRESETS[type] ?? COVERAGE_PRESETS.main;
  const geometry = useMemo(() => {
    if (type === "subwoofer") {
      return new THREE.SphereGeometry(range, 32, 32);
    }

    const radius = (Math.tan(degToRad(preset.angle / 2)) * range) / 2;
    const geo = new THREE.ConeGeometry(radius, range, 32, 1, true);

    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, range / 2);

    return geo;
  }, [type, preset.angle, range]);

  return (
    <mesh
      geometry={geometry}
      position={[x, y, z]}
      rotation={[degToRad(angle_vertical), degToRad(angle_horizontal), 0]}
      rotation-order="YXZ"
    >
      <meshBasicMaterial
        color={SPEAKER_COLORS[type] ?? "#ffffff"}
        transparent
        opacity={0.25}
        depthWrite={false}
        side={THREE.DoubleSide}
        depthTest={true}
      />
    </mesh>
  );
}
