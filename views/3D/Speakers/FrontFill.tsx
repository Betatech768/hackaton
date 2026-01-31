import * as THREE from "three";
import { JSX, useLayoutEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
  };
  materials: {
    speaker_foam: THREE.MeshStandardMaterial;
    speaker_main: THREE.MeshStandardMaterial;
    speaker_plates: THREE.MeshStandardMaterial;
    speaker_shiny: THREE.MeshStandardMaterial;
  };
};

export default function FrontFill(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/front/models/scene.gltf",
  ) as unknown as GLTFResult;

  // 1. Load textures based on your provided directory structure
  const textures = useTexture({
    mainColor: "/front/models/textures/speaker_main_baseColor.jpeg",
    mainMR: "/front/models/textures/speaker_main_metallicRoughness.png",
    foamMR: "/front/models/textures/speaker_foam_metallicRoughness.png",
    platesMR: "/front/models/textures/speaker_plates_metallicRoughness.png",
  });

  // 2. Configure textures globally
  useLayoutEffect(() => {
    Object.values(textures).forEach((t) => {
      t.flipY = false; // Prevents textures from appearing upside down on the mesh
    });
    // Only the BaseColor needs sRGB encoding
    textures.mainColor.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  return (
    <group {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        {/* Adjusted rotation for upright standing: [Math.PI / 2, 0, 0] */}
        <group name="Sketchfab_model" rotation={[Math.PI / 2, 0, 1.5]}>
          <group name="speakerobjcleanermaterialmergergles">
            {/* Object_2: Speaker Foam */}
            <mesh geometry={nodes.Object_2.geometry} castShadow receiveShadow>
              <meshStandardMaterial
                metalnessMap={textures.foamMR}
                roughnessMap={textures.foamMR}
                color="#222222" // Adjusting base color as foam usually doesn't have a unique color map
              />
            </mesh>

            {/* Object_3: Speaker Main Body */}
            <mesh geometry={nodes.Object_3.geometry} castShadow receiveShadow>
              <meshStandardMaterial
                map={textures.mainColor}
                metalnessMap={textures.mainMR}
                roughnessMap={textures.mainMR}
              />
            </mesh>

            {/* Object_4: Speaker Plates */}
            <mesh geometry={nodes.Object_4.geometry} castShadow receiveShadow>
              <meshStandardMaterial
                metalnessMap={textures.platesMR}
                roughnessMap={textures.platesMR}
                color="#333333"
              />
            </mesh>

            {/* Object_5: Shiny Bits */}
            <mesh geometry={nodes.Object_5.geometry} castShadow receiveShadow>
              <meshStandardMaterial
                color="#ffffff"
                metalness={1}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/front/models/scene.gltf");
