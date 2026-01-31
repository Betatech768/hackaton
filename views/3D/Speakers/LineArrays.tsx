import * as THREE from "three";
import { JSX, useLayoutEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.MeshStandardMaterial };
};

export default function LineArray(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/linearray/models/scene.gltf",
  ) as unknown as GLTFResult;

  // Refactored Texture Loading: Mapping the files from your screenshot
  const textures = useTexture({
    base: "/linearray/models/textures/material_baseColor.jpeg",
    m1: "/linearray/models/textures/material_1_baseColor.jpeg",
    m2: "/linearray/models/textures/material_2_baseColor.jpeg",
    m3: "/linearray/models/textures/material_3_baseColor.jpeg",
    m4: "/linearray/models/textures/material_4_baseColor.jpeg",
    m5: "/linearray/models/textures/material_5_baseColor.jpeg",
    m6: "/linearray/models/textures/material_6_baseColor.jpeg",
    m7: "/linearray/models/textures/material_7_baseColor.jpeg",
    m10: "/linearray/models/textures/material_10_baseColor.jpeg",
    m13: "/linearray/models/textures/material_13_baseColor.jpeg",
  });

  useLayoutEffect(() => {
    Object.values(textures).forEach((t) => {
      t.flipY = false;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textures]);

  return (
    <group {...props} dispose={null} scale={0.03}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* We use meshStandardMaterial overrides for each mesh to ensure our textures are used */}

        <mesh geometry={nodes.Material2.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.base} />
        </mesh>

        <mesh geometry={nodes.Material2_1.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m1} />
        </mesh>

        <mesh geometry={nodes.Material4.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m4} />
        </mesh>

        <mesh geometry={nodes.Material5.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m5} />
        </mesh>

        <mesh geometry={nodes.Material3.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        {/* Reusing textures for repetitive hardware components */}
        <mesh geometry={nodes.Material3_1.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material3_2.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material3_3.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material3_4.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material2_2.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m2} />
        </mesh>

        <mesh geometry={nodes.Material2_3.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m10} />
        </mesh>

        <mesh geometry={nodes.Material3_5.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material3_6.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m6} />
        </mesh>

        <mesh geometry={nodes.Material3_7.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m7} />
        </mesh>

        <mesh geometry={nodes.Material3_8.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m13} />
        </mesh>

        <mesh geometry={nodes.Material3_9.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.m3} />
        </mesh>

        <mesh geometry={nodes.Material2_4.geometry} castShadow receiveShadow>
          <meshStandardMaterial map={textures.base} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/linearray/models/scene.gltf");
