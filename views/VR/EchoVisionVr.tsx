"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { XR, createXRStore, useXR } from "@react-three/xr";
import { Suspense, useMemo } from "react";

import { SpeakerPosition, Dimensions, StageData } from "@/types/speaker";
import Hall from "../3D/components/Hall";
import StageArea from "../3D/components/Stage";
import Speaker3D from "../3D/components/Speaker3D";

// 1. Initialize XR Store outside
const store = createXRStore({
  hand: true,
  controller: true,
});

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
};

// 2. Camera Controller logic
function CameraController({ dimensions, centerX, centerZ }: any) {
  const isPresenting = useXR((state) => state.isPresenting);
  if (isPresenting) return null; // Disable OrbitControls in VR

  return (
    <OrbitControls
      target={[centerX, dimensions.height_m * 0.3, centerZ - 5]}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
    />
  );
}

// 3. UI Overlay (Outside Canvas)
function VisualOverlay() {
  // Note: we can't use useXR() here because this is outside the <XR> provider.
  // We use the store's native subscribe or just standard button logic.
  const enterVR = async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }
    store.enterVR();
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
        onClick={enterVR}
      >
        START VR EXPERIENCE
      </button>
    </div>
  );
}

export default function EchoVision3D({
  dimensions,
  speakers,
  stage_area,
}: Props) {
  const sortedSpeakers = useMemo(() => {
    if (!speakers) return [];
    return [...speakers].sort((a) => (a.type === "subwoofer" ? -1 : 1));
  }, [speakers]);

  if (!dimensions?.length_m || !dimensions?.width_m) return null;
  if (!speakers || speakers.length === 0) return null;

  const { length_m, width_m } = dimensions;
  const centerX = width_m / 2;
  const centerZ = length_m / 2;

  return (
    <div className="relative w-full h-screen bg-grey-400">
      <VisualOverlay />

      <Canvas style={{ height: "100%", width: "100%" }}>
        <XR store={store}>
          <group position={[-centerX, 0, -centerZ]}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <PerspectiveCamera
              makeDefault
              position={[centerX, 1.6, length_m]}
              fov={70}
            />

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

            {sortedSpeakers.map((sp, i) => (
              <Suspense fallback={null} key={i}>
                <Speaker3D speaker={sp} />
              </Suspense>
            ))}
          </group>
        </XR>
      </Canvas>
    </div>
  );
}
