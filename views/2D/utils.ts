import { Dimensions, SpeakerPosition } from "@/types/speaker";

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 1600;

export const HALL = {
  x: VIEWBOX_WIDTH * 0.2,
  y: 0,
  width: VIEWBOX_WIDTH * 0.6,
  height: VIEWBOX_HEIGHT,
};

export function metersToSvg(x: number, y: number, dimensions: Dimensions) {
  return {
    cx: HALL.x + HALL.width / 2 + (x / dimensions.width_m) * HALL.width,

    cy: HALL.y + (y / dimensions.length_m) * HALL.height,
  };
}

export function mapSpeakersToSvg(
  speakers: SpeakerPosition[],
  dimensions: Dimensions,
) {
  return speakers.map((sp) => ({
    ...sp,
    ...metersToSvg(sp.x, sp.y, dimensions),
  }));
}
