"use client";

import ScrollPlayer from "./ScrollPlayer";
import SecurityPosture from "./SecurityPosture";

export default function SecurityPosturePlayer() {
  return (
    <ScrollPlayer
      component={SecurityPosture}
      durationInFrames={390}
      fps={30}
      compositionWidth={400}
      compositionHeight={300}
    />
  );
}
