"use client";

import ScrollPlayer from "./ScrollPlayer";
import TacitKnowledge from "./TacitKnowledge";

export default function TacitKnowledgePlayer() {
  return (
    <ScrollPlayer
      component={TacitKnowledge}
      durationInFrames={360}
      fps={30}
      compositionWidth={400}
      compositionHeight={300}
    />
  );
}
