"use client";

/**
 * Soft key / fill / rim lighting for a dark premium network hero.
 */
export default function LightingSystem() {
  return (
    <>
      <ambientLight intensity={0.35} color="#d4d4d8" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.15}
        color="#fafafa"
        castShadow={false}
      />
      <directionalLight
        position={[-6, -4, -8]}
        intensity={0.35}
        color="#a1a1aa"
      />
      <pointLight position={[0, 0, 0]} intensity={0.55} color="#e4e4e7" distance={18} decay={2} />
      <hemisphereLight color="#27272a" groundColor="#09090b" intensity={0.45} />
    </>
  );
}
