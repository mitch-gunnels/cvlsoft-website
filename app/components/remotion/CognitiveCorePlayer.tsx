"use client";

import ScrollPlayer from "./ScrollPlayer";
import CognitiveCore from "./CognitiveCore";

export default function CognitiveCorePlayer() {
  return (
    <ScrollPlayer
      component={CognitiveCore}
      durationInFrames={420}
      fps={30}
      compositionWidth={400}
      compositionHeight={300}
    />
  );
}
