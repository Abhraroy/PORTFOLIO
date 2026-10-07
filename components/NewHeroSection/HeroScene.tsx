"use client";

// import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import LightingSystem from "./LightingSystem";
// import NetworkSphere from "./NetworkSphere";
import { IS_HERO_RIGHT_CLICK_ENABLED } from "./config/scene.config";
import { useInteractionStore } from "@/zustand";
import type { BreakpointConfig, BreakpointKey } from "./types/network";
import { attachPointerRouter } from "./utils/pointerRouter";

type HeroSceneProps = {
  /** Layout metrics for the current viewport. */
  config: BreakpointConfig;
  /** Resolved key: mobile | tablet | desktop. */
  breakpointKey: BreakpointKey;
};

// function PointerRouterAttach() {
//   const { gl } = useThree();
//   useEffect(() => {
//     return attachPointerRouter(gl.domElement);
//   }, [gl]);
//   return null;
// }

// /**
//  * Inner R3F tree: lights + network sphere (no physics engine).
//  */
// function SceneBody({
//   config,
//   isMobile,
// }: {
//   config: BreakpointConfig;
//   isMobile: boolean;
// }) {
//   return (
//     <>
//       <PointerRouterAttach />
//       <LightingSystem />
//       <NetworkSphere
//         config={config}
//         isMobile={isMobile}
//         cameraDistance={config.cameraDistance}
//       />
//     </>
//   );
// }

/**
 * Client-only WebGL canvas for the hero.
 * Pauses the render loop when the hero is off-screen or the tab is hidden.
 */
export default function HeroScene({ config, breakpointKey }: HeroSceneProps) {
  const isMobile = breakpointKey === "mobile";
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = (intersecting: boolean) => {
      setActive(intersecting && document.visibilityState === "visible");
    };

    const io = new IntersectionObserver(
      ([entry]) => update(!!entry?.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);

    const onVis = () => {
      const rect = el.getBoundingClientRect();
      const onScreen =
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth;
      update(onScreen);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={hostRef} className="h-full w-full">
      {/* <Canvas
        className="h-full w-full touch-none"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          premultipliedAlpha: true,
        }}
        camera={{
          position: [0, 1.2, config.cameraDistance],
          fov: isMobile ? 50 : 45,
          near: 0.1,
          far: 200,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{ background: "transparent", touchAction: "none" }}
        frameloop={active ? "always" : "never"}
        resize={{ scroll: false }}
        onContextMenu={(e) => {
          if (IS_HERO_RIGHT_CLICK_ENABLED) {
            e.preventDefault();
          }
        }}
        onPointerMissed={() => {
          const state = useInteractionStore.getState();
          if (state.isDragging) return;
          state.clearFocus();
        }}
      >
        <Suspense fallback={null}>
          <SceneBody config={config} isMobile={isMobile} />
        </Suspense>
      </Canvas> */}
    </div>
  );
}
