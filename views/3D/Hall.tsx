import { Dimensions } from "@/types/speaker";

type Props = {
  dimensions?: Dimensions;
};
export default function Hall({ dimensions }: Props) {
  if (!dimensions) return null;
  const { width_m, length_m, height_m = 8 } = dimensions;

  return (
    <mesh position={[0, height_m / 2, length_m / 2]}>
      <boxGeometry args={[width_m, height_m, length_m]} />
      <meshStandardMaterial color="#fff" wireframe transparent opacity={0.4} />
    </mesh>
  );
}
