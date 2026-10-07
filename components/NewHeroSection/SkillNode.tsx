"use client";

import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  IS_HERO_RIGHT_CLICK_ENABLED,
  LABEL_GLOW,
  PHYSICS,
} from "./config/scene.config";
import { useNetworkGroupRef } from "./NetworkGroupContext";
import { useInteractionStore } from "@/zustand";
import type { BreakpointConfig, PositionedSkillNode, Vec3 } from "./types/network";
import {
  GESTURE_THRESHOLD_PX,
  nodePressLockRef,
} from "./utils/gestureLocks";
import { removeNodePosition, setNodePosition } from "./utils/nodePositions";
import {
  clearPointerPress,
  registerPointerPress,
} from "./utils/pointerRouter";
import { getHitGeometry } from "./utils/reuse";

type SkillNodeProps = {
  /** Positioned skill data (id, label, card copy, Fibonacci position). */
  node: PositionedSkillNode;
  /** Active breakpoint metrics (size, hit area, labels). */
  config: BreakpointConfig;
  /** True below the tablet breakpoint — reserved for touch-specific behavior. */
  isMobile: boolean;
};

const SETTLED_EPS2 = 1e-8;

/**
 * Orbiting skill as Troika text (no glass sphere / Html labels).
 *
 * - Press without move → info card (left-click by default, or right-click when toggled via env)
 * - Press + move past threshold → drag, then ease back to rest
 */
function SkillNodeComponent({ node, config }: SkillNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hitGeometry = useMemo(() => getHitGeometry(), []);

  const restRef = useRef<Vec3>(node.position);
  restRef.current = node.position;

  const { gl, camera } = useThree();
  const networkGroupRef = useNetworkGroupRef();

  const pressActiveRef = useRef(false);
  const pressButtonRef = useRef<number>(0);
  const pressPointerTypeRef = useRef<string>("mouse");
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const planeRef = useRef(new THREE.Plane());
  const intersectionRef = useRef(new THREE.Vector3());
  const offsetRef = useRef(new THREE.Vector3());
  const localHitRef = useRef(new THREE.Vector3());
  const planePointRef = useRef(new THREE.Vector3());
  const camDirRef = useRef(new THREE.Vector3());
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerNdc = useRef(new THREE.Vector2());
  const dragTargetRef = useRef<THREE.Vector3 | null>(null);
  const planeReadyRef = useRef(false);
  const currentPosRef = useRef(
    new THREE.Vector3(node.position[0], node.position[1], node.position[2]),
  );
  const canvasRectRef = useRef<DOMRect | null>(null);
  const camNormalScratch = useRef(new THREE.Vector3());

  const selectNode = useInteractionStore((s) => s.selectNode);
  const setDragging = useInteractionStore((s) => s.setDragging);

  const hitRadius = config.nodeSize * config.hitScale * 3.2;
  const fontSize = Math.max(0.22, config.labelFontSize * 0.85);

  useEffect(() => {
    return () => {
      removeNodePosition(node.id);
      if (pointerIdRef.current !== null) {
        clearPointerPress(pointerIdRef.current);
      }
      if (nodePressLockRef.current) nodePressLockRef.current = false;
    };
  }, [node.id]);

  const projectToLocal = useCallback(
    (clientX: number, clientY: number) => {
      const rect =
        canvasRectRef.current ?? gl.domElement.getBoundingClientRect();
      pointerNdc.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerNdc.current, camera);
      const hit = raycasterRef.current.ray.intersectPlane(
        planeRef.current,
        intersectionRef.current,
      );
      if (!hit) return null;
      localHitRef.current.copy(intersectionRef.current);
      networkGroupRef?.current?.worldToLocal(localHitRef.current);
      return localHitRef.current;
    },
    [camera, gl, networkGroupRef],
  );

  const setupDragPlane = useCallback(
    (clientX: number, clientY: number) => {
      const cur = currentPosRef.current;
      camera.getWorldDirection(camDirRef.current);
      planePointRef.current.copy(cur);
      const group = networkGroupRef?.current;
      if (group) group.localToWorld(planePointRef.current);
      camNormalScratch.current.copy(camDirRef.current).negate();
      planeRef.current.setFromNormalAndCoplanarPoint(
        camNormalScratch.current,
        planePointRef.current,
      );

      const local = projectToLocal(clientX, clientY);
      if (local) {
        offsetRef.current.set(cur.x - local.x, cur.y - local.y, cur.z - local.z);
        dragTargetRef.current = new THREE.Vector3(cur.x, cur.y, cur.z);
      }
      planeReadyRef.current = true;
    },
    [camera, networkGroupRef, projectToLocal],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const [rx, ry, rz] = restRef.current;
    const cur = currentPosRef.current;
    let x: number;
    let y: number;
    let z: number;

    if (draggingRef.current && dragTargetRef.current) {
      x = dragTargetRef.current.x;
      y = dragTargetRef.current.y;
      z = dragTargetRef.current.z;
    } else {
      const dx = rx - cur.x;
      const dy = ry - cur.y;
      const dz = rz - cur.z;
      if (dx * dx + dy * dy + dz * dz < SETTLED_EPS2) {
        if (cur.x !== rx || cur.y !== ry || cur.z !== rz) {
          cur.set(rx, ry, rz);
          group.position.set(rx, ry, rz);
          setNodePosition(node.id, rx, ry, rz);
        }
        return;
      }
      x = THREE.MathUtils.damp(cur.x, rx, PHYSICS.returnDamping, delta);
      y = THREE.MathUtils.damp(cur.y, ry, PHYSICS.returnDamping, delta);
      z = THREE.MathUtils.damp(cur.z, rz, PHYSICS.returnDamping, delta);
    }

    cur.set(x, y, z);
    group.position.set(x, y, z);
    setNodePosition(node.id, x, y, z);
  });

  const beginPress = useCallback(
    (
      clientX: number,
      clientY: number,
      pointerId: number,
      button: number,
      pointerType: string,
    ) => {
      pressActiveRef.current = true;
      pressButtonRef.current = button;
      pressPointerTypeRef.current = pointerType;
      draggingRef.current = false;
      planeReadyRef.current = false;
      pointerIdRef.current = pointerId;
      pointerDownPos.current = { x: clientX, y: clientY };
      nodePressLockRef.current = true;
      dragTargetRef.current = null;
      canvasRectRef.current = gl.domElement.getBoundingClientRect();

      try {
        gl.domElement.setPointerCapture(pointerId);
      } catch {
        // ignore
      }
    },
    [gl],
  );

  const activateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (draggingRef.current) return;
      if (IS_HERO_RIGHT_CLICK_ENABLED && pressButtonRef.current === 2) return;
      draggingRef.current = true;
      setDragging(true);
      setupDragPlane(clientX, clientY);
    },
    [setDragging, setupDragPlane],
  );

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!pressActiveRef.current) return;

      const dx = clientX - pointerDownPos.current.x;
      const dy = clientY - pointerDownPos.current.y;
      const dist = Math.hypot(dx, dy);

      if (!draggingRef.current) {
        if (dist < GESTURE_THRESHOLD_PX) return;
        activateDrag(clientX, clientY);
      }

      if (!draggingRef.current) return;
      if (!planeReadyRef.current) setupDragPlane(clientX, clientY);

      const local = projectToLocal(clientX, clientY);
      if (!local) return;

      let x = local.x + offsetRef.current.x;
      let y = local.y + offsetRef.current.y;
      let z = local.z + offsetRef.current.z;

      const [rx, ry, rz] = restRef.current;
      const ox = x - rx;
      const oy = y - ry;
      const oz = z - rz;
      const offsetDist = Math.hypot(ox, oy, oz);
      if (offsetDist > PHYSICS.maxDragOffset) {
        const s = PHYSICS.maxDragOffset / offsetDist;
        x = rx + ox * s;
        y = ry + oy * s;
        z = rz + oz * s;
      }

      if (!dragTargetRef.current) {
        dragTargetRef.current = new THREE.Vector3(x, y, z);
      } else {
        dragTargetRef.current.set(x, y, z);
      }
    },
    [activateDrag, projectToLocal, setupDragPlane],
  );

  const endInteraction = useCallback(
    (native?: PointerEvent) => {
      if (!pressActiveRef.current) return;

      const wasDrag = draggingRef.current;
      const pid = pointerIdRef.current;
      const button = pressButtonRef.current;
      const isTouch = pressPointerTypeRef.current === "touch";

      pressActiveRef.current = false;
      draggingRef.current = false;
      planeReadyRef.current = false;
      dragTargetRef.current = null;
      pointerIdRef.current = null;
      nodePressLockRef.current = false;
      canvasRectRef.current = null;

      if (pid !== null) clearPointerPress(pid);

      if (wasDrag) {
        setDragging(false);
      } else {
        const shouldSelect = IS_HERO_RIGHT_CLICK_ENABLED
          ? button === 2 || isTouch
          : button === 0 || isTouch;

        if (shouldSelect) {
          const cur = currentPosRef.current;
          selectNode(node.id, node, [cur.x, cur.y, cur.z]);
        }
      }

      if (native?.pointerId !== undefined) {
        try {
          gl.domElement.releasePointerCapture(native.pointerId);
        } catch {
          // already released
        }
      }
    },
    [gl, node, selectNode, setDragging],
  );

  const onPointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const { clientX, clientY, pointerId, button, pointerType } =
        event.nativeEvent;
      beginPress(clientX, clientY, pointerId, button, pointerType);
      registerPointerPress(pointerId, {
        onMove: (e) => updateDrag(e.clientX, e.clientY),
        onUp: (e) => endInteraction(e),
      });
    },
    [beginPress, endInteraction, updateDrag],
  );

  const onContextMenu = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (IS_HERO_RIGHT_CLICK_ENABLED) {
        event.stopPropagation();
        event.nativeEvent.preventDefault();
      }
    },
    [],
  );


  return (
    <group
      ref={groupRef}
      position={[node.position[0], node.position[1], node.position[2]]}
    >
      <Billboard follow>
        <Text
          font={LABEL_GLOW.font}
          fontSize={fontSize}
          color={LABEL_GLOW.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={LABEL_GLOW.outlineWidth}
          outlineColor={LABEL_GLOW.outlineColor}
          outlineBlur={LABEL_GLOW.outlineBlur}
          outlineOpacity={LABEL_GLOW.outlineOpacity}
          maxWidth={2.4}
          textAlign="center"
          frustumCulled
        >
          {node.label}
        </Text>
      </Billboard>

      <mesh
        visible={true}
        geometry={hitGeometry}
        scale={hitRadius}
        frustumCulled
        onPointerDown={onPointerDown}
        onContextMenu={onContextMenu}
      />
    </group>
  );
}

const SkillNode = memo(SkillNodeComponent);
export default SkillNode;
