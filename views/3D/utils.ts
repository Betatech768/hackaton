import FrontFill from "./Speakers/FrontFill";
import StageMonitor from "./Speakers/StageMonitors";
import Subwoofer from "./Speakers/Subwoofers";
import LineArray from "./Speakers/LineArrays";
import DelaySpeaker from "./Speakers/DelaySpeakers";

const speakersArray = {
  fill: FrontFill,
  subwoofer: Subwoofer,
  monitor: StageMonitor,
  main: LineArray,
  delay: DelaySpeaker,
} as const;

type SpeakerType = keyof typeof speakersArray;

export function speakerTypeSelection(type: string) {
  console.log("Rendering speaker:", type);

  return speakersArray[type as SpeakerType] || null;
}
