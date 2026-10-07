"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import type { Group } from "three";
import InfoCard from "./InfoCard";
import { useInteractionStore } from "@/zustand";
import { getNodePosition } from "./utils/nodePositions";

/**
 * Follows the selected node and mounts `InfoCard`.
 * Escape clears focus; canvas misses are handled in HeroScene.
 * Card world follow runs in `useFrame` via the position registry.
 */
export default function InteractionLayer() {
  const groupRef = useRef<Group>(null);
  const activeCard = useInteractionStore((s) => s.activeCard);
  const clearFocus = useInteractionStore((s) => s.clearFocus);
  const nodeIdRef = useRef<string | null>(null);
  nodeIdRef.current = activeCard?.nodeId ?? null;

  const onClose = useCallback(() => {
    clearFocus();
  }, [clearFocus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearFocus();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [clearFocus]);

  useFrame(() => {
    const id = nodeIdRef.current;
    const group = groupRef.current;
    if (!id || !group) return;
    const pos = getNodePosition(id);
    if (!pos) return;
    group.position.copy(pos);
  });

  if (!activeCard) return null;

  return (
    <group
      ref={groupRef}
      position={activeCard.worldPosition as [number, number, number]}
    >
      <InfoCard card={activeCard} onClose={onClose} />
    </group>
  );
}
