// utils.ts
import { Dimensions, SpeakerPosition } from "@/types/speaker";

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 1600;

export const LEGEND_WIDTH = 240;
export const HALL_X_OFFSET = LEGEND_WIDTH + 20;
export const HALL_PADDING = 20;

export const HALL = {
  x: HALL_X_OFFSET,
  y: 0,
  width: VIEWBOX_WIDTH - HALL_X_OFFSET - HALL_PADDING,
  height: VIEWBOX_HEIGHT,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/*
 * Converts world-space meters to SVG coordinates
 * X is centered for visualization
 * Z is depth
 */

function getSvgRotation(speaker: SpeakerPosition) {
  let angle = speaker.angle_horizontal ?? 0;

  if (speaker.type === "monitor") angle += 0;

  return angle;
}

export function getSvgRange(rangeM: number, dimensions: Dimensions) {
  // If rangeM is 5 and hall length is 50, this is 10% of VIEWBOX_HEIGHT.
  // 0.10 * 1600 = 160px.
  return (rangeM / dimensions.length_m) * HALL.height;
}

export function metersToSvg(
  worldX: number,
  worldZ: number,
  dimensions: Dimensions,
) {
  const centeredX = worldX - dimensions.width_m / 2;

  const clampedX = clamp(
    centeredX,
    -dimensions.width_m / 2,
    dimensions.width_m / 2,
  );

  const clampedZ = clamp(worldZ, 0, dimensions.length_m);

  return {
    cx: HALL.x + HALL.width / 2 + (clampedX / dimensions.width_m) * HALL.width,

    cy: HALL.y + (clampedZ / dimensions.length_m) * HALL.height,
  };
}

export function mapSpeakersToSvg(
  speakers: SpeakerPosition[],
  dimensions: Dimensions,
) {
  return speakers.map((sp) => ({
    ...sp,
    ...metersToSvg(sp.x, sp.z, dimensions),
    rotation: getSvgRotation(sp),
  }));
}
