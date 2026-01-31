import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { JSX, useLayoutEffect } from "react";

type GLTFResult = GLTF & {
  nodes: {
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_7: THREE.Mesh;
    Object_3001: THREE.Mesh;
    Object_4001: THREE.Mesh;
    Object_5001: THREE.Mesh;
    Object_6001: THREE.Mesh;
    Object_7001: THREE.Mesh;
  };
};

export default function ColumnSpeaker(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/columnspeaker/models/scene.glb",
  ) as unknown as GLTFResult;

  // 1. Load textures from the /columnspeaker/ directory
  const textures = useTexture({
    baseColor: "/columnspeaker/models/textures/Base_baseColor.jpeg",
    baseMR: "/columnspeaker/models/textures/Base_metallicRoughness.png",
    meshColor: "/columnspeaker/models/textures/Mesh_baseColor.jpeg",
    meshMR: "/columnspeaker/models/textures/Mesh_metallicRoughness.png",
    meshNormal: "/columnspeaker/models/textures/Mesh_normal.png",
  });

  // 2. Configure textures globally
  useLayoutEffect(() => {
    Object.values(textures).forEach((t) => {
      t.flipY = false; // Essential for correct UV mapping in GLTF
    });
    // Set color maps to sRGB
    textures.baseColor.colorSpace = THREE.SRGBColorSpace;
    textures.meshColor.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  return (
    <group {...props} dispose={null} scale={0.003}>
      <group name="Scene">
        {/* Hardware / Buttons / Electronics usually use the 'Base' set */}
        <mesh geometry={nodes.Object_3.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>
        <mesh geometry={nodes.Object_4.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>

        {/* The Main Speaker Grille / Mesh uses the 'Mesh' set */}
        <mesh geometry={nodes.Object_5.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.meshColor}
            normalMap={textures.meshNormal}
            metalnessMap={textures.meshMR}
            roughnessMap={textures.meshMR}
          />
        </mesh>

        {/* Screens and Casings */}
        <mesh geometry={nodes.Object_6.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#111111"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh geometry={nodes.Object_7.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>

        {/* Duplicated objects for second speaker unit (if applicable) */}
        <mesh geometry={nodes.Object_3001.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>
        <mesh geometry={nodes.Object_4001.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>
        <mesh geometry={nodes.Object_5001.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.meshColor}
            normalMap={textures.meshNormal}
            metalnessMap={textures.meshMR}
            roughnessMap={textures.meshMR}
          />
        </mesh>
        <mesh geometry={nodes.Object_6001.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#111111"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh geometry={nodes.Object_7001.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.baseColor}
            metalnessMap={textures.baseMR}
            roughnessMap={textures.baseMR}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/columnspeaker/models/scene.glb");
