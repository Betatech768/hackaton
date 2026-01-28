import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";

type Props = {
  text: string;
  visible: boolean;
};

export function SpeakerHoverLabel({ text, visible }: Props) {
  const textRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!textRef.current || !materialRef.current) return;

    try {
      // Fade in/out
      easing.damp(materialRef.current, "opacity", visible ? 1 : 0, 0.25, delta);

      // Float up/down
      easing.damp(
        textRef.current.position,
        "y",
        visible ? 1.6 : 1.2,
        0.25,
        delta,
      );

      // Scale
      const targetScale = visible ? 1 : 0.9;
      easing.damp(textRef.current.scale, "x", targetScale, 0.25, delta);
      easing.damp(textRef.current.scale, "y", targetScale, 0.25, delta);
      easing.damp(textRef.current.scale, "z", targetScale, 0.25, delta);
    } catch (error) {
      console.error("Error in SpeakerHoverLabel animation:", error);
    }
  });

  try {
    return (
      <Text
        ref={textRef}
        position={[0, 1.2, 0]}
        fontSize={0.45}
        anchorX="center"
        anchorY="middle"
        color="black"
      >
        {text}
        <meshBasicMaterial
          ref={materialRef}
          color="black"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      </Text>
    );
  } catch (error) {
    console.error("Error rendering SpeakerHoverLabel:", error);
    return null;
  }
}
