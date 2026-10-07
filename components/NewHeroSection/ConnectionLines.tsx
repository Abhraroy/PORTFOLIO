"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CONNECTIONS } from "./config/scene.config";
import type { PositionedSkillNode, Vec3 } from "./types/network";
import { consumePositionsDirty, getNodePosition } from "./utils/nodePositions";

type ConnectionLinesProps = {
  /** Positioned skill nodes with Fibonacci rest positions. */
  nodes: readonly PositionedSkillNode[];
};

type SphericalEdge = {
  idA: string;
  idB: string;
  posA: Vec3;
  posB: Vec3;
  seed: number;
};

/**
 * Computes unique nearest-neighbor edges between skill nodes on the sphere.
 */
function computeSphericalEdges(
  nodes: readonly PositionedSkillNode[],
  kNeighbors: number,
): SphericalEdge[] {
  const n = nodes.length;
  if (n < 2) return [];

  const edgeSet = new Set<string>();
  const edges: SphericalEdge[] = [];

  for (let i = 0; i < n; i++) {
    const nodeA = nodes[i];
    const [ax, ay, az] = nodeA.position;

    // Rank other nodes by distance
    const neighbors: { index: number; distSq: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const [bx, by, bz] = nodes[j].position;
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      neighbors.push({ index: j, distSq: dx * dx + dy * dy + dz * dz });
    }

    neighbors.sort((a, b) => a.distSq - b.distSq);
    const k = Math.min(kNeighbors, neighbors.length);

    for (let m = 0; m < k; m++) {
      const j = neighbors[m].index;
      const nodeB = nodes[j];
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        // Distribute phases organically using golden ratio hash
        const seed = ((edges.length + 1) * 0.6180339887) % 1.0;
        edges.push({
          idA: nodeA.id,
          idB: nodeB.id,
          posA: nodeA.position,
          posB: nodeB.position,
          seed,
        });
      }
    }
  }

  return edges;
}

const vertexShader = /* glsl */ `
  attribute float aProgress;
  attribute float aSeed;

  varying float vProgress;
  varying float vSeed;

  void main() {
    vProgress = aProgress;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uPulseColor;
  uniform float uBaseOpacity;
  uniform float uPulseOpacity;
  uniform float uTime;
  uniform float uPulseLength;
  uniform float uFlowEnabled;

  varying float vProgress;
  varying float vSeed;

  void main() {
    if (uFlowEnabled > 0.5) {
      // Loop pulse along the curve (0 -> 1) with an asynchronous phase per edge
      float travel = fract(vProgress - uTime + vSeed);

      // Smooth energetic head with trailing falloff
      float pulse = smoothstep(1.0 - uPulseLength, 1.0, travel);
      pulse = pow(pulse, 2.4);

      vec3 color = mix(uBaseColor, uPulseColor, pulse);
      float opacity = mix(uBaseOpacity, uPulseOpacity, pulse);

      gl_FragColor = vec4(color, opacity);
    } else {
      gl_FragColor = vec4(uBaseColor, uBaseOpacity);
    }
  }
`;

function updateLinePositions(
  edges: readonly SphericalEdge[],
  segments: number,
  offset: number,
  positions: Float32Array,
  positionAttr: THREE.BufferAttribute,
): void {
  let writeIdx = 0;

  for (let e = 0; e < edges.length; e++) {
    const edge = edges[e];
    const liveA = getNodePosition(edge.idA);
    const liveB = getNodePosition(edge.idB);

    const ax = liveA ? liveA.x : edge.posA[0];
    const ay = liveA ? liveA.y : edge.posA[1];
    const az = liveA ? liveA.z : edge.posA[2];

    const bx = liveB ? liveB.x : edge.posB[0];
    const by = liveB ? liveB.y : edge.posB[1];
    const bz = liveB ? liveB.z : edge.posB[2];

    const ra = Math.sqrt(ax * ax + ay * ay + az * az);
    const rb = Math.sqrt(bx * bx + by * by + bz * bz);

    // Compute intermediate curve points on the spherical surface
    for (let s = 0; s < segments; s++) {
      const t0 = s / segments;
      const t1 = (s + 1) / segments;

      // Vertex 1 of segment
      const vx0 = (1 - t0) * ax + t0 * bx;
      const vy0 = (1 - t0) * ay + t0 * by;
      const vz0 = (1 - t0) * az + t0 * bz;
      const len0 = Math.sqrt(vx0 * vx0 + vy0 * vy0 + vz0 * vz0);
      const targetR0 = (1 - t0) * ra + t0 * rb + offset;
      const scale0 = len0 > 1e-6 ? targetR0 / len0 : 1;

      positions[writeIdx++] = vx0 * scale0;
      positions[writeIdx++] = vy0 * scale0;
      positions[writeIdx++] = vz0 * scale0;

      // Vertex 2 of segment
      const vx1 = (1 - t1) * ax + t1 * bx;
      const vy1 = (1 - t1) * ay + t1 * by;
      const vz1 = (1 - t1) * az + t1 * bz;
      const len1 = Math.sqrt(vx1 * vx1 + vy1 * vy1 + vz1 * vz1);
      const targetR1 = (1 - t1) * ra + t1 * rb + offset;
      const scale1 = len1 > 1e-6 ? targetR1 / len1 : 1;

      positions[writeIdx++] = vx1 * scale1;
      positions[writeIdx++] = vy1 * scale1;
      positions[writeIdx++] = vz1 * scale1;
    }
  }

  positionAttr.needsUpdate = true;
}

/**
 * Renders curved node-to-node connection lines forming a 3D spherical geodesic mesh
 * with animated data packets / energy pulses traveling continuously along edges.
 */
export default function ConnectionLines({ nodes }: ConnectionLinesProps) {
  const pulsePhase = useRef(0);
  const segments = Math.max(2, CONNECTIONS.segmentsPerCurve);
  const offset = CONNECTIONS.curvatureRadiusOffset;

  // Build the graph edges based on spatial proximity
  const edges = useMemo(() => {
    return computeSphericalEdges(nodes, CONNECTIONS.kNeighbors);
  }, [nodes]);

  // Allocate batched buffer geometry + shader material
  const { lineMesh, positionAttr, positions, uniforms } = useMemo(() => {
    const edgeCount = edges.length;
    const vertexCount = edgeCount * segments * 2;
    const posArray = new Float32Array(vertexCount * 3);
    const progressArray = new Float32Array(vertexCount);
    const seedArray = new Float32Array(vertexCount);

    let attrIdx = 0;
    for (let e = 0; e < edgeCount; e++) {
      const seed = edges[e].seed;
      for (let s = 0; s < segments; s++) {
        const t0 = s / segments;
        const t1 = (s + 1) / segments;

        progressArray[attrIdx] = t0;
        seedArray[attrIdx] = seed;
        attrIdx++;

        progressArray[attrIdx] = t1;
        seedArray[attrIdx] = seed;
        attrIdx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(posArray, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("aProgress", new THREE.BufferAttribute(progressArray, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seedArray, 1));

    const shaderUniforms: Record<string, THREE.IUniform> = {
      uBaseColor: { value: new THREE.Color(CONNECTIONS.color) },
      uPulseColor: { value: new THREE.Color(CONNECTIONS.pulseColor) },
      uBaseOpacity: { value: CONNECTIONS.opacity },
      uPulseOpacity: { value: CONNECTIONS.pulseOpacity },
      uTime: { value: 0 },
      uPulseLength: { value: CONNECTIONS.pulseLength },
      uFlowEnabled: { value: CONNECTIONS.flowEnabled ? 1.0 : 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: shaderUniforms,
      transparent: true,
      depthWrite: false,
    });

    const line = new THREE.LineSegments(geometry, material);
    line.frustumCulled = false;

    return {
      lineMesh: line,
      positionAttr: posAttr,
      positions: posArray,
      uniforms: shaderUniforms,
    };
  }, [edges, segments]);

  // Initial line geometry computation
  useEffect(() => {
    if (edges.length > 0) {
      updateLinePositions(edges, segments, offset, positions, positionAttr);
    }
  }, [edges, segments, offset, positions, positionAttr]);

  // Clean up WebGL resources
  useEffect(() => {
    return () => {
      lineMesh.geometry.dispose();
      (lineMesh.material as THREE.Material).dispose();
    };
  }, [lineMesh]);

  // Real-time animation & position updates
  useFrame((_, delta) => {
    if (edges.length === 0) return;

    if (CONNECTIONS.pulseEnabled) {
      pulsePhase.current =
        (pulsePhase.current + delta * CONNECTIONS.pulseSpeed) % (Math.PI * 2);
    }
    const pulse = CONNECTIONS.pulseEnabled
      ? 1 + Math.sin(pulsePhase.current) * CONNECTIONS.pulseAmplitude
      : 1;

    if (CONNECTIONS.flowEnabled) {
      // Accumulate phase modulo 1.0 to preserve maximum floating-point precision permanently
      uniforms.uTime.value =
        (uniforms.uTime.value + delta * CONNECTIONS.flowSpeed) % 1.0;
    }

    uniforms.uBaseOpacity.value = THREE.MathUtils.clamp(
      CONNECTIONS.opacity * pulse,
      0,
      1,
    );
    uniforms.uPulseOpacity.value = THREE.MathUtils.clamp(
      CONNECTIONS.pulseOpacity * pulse,
      0,
      1,
    );

    // Only recalculate line vertices and re-upload buffer when a node position actually moved
    if (consumePositionsDirty()) {
      updateLinePositions(edges, segments, offset, positions, positionAttr);
    }
  });

  return (
    <group>
      <primitive object={lineMesh} />
    </group>
  );
}
