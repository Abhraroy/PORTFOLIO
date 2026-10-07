"use client";

import { useMemo } from "react";
import CameraManager from "./CameraManager";
import CenterNode from "./CenterNode";
import ConnectionLines from "./ConnectionLines";
import { CONNECTIONS } from "./config/scene.config";
import { useAutoRotate } from "./hooks/useAutoRotate";
import { useFibonacciSphere } from "./hooks/useFibonacciSphere";
import InteractionLayer from "./InteractionLayer";
import { NetworkGroupProvider } from "./NetworkGroupContext";
import SkillNode from "./SkillNode";
import type { BreakpointConfig } from "./types/network";

type NetworkSphereProps = {
  /** Active breakpoint metrics (radius, counts, sizes). */
  config: BreakpointConfig;
  /** True on mobile breakpoint. */
  isMobile: boolean;
  /** Initial camera distance passed through to CameraManager. */
  cameraDistance: number;
};

/**
 * Rotating parent group that owns center, skills, lines, and the info-card layer.
 */
export default function NetworkSphere({
  config,
  isMobile,
  cameraDistance,
}: NetworkSphereProps) {
  const groupRef = useAutoRotate(true);
  const nodes = useFibonacciSphere(config.nodeCount, config.radius);
  const showLines = CONNECTIONS.opacity > 0;

  return (
    <NetworkGroupProvider groupRef={groupRef}>
      <CameraManager cameraDistance={cameraDistance} />
      <group ref={groupRef}>
        <CenterNode size={config.centerSize} />
        {showLines ? <ConnectionLines nodes={nodes} /> : null}
        {nodes.map((node) => (
          <SkillNode
            key={node.id}
            node={node}
            config={config}
            isMobile={isMobile}
          />
        ))}
        <InteractionLayer />
      </group>
    </NetworkGroupProvider>
  );
}
