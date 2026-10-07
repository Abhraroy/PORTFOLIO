"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ROTATION } from "../config/scene.config";
import { dragPauseRef } from "@/zustand";

/**
 * Returns a ref for a THREE.Group that auto-rotates each frame on Y only.
 * Frame-rate independent (`delta`); pauses while a node is being dragged.
 *
 * Pitch (X) is intentionally not accumulated — continuous Euler X flips the sphere.
 *
 * @param enabled - When false, the group still exists but does not spin
 * @returns Ref to attach to the rotating `<group>`
 */
export function useAutoRotate(enabled = true) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || !enabled || dragPauseRef.current) return;
    // Keep pitch locked so Euler X never drifts into a visual flip
    group.rotation.x = 0;
    group.rotation.z = 0;
    group.rotation.y = (group.rotation.y + ROTATION.speedY * delta) % (Math.PI * 2);
  });

  return groupRef;
}
