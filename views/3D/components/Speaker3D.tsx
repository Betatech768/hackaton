import * as THREE from "three";
import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import { SpeakerPosition } from "@/types/speaker";
import { speakerTypeSelection } from "../utils";

type Props = {
  speaker: SpeakerPosition;
};

export default function Speaker3D({ speaker }: Props) {
  const SpeakerComponent = speakerTypeSelection(speaker.type);
  const [hovered, setHovered] = useState(false);

  if (!SpeakerComponent) {
    console.warn(`Unknown speaker type: ${speaker.type}`);
    return null;
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group
      position={[speaker.x, speaker.y, speaker.z]}
      rotation={[
        THREE.MathUtils.degToRad(speaker.angle_vertical ?? 0),
        THREE.MathUtils.degToRad(speaker.angle_horizontal ?? 0),
        0,
      ]}
    >
      {/* Real speaker model */}
      <SpeakerComponent />

      {/* Invisible hitbox for hover */}
      <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* HTML label on hover */}
      {hovered && (
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {speaker.description || speaker.type || "Speaker"}
          </div>
        </Html>
      )}
    </group>
  );
}
