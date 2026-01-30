import { Dimensions, StageData } from "@/types/speaker";

type Props = {
  stage?: StageData;
  dimensions?: Dimensions;
};

export default function StageArea({ stage, dimensions }: Props) {
  const STAGE_HEIGHT = 0.6;
  if (!stage) return null;
  if (!dimensions) return null;
  // const { length_m } = dimensions || {};
  const { height_m, width_m, length_m, stage_position } = stage;

  return (
    <mesh
      position={[
        dimensions.width_m / 2,
        STAGE_HEIGHT / 2,
        stage_position.z_m + length_m / 2,
      ]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[width_m, height_m, length_m]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
}
