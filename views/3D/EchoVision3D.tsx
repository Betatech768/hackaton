"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";

import { SpeakerPosition, Dimensions, StageData } from "@/types/speaker";
import Hall from "./components/Hall";
import Speaker3D from "./components/Speaker3D";
import StageArea from "./components/Stage";
import DelaySpeaker from "./Speakers/DelaySpeakers";

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
};

// --- 1. NEW COMPONENT TO HANDLE CONTROLS ---
function CameraController({
  dimensions,
  centerX,
  centerZ,
}: {
  dimensions: Dimensions;
  centerX: number;
  centerZ: number;
}) {
  const controlsRef = useRef<any>(null);
  const { width_m, length_m, height_m } = dimensions;

  // Use useFrame to manually clamp the "Pan" (target position)
  useFrame(() => {
    if (controlsRef.current) {
      const target = controlsRef.current.target;

      // Ensure the user cannot pan outside the hall boundaries
      target.x = Math.max(0, Math.min(width_m, target.x));
      target.y = Math.max(0, Math.min(height_m * 0.8, target.y));
      target.z = Math.max(0, Math.min(length_m, target.z));
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[centerX, height_m * 0.3, centerZ]}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 6}
      minDistance={Math.min(width_m, length_m) * 0.15}
      maxDistance={Math.max(width_m, length_m) * 0.8}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
      enablePan={true}
    />
  );
}

// --- 2. MAIN COMPONENT ---
export default function EchoVision3D({
  dimensions,
  speakers,
  stage_area,
}: Props) {
  if (!dimensions) return null;
  if (!speakers) return null;

  const { length_m, width_m, height_m } = dimensions;
  const centerX = width_m / 2;
  const centerZ = length_m / 1.8;
  const cameraHeight = Math.min(height_m * 0.6, 12);

  // Sort speakers so Subwoofers render first (if applicable to 3D transparency/ordering)
  const sortedSpeakers = useMemo(() => {
    return [...speakers].sort((a, b) => {
      if (a.type === "subwoofer" && b.type !== "subwoofer") return -1;
      if (a.type !== "subwoofer" && b.type === "subwoofer") return 1;
      return 0;
    });
  }, [speakers]);

  return (
    <Canvas
      camera={{
        position: [centerX, cameraHeight - 5, centerZ + length_m * 0.5],
        fov: 50,
        near: 0.1,
        far: 200,
      }}
      className="brown rounded-xl"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} />

      <Grid
        args={[width_m, length_m]}
        position={[width_m / 2, 0, length_m / 2]}
      />

      {/* Logic moved here to be inside the Canvas context */}
      <CameraController
        dimensions={dimensions}
        centerX={centerX}
        centerZ={centerZ}
      />

      <Hall dimensions={dimensions} />

      <Suspense fallback={null}>
        <StageArea stage={stage_area} dimensions={dimensions} />
      </Suspense>

      {sortedSpeakers.map((sp, i) => (
        <Suspense fallback={null} key={i}>
          <Speaker3D speaker={sp} />
        </Suspense>
      ))}
    </Canvas>
  );
}
