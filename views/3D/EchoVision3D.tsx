"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Hall from "./Hall";
// import Stage from "./Stage";
import { SpeakerPosition, Dimensions } from "@/types/speaker";
import Speaker3D from "./Speaker3D";
import { Suspense } from "react";

type Props = {
  dimensions?: Dimensions;
  speakers?: SpeakerPosition[];
};

export default function EchoVision3D({ dimensions, speakers }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 8, 18], fov: 50 }}
      className="bg-white rounded-xl"
    >
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} />

      {/* Helpers */}
      <Grid args={[50, 50]} />
      <OrbitControls />

      {/* World */}
      <Hall dimensions={dimensions} />
      {/* <Stage dimensions={dimensions} /> */}

      {speakers?.map((sp, i) => (
        <Suspense fallback={null} key={i}>
          <Speaker3D speaker={sp} />
        </Suspense>
      ))}
    </Canvas>
  );
}
