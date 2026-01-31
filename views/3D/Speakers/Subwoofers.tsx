import * as THREE from "three";
import { JSX, useLayoutEffect } from "react";
import { Environment, useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
  };
};

export default function Subwoofer(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/subwoofer/models/scene.gltf",
  ) as unknown as GLTFResult;

  // Refactored: Single object loading for both texture sets
  const textures = useTexture({
    wallBase: "/subwoofer/models/textures/wallspeaker_baseColor.png",
    wallNormal: "/subwoofer/models/textures/wallspeaker_normal.png",
    supportBase: "/subwoofer/models/textures/wallsupport_baseColor.png",
    supportSpec: "/subwoofer/models/textures/wallsupport_specularf0.png",
    supportNormal: "/subwoofer/models/textures/wallsupport_normal.png",
  });

  useLayoutEffect(() => {
    // 1. All textures need flipY = false for GLTF
    Object.values(textures).forEach((t) => (t.flipY = false));

    // 2. ONLY BaseColors need sRGB color space
    textures.wallBase.colorSpace = THREE.SRGBColorSpace;
    textures.supportBase.colorSpace = THREE.SRGBColorSpace;

    // 3. Normal and Specular maps MUST remain Linear (No colorSpace change needed)
  }, [textures]);

  return (
    <group {...props} dispose={null}>
      {/* Moving the Environment to the top level of the group so it affects both meshes */}
      <Environment files={"/Hdr/river_alcove_4k.hdr"} />

      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          {/* Wall Support Mesh */}
          <mesh geometry={nodes.Object_4.geometry} castShadow receiveShadow>
            <meshStandardMaterial
              map={textures.supportBase}
              normalMap={textures.supportNormal}
              metalnessMap={textures.supportSpec}
              roughnessMap={textures.supportSpec}
              metalness={1}
              roughness={1}
            />
          </mesh>

          {/* Wall Speaker Mesh */}
          <mesh geometry={nodes.Object_5.geometry} castShadow receiveShadow>
            <meshStandardMaterial
              map={textures.wallBase}
              normalMap={textures.wallNormal}
              metalness={0.2} // Manual value if no map is provided
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/subwoofer/models/scene.gltf");
