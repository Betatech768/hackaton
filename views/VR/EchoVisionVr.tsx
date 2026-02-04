"use client";

import { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { XR, createXRStore, useXR } from "@react-three/xr";

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
 * XR Store - Streamlined for maximum compatibility
 */
const store = createXRStore({
  hand: true,
  controller: true,
  // This ensures the session doesn't try to restart automatically
  // which often causes SecurityErrors in production.
  enterGrantedSession: false,
});

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
  stage_area?: StageData;
  seating_area?: SeatingAreaProps;
};

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
 * Refactored VisualOverlay
 * Uses a native ref to ensure the click event is seen as a
 * "Direct User Gesture" by the browser's XR security manager.
 */
function VisualOverlay() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    // Use a synchronous native listener to ensure 0ms delay
    const triggerVR = () => {
      // Triggering fullscreen is optional; don't let it crash the flow
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}

      // CALL THIS SYNCHRONOUSLY
      store.enterVR();
    };

    btn.addEventListener("click", triggerVR);
    return () => btn.removeEventListener("click", triggerVR);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-[9999] pointer-events-auto">
      <button
        ref={buttonRef}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl active:scale-95 transition-all"
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
    <div className="relative w-full h-screen bg-zinc-700 overflow-hidden">
      <VisualOverlay />

      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          // Extra push for WebXR compatibility in certain environments
          gl.xr.enabled = true;
        }}
      >
        <XR store={store}>
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
