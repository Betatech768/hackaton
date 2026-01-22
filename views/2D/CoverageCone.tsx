export default function CoverageCone({
  color,
  depth = 350,
  width = 200,
}: {
  color: string;
  depth?: number;
  width?: number;
}) {
  return (
    <polygon
      points={`0,0 ${-width / 2},${depth} ${width / 2},${depth}`}
      fill={color}
      opacity={0.2}
    />
  );
}
