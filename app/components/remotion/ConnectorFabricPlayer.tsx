"use client";

import ScrollPlayer from "./ScrollPlayer";
import ConnectorFabric from "./ConnectorFabric";

export default function ConnectorFabricPlayer() {
  return (
    <ScrollPlayer
      component={ConnectorFabric}
      durationInFrames={420}
      fps={30}
      compositionWidth={400}
      compositionHeight={300}
    />
  );
}
