import { useMemo } from "react";
import * as THREE from "three";

// Types
import { Dimensions } from "@/types/speaker";
import { Environment } from "@react-three/drei";

type Props = {
  dimensions?: Dimensions;
};

export default function Hall({ dimensions }: Props) {
  if (!dimensions) return null;

  const { width_m, length_m, height_m } = dimensions;

  // Geometry (memoized)
  const boxGeometry = useMemo(
    () => new THREE.BoxGeometry(width_m, height_m, length_m),
    [width_m, height_m, length_m],
  );

  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(boxGeometry),
    [boxGeometry],
  );

  return (
    <group position={[width_m / 2, height_m / 2, length_m / 2]}>
      {/* INSIDE faces only */}
      <mesh geometry={boxGeometry}>
        <Environment files={"/Hdr/warehouse-256.hdr"} />
        <meshStandardMaterial
          color="brown"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* INSIDE edges only */}
      <lineSegments geometry={edgesGeometry} scale={0.999}>
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  );
}
