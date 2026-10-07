import type { MutableVec3, Vec3 } from "../types/network";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Deterministic Fibonacci sphere positions on a sphere surface.
 * Even distribution — no force-directed simulation.
 *
 * @param count - Number of points to generate (≥ 0)
 * @param radius - Sphere radius in world units
 * @returns Array of `[x, y, z]` positions of length `count`
 */
export function fibonacciSphere(count: number, radius: number): Vec3[] {
  if (count <= 0) return [];

  const points: Vec3[] = [];
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push([x * radius, y * radius, z * radius]);
  }
  return points;
}

export function cloneVec3(v: Vec3): MutableVec3 {
  return [v[0], v[1], v[2]];
}

export function distanceSq(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
