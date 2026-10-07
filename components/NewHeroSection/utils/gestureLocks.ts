/**
 * Shared gesture locks for camera orbit vs skill-node press/drag.
 * Read in useFrame — not React state — to avoid re-render lag.
 */

/** True while any skill node has an active press (before or during drag). */
export const nodePressLockRef = { current: false };

/** Pixels of movement before a node press becomes a drag / empty-space orbit engages. */
export const GESTURE_THRESHOLD_PX = 6;

/** @returns True when a node press/drag should block camera orbit. */
export function isNodePointerLocked(): boolean {
  return nodePressLockRef.current;
}
