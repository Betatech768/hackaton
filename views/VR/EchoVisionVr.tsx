"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  PerspectiveCamera,
  useProgress,
  Html,
} from "@react-three/drei";
import { XR, XRButton, useXR } from "@react-three/xr";
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
import CoverageRange from "../3D/components/CoverageRange";

/**
 * 1. Initialize XR Store
 * Removed 'layers' and 'dom-overlay' hints that cause
 * rejections in certain immersive-vr deployments.
 */

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

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white font-bold">
        Loading {Math.round(progress)}%
      </div>
    </Html>
  );
}

/**
 * 3. Visual Overlay (The Fix)
 * The function is no longer async. We trigger fullscreen as a
 * side effect, but store.enterVR() is called synchronously
 * to satisfy the browser's User Activation requirement.
 */

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
    /* This container needs a fixed height to show the Canvas properly in your Tabs */
    <div className="relative w-full h-[600px] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      {/* 1. UI LAYER (The Text and Button) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center mb-8 pointer-events-auto">
          <h2 className="text-2xl font-bold text-white">WebXR (VR)</h2>
          <p className="text-zinc-400">Immersive placement for VR headsets.</p>
        </div>

        <div className="pointer-events-auto">
          <XRButton
            mode="VR"
            style={{
              padding: "16px 32px",
              background: "#2563eb",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              fontWeight: "bold",
            }}
          >
            ENTER VR EXPERIENCE
          </XRButton>
        </div>
      </div>

      {/* 2. 3D LAYER (The Canvas) */}
      <Canvas
        shadows
        className="absolute inset-0 w-full h-full"
        camera={{ position: [0, 1.6, 5], fov: 70 }}
      >
        <XR>
          <group position={[-centerX, 0, -centerZ]}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />

            <Suspense fallback={null}>
              <Hall dimensions={dimensions!} />
              <StageArea stage={stage_area!} dimensions={dimensions!} />
              <SeatingBlock
                seating_area={seating_area}
                dimensions={dimensions!}
                stage_area={stage_area}
              />
              {sortedSpeakers.map((sp, i) => (
                <Suspense fallback={null} key={`vr-sp-${i}`}>
                  <Speaker3D speaker={sp} />
                  <CoverageRange speaker={sp} />
                </Suspense>
              ))}
            </Suspense>

            <Grid
              args={[width_m, length_m]}
              position={[centerX, -0.01, centerZ]}
              cellColor="#333"
              sectionColor="#555"
            />
            <CameraController
              dimensions={dimensions}
              centerX={centerX}
              centerZ={centerZ}
            />
          </group>
        </XR>
      </Canvas>
    </div>
  );
}
