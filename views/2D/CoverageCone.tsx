import { Dimensions } from "@/types/speaker";
import { getSvgRange } from "./utils";

export default function CoverageCone({
  dimensions,
  color,
  range = 350, // This is your 'visualRange' from utils
  dispersionAngle = 90, // Standard horizontal spread
}: {
  dimensions: Dimensions;
  color: string;
  range?: number;
  dispersionAngle?: number;
}) {
  const angleInRadians = (dispersionAngle * Math.PI) / 180;

  // scale range into SVG space
  const svgRange = getSvgRange(range, dimensions);

  // calculate width using SVG range
  const halfWidth = svgRange * Math.tan(angleInRadians / 2);

  return (
    <polygon
      points={`0,0 ${-halfWidth},${svgRange} ${halfWidth},${svgRange}`}
      fill={color}
      opacity={0.2}
    />
  );
}
