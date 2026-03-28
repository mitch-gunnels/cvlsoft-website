"use client";

import ScrollPlayer from "./ScrollPlayer";
import LearningLoop from "./LearningLoop";

export default function LearningLoopPlayer() {
  return (
    <ScrollPlayer
      component={LearningLoop}
      durationInFrames={450}
      fps={30}
      compositionWidth={400}
      compositionHeight={300}
    />
  );
}
