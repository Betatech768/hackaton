import * as THREE from "three";
import { JSX } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube__0: THREE.Mesh;
  };
};

export default function DelaySpeaker(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/delayspeaker/models/scene.gltf",
  ) as unknown as GLTFResult;

  // This Loads textures directly here
  const [colorMap, mrMap, normalMap] = useTexture([
    "/delayspeaker/models/textures/Scene_-_Root_baseColor.png",
    "/delayspeaker/models/textures/Scene_-_Root_metallicRoughness.png",
    "/delayspeaker/models/textures/Scene_-_Root_normal.png",
  ]);

  // Ensure textures align with GLTF UVs
  [colorMap, mrMap, normalMap].forEach((t) => {
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace; // Keeps colors accurate
  });

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube__0.geometry}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            metalnessMap={mrMap}
            roughnessMap={mrMap}
            emissive="#000000"
            roughness={1}
            metalness={1}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/delayspeaker/models/scene.gltf");
