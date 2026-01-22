import { SpeakerPosition } from "@/types/speaker";
import { speakerTypeSelection } from "./utils";

type Props = {
  speaker: SpeakerPosition;
};

export default function Speaker3D({ speaker }: Props) {
  const SpeakerComponent = speakerTypeSelection(speaker.type);

  if (!SpeakerComponent) {
    console.warn(`Unknown speaker type: ${speaker.type}`);
    return null;
  }

  return (
    <group position={[speaker.x, speaker.y, speaker.z]}>
      <SpeakerComponent />
    </group>
  );
}
