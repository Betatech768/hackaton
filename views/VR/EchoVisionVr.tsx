"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
// 1. New imports: Removed VRButton, Controllers, Hands. Added createXRStore.
import { XR, createXRStore } from "@react-three/xr";
import { Suspense, useMemo, useState } from "react";

import { SpeakerPosition, Dimensions, StageData } from "@/types/speaker";
import Hall from "../3D/components/Hall";
import StageArea from "../3D/components/Stage";
import Speaker3D from "../3D/components/Speaker3D";

// 2. Initialize the XR store outside the component
const store = createXRStore({
  // Optional: Enable features like hand tracking if your glasses support it
  hand: true,
  controller: true,
});

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
};

function CameraController({
  dimensions,
  centerX,
  centerZ,
  enabled,
}: {
  dimensions: Dimensions;
  centerX: number;
  centerZ: number;
  enabled: boolean;
}) {
  const { height_m, length_m, width_m } = dimensions;
  const maxCameraDistance = Math.max(width_m, length_m) * 0.8;
  const minCameraDistance = Math.min(width_m, length_m) * 0.15;

  if (!enabled) return null;

  return (
    <OrbitControls
      target={[centerX, height_m * 0.3, centerZ]}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 6}
      minDistance={minCameraDistance}
      maxDistance={maxCameraDistance}
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
}: Props) {
  const [isVR, setIsVR] = useState(false);

  const sortedSpeakers = useMemo(() => {
    if (!speakers) return [];
    return [...speakers].sort((a, b) => (a.type === "subwoofer" ? -1 : 1));
  }, [speakers]);

  if (!dimensions?.length_m || !dimensions?.width_m) return null;
  if (!speakers || speakers.length === 0) return null;

  const { length_m, width_m } = dimensions;
  const centerX = width_m / 2;
  const centerZ = length_m / 2;

  return (
    <>
      {/* 3. Replacement for VRButton */}
      <button
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-white text-black rounded-md"
        onClick={() => store.enterVR()}
      >
        {isVR ? "Exit VR" : "START VR EXPERIENCE"}
      </button>

      <Canvas
        camera={{
          position: [centerX, 1.6, centerZ + 6],
          fov: 70,
          near: 0.1,
          far: 200,
        }}
        style={{ height: "100vh", width: "100%" }}
        className="rounded-xl"
      >
        {/* 4. Pass the store to the XR provider */}
        <XR store={store}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1} />
          <directionalLight position={[-10, 10, -10]} intensity={0.3} />

          <Grid
            args={[width_m, length_m]}
            position={[width_m / 2, 0, length_m / 2]}
          />

          <CameraController
            dimensions={dimensions}
            centerX={centerX}
            centerZ={centerZ}
            enabled={!isVR}
          />

          {/* 5. Controllers and Hands are now automatically managed by the XR store */}

          <Hall dimensions={dimensions} />

          <Suspense fallback={null}>
            <StageArea stage={stage_area} dimensions={dimensions} />
          </Suspense>

          {sortedSpeakers.map((sp, i) => (
            <Suspense fallback={null} key={i}>
              <Speaker3D speaker={sp} />
            </Suspense>
          ))}
        </XR>
      </Canvas>
    </>
  );
}
