"use client";
import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

// Types
import {
  SpeakerPosition,
  Dimensions,
  StageData,
  SeatingAreaProps,
} from "@/types/speaker";

// components
import Hall from "./components/Hall";
import Speaker3D from "./components/Speaker3D";
import StageArea from "./components/Stage";
import { SeatingBlock } from "./components/SeatingArea";
import CoverageRange from "./components/CoverageRange";
import SpeakerToggleControls from "./components/SpeakerToggleControls";

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
  seating_area?: SeatingAreaProps;
};

type SpeakerType =
  | "main"
  | "fill"
  | "monitor"
  | "delay"
  | "column"
  | "subwoofer";

function CameraController({
  dimensions,
  centerX,
  centerZ,
}: {
  dimensions: Dimensions;
  centerX: number;
  centerZ: number;
}) {
  const { width_m, length_m, height_m } = dimensions;

  return (
    <OrbitControls
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

export default function EchoVision3D({
  dimensions,
  speakers,
  stage_area,
  seating_area,
}: Props) {
  if (!dimensions) return null;
  if (!speakers) return null;
  if (!seating_area) return null;

  const { length_m, width_m, height_m } = dimensions;
  const centerX = width_m / 2;
  const centerZ = length_m / 1.8;
  const cameraHeight = Math.min(height_m * 0.6, 12);

  // Get unique speaker types
  const availableTypes = useMemo(() => {
    const types = new Set(speakers.map((sp) => sp.type as SpeakerType));
    return Array.from(types);
  }, [speakers]);

  // State to track which types are visible
  const [visibleTypes, setVisibleTypes] = useState<Set<SpeakerType>>(
    new Set(availableTypes),
  );

  // Toggle handler for speaker type visibility
  const handleToggle = (type: SpeakerType) => {
    setVisibleTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // Sort speakers so that subwoofers are rendered first (underneath others)
  const sortedSpeakers = useMemo(() => {
    return [...speakers].sort((a, b) => {
      if (a.type === "subwoofer" && b.type !== "subwoofer") return -1;
      if (a.type !== "subwoofer" && b.type === "subwoofer") return 1;
      return 0;
    });
  }, [speakers]);

  return (
    <div className="relative w-full h-full">
      <SpeakerToggleControls
        availableTypes={availableTypes}
        visibleTypes={visibleTypes}
        onToggle={handleToggle}
      />

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

        <CameraController
          dimensions={dimensions}
          centerX={centerX}
          centerZ={centerZ}
        />

        <Hall dimensions={dimensions} />

        <Suspense fallback={null}>
          <StageArea stage={stage_area} dimensions={dimensions} />
        </Suspense>
        <Suspense fallback={null}>
          <SeatingBlock
            seating_area={seating_area}
            dimensions={dimensions}
            stage_area={stage_area}
          />
        </Suspense>

        {sortedSpeakers?.map((sp, i) => (
          <Suspense fallback={null} key={i}>
            {visibleTypes.has(sp.type as SpeakerType) && (
              <CoverageRange speaker={sp} />
            )}
            <Speaker3D speaker={sp} />
          </Suspense>
        ))}
      </Canvas>
    </div>
  );
}
