"use client";

import { createContext, useContext, type RefObject } from "react";
import type { Group } from "three";

const NetworkGroupContext = createContext<RefObject<Group | null> | null>(null);

/**
 * Provides the rotating NetworkSphere group ref so children can convert
 * world ↔ local space (drag projection, camera helpers).
 *
 * @param props.groupRef - Ref from `useAutoRotate`
 * @param props.children - Scene subtree inside the provider
 */
export function NetworkGroupProvider({
  groupRef,
  children,
}: {
  groupRef: RefObject<Group | null>;
  children: React.ReactNode;
}) {
  return (
    <NetworkGroupContext.Provider value={groupRef}>
      {children}
    </NetworkGroupContext.Provider>
  );
}

/** @returns Rotating network group ref, or null outside the provider */
export function useNetworkGroupRef(): RefObject<Group | null> | null {
  return useContext(NetworkGroupContext);
}
