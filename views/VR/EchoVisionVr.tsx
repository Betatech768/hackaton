"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { XR, createXRStore, useXR } from "@react-three/xr";
import { Suspense, useMemo } from "react";

import {
  SpeakerPosition,
  Dimensions,
  StageData,
  SeatingAreaProps,
} from "@/types/speaker";
import Hall from "../3D/components/Hall";
import StageArea from "../3D/components/Stage";
import Speaker3D from "../3D/components/Speaker3D";
import { SeatingBlock } from "../3D/components/SeatingArea";

/**
 * 1. Initialize XR Store
 * Removed 'layers' and 'dom-overlay' hints that cause
 * rejections in certain immersive-vr deployments.
 */
const store = createXRStore({
  hand: true,
  controller: true,
});

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
  seating_area?: SeatingAreaProps;
};

/**
 * 2. Camera Controller logic
 * OrbitControls are disabled automatically when an active
 * XR session is detected to prevent input conflicts.
 */
function CameraController({ dimensions, centerX, centerZ }: any) {
  const session = useXR((state) => state.session);
  if (session) return null;

  return (
    <OrbitControls
      target={[centerX, dimensions.height_m * 0.3, centerZ - 5]}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
    />
  );
}

/**
 * 3. Visual Overlay (The Fix)
 * The function is no longer async. We trigger fullscreen as a
 * side effect, but store.enterVR() is called synchronously
 * to satisfy the browser's User Activation requirement.
 */
function VisualOverlay() {
  const handleStartVR = () => {
    // Attempt fullscreen but do not await it
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Silently fail if fullscreen is blocked; VR is the priority
      });
    }

    // Call enterVR in the same execution tick as the click event
    store.enterVR();
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
        onClick={handleStartVR}
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
  seating_area,
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
    <div className="relative w-full h-screen bg-zinc-600">
      <VisualOverlay />

      <Canvas
        style={{ height: "100%", width: "100%" }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <XR store={store}>
          {/* Shift the entire hall so the center point is at world 0,0,0 for VR comfort */}
          <group position={[-centerX, 0, -centerZ]}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />

            <PerspectiveCamera
              makeDefault
              position={[width_m / 4, 1.6, 0]}
              fov={90}
            />

            <Grid
              args={[width_m, length_m]}
              position={[width_m / 2, -0.01, length_m / 2]}
              cellColor="#333"
              sectionColor="#555"
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

            {sortedSpeakers.map((sp, i) => (
              <Suspense fallback={null} key={`speaker-${i}`}>
                <Speaker3D speaker={sp} />
              </Suspense>
            ))}
          </group>
        </XR>
      </Canvas>
    </div>
  );
}
