import type { BreakpointConfig, BreakpointKey } from "../types/network";

/**
 * Responsive layout metrics for the network sphere.
 *
 * Satellite nodes are Troika text (not spheres); `labelFontSize` sizes that text.
 * `showLabels` is retained for type compatibility but unused (text *is* the node).
 */
export const BREAKPOINTS = {
  mobile: {
    minWidth: 0,
    // Smaller radius + farther camera so the full sphere fits the padded inset
    radius: 4,
    nodeCount: 15,
    showLabels: false,
    hitScale: 1.5,
    cameraDistance: 24,
    centerSize: 0.48,
    nodeSize: 0.22,
    holdMs: 500,
    labelFontSize: 0.32,
  },
  tablet: {
    minWidth: 768,
    radius: 7,
    nodeCount: 22,
    showLabels: false,
    hitScale: 1.15,
    cameraDistance: 20,
    centerSize: 0.7,
    nodeSize: 0.26,
    holdMs: 500,
    labelFontSize: 0.36,
  },
  desktop: {
    minWidth: 1280,
    radius: 9,
    nodeCount: 36,
    showLabels: false,
    hitScale: 1,
    cameraDistance: 97,
    centerSize: 0.9,
    nodeSize: 0.08,
    holdMs: 500,
    labelFontSize: 0,
  },
} as const satisfies Record<BreakpointKey, BreakpointConfig>;

/**
 * Picks mobile / tablet / desktop from viewport width.
 */
export function resolveBreakpointKey(width: number): BreakpointKey {
  if (width >= BREAKPOINTS.desktop.minWidth) return "desktop";
  if (width >= BREAKPOINTS.tablet.minWidth) return "tablet";
  return "mobile";
}

/**
 * Returns the full breakpoint config object for a width.
 */
export function getBreakpointConfig(width: number): BreakpointConfig {
  return BREAKPOINTS[resolveBreakpointKey(width)];
}
