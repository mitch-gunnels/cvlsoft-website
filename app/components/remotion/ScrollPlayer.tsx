"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState, type ComponentType } from "react";

interface ScrollPlayerProps {
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
}

export default function ScrollPlayer({
  component,
  durationInFrames,
  fps,
  compositionWidth,
  compositionHeight,
}: ScrollPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          playerRef.current?.seekTo(0);
          playerRef.current?.play();
        }
      },
      { threshold: 0.75 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasStarted]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        autoPlay={false}
        loop
        controls={false}
        showPosterWhenPaused={false}
        inputProps={{}}
      />
    </div>
  );
}
