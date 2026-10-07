"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CAMERA, defaultCameraTarget } from "./config/scene.config";
import { dragPauseRef } from "@/zustand";
import {
  GESTURE_THRESHOLD_PX,
  isNodePointerLocked,
  nodePressLockRef,
} from "./utils/gestureLocks";

type CameraManagerProps = {
  /**
   * Initial distance from the origin (from breakpoint `cameraDistance`).
   * Sets starting pose only — zoom is disabled afterward.
   */
  cameraDistance: number;
};

const ORBIT_SPEED = 0.005;

/**
 * Locked framing with optional left-click + drag orbit.
 *
 * - Mouse move / enter / leave: camera stays still
 * - Left-click + drag on empty space: orbits the camera
 * - No orbit while a skill node is pressed or dragged
 * - No zoom
 *
 * @param props.cameraDistance - Initial framing distance
 */
export default function CameraManager({ cameraDistance }: CameraManagerProps) {
  const { camera, gl } = useThree();

  const targetRef = useRef(
    new THREE.Vector3(
      CAMERA.defaultLookAt[0],
      CAMERA.defaultLookAt[1],
      CAMERA.defaultLookAt[2],
    ),
  );
  const sphericalRef = useRef(new THREE.Spherical());
  const offsetRef = useRef(new THREE.Vector3());

  const orbitingRef = useRef(false);
  const armedRef = useRef(false);
  const passedThresholdRef = useRef(false);
  const needsSyncRef = useRef(true);
  const pointerIdRef = useRef<number | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const lastRef = useRef({ x: 0, y: 0 });

  // Initial lens + pose from breakpoint distance
  useEffect(() => {
    const framing = defaultCameraTarget(cameraDistance);
    camera.near = CAMERA.near;
    camera.far = CAMERA.far;
    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = CAMERA.fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }

    camera.position.set(
      framing.position[0],
      framing.position[1],
      framing.position[2],
    );
    camera.lookAt(targetRef.current);

    offsetRef.current.copy(camera.position).sub(targetRef.current);
    sphericalRef.current.setFromVector3(offsetRef.current);
    needsSyncRef.current = true;
  }, [camera, cameraDistance]);

  // Left-click + drag orbit only — ignore free mouse move / enter / leave
  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (
        isNodePointerLocked() ||
        nodePressLockRef.current ||
        dragPauseRef.current
      ) {
        return;
      }

      armedRef.current = true;
      orbitingRef.current = false;
      passedThresholdRef.current = false;
      pointerIdRef.current = e.pointerId;
      startRef.current = { x: e.clientX, y: e.clientY };
      lastRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = (e: PointerEvent) => {
      if (!armedRef.current) return;
      if (
        pointerIdRef.current !== null &&
        e.pointerId !== pointerIdRef.current
      ) {
        return;
      }
      // Require left button still held (mouse); touch keeps contact via capture
      if (e.pointerType === "mouse" && (e.buttons & 1) === 0) {
        armedRef.current = false;
        orbitingRef.current = false;
        return;
      }
      if (
        isNodePointerLocked() ||
        nodePressLockRef.current ||
        dragPauseRef.current
      ) {
        armedRef.current = false;
        orbitingRef.current = false;
        return;
      }

      if (!passedThresholdRef.current) {
        const fromStart = Math.hypot(
          e.clientX - startRef.current.x,
          e.clientY - startRef.current.y,
        );
        if (fromStart < GESTURE_THRESHOLD_PX) return;
        passedThresholdRef.current = true;
        orbitingRef.current = true;
        lastRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      lastRef.current = { x: e.clientX, y: e.clientY };

      const spherical = sphericalRef.current;
      spherical.theta -= dx * ORBIT_SPEED;
      spherical.phi -= dy * ORBIT_SPEED;
      spherical.phi = Math.max(
        Math.PI * 0.2,
        Math.min(Math.PI * 0.8, spherical.phi),
      );
      spherical.makeSafe();
      needsSyncRef.current = true;
    };

    const onUp = (e: PointerEvent) => {
      if (
        pointerIdRef.current !== null &&
        e.pointerId !== pointerIdRef.current
      ) {
        return;
      }
      armedRef.current = false;
      orbitingRef.current = false;
      passedThresholdRef.current = false;
      pointerIdRef.current = null;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  // Apply spherical pose only while orbiting or after a dirty sync
  useFrame(() => {
    if (!orbitingRef.current && !needsSyncRef.current) return;
    offsetRef.current.setFromSpherical(sphericalRef.current);
    camera.position.copy(targetRef.current).add(offsetRef.current);
    camera.lookAt(targetRef.current);
    if (!orbitingRef.current) needsSyncRef.current = false;
  });

  return null;
}
