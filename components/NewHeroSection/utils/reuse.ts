import * as THREE from "three";
import { HIT_SPHERE_SEGMENTS, SPHERE_GEOMETRY } from "../config/scene.config";

/** Shared unit-sphere geometries — create once, scale per mesh. */
let centerGeometry: THREE.SphereGeometry | null = null;
let hitGeometry: THREE.SphereGeometry | null = null;

/** @returns Shared geometry for the center brand sphere (radius 1, scaled in JSX). */
export function getCenterGeometry(): THREE.SphereGeometry {
  if (!centerGeometry) {
    centerGeometry = new THREE.SphereGeometry(
      1,
      SPHERE_GEOMETRY.widthSegments,
      SPHERE_GEOMETRY.heightSegments,
    );
  }
  return centerGeometry;
}

/** @returns Shared low-poly geometry for invisible hit volumes. */
export function getHitGeometry(): THREE.SphereGeometry {
  if (!hitGeometry) {
    hitGeometry = new THREE.SphereGeometry(
      1,
      HIT_SPHERE_SEGMENTS.widthSegments,
      HIT_SPHERE_SEGMENTS.heightSegments,
    );
  }
  return hitGeometry;
}
