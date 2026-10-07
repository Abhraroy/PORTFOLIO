# Portfolio Performance Audit — blankdev

**Date:** July 13, 2026  
**Scope:** React, GSAP/Lenis, Three.js / R3F / WebGL, CSS / layout / events, bundle & startup  
**Chrome Performance symptoms:** excessive `requestAnimationFrame`, scripted animations, JS execution, GPU tasks, compositing / layer management

---

## Remediation status (implemented)

| Item | Status |
|------|--------|
| One R3F hero all breakpoints; force-graph removed | Done |
| Rapier removed; damp/drag in `useFrame` | Done |
| Satellites = Troika `Text` + invisible hit mesh | Done |
| Center = shared `MeshStandardMaterial` (no transmission) | Done |
| Frameloop pauses off-screen / tab hidden | Done |
| Mobile camera/radius tuned to fit full sphere | Done |
| ConnectionLines unmounted when opacity ≤ 0 | Done |
| Shared pointer router; cached drag rect | Done |
| Showcase solid `.showcase-panel`; navbar glass kept | Done |
| Horizontal scrub: cached distance, scrub 0.6, debounced refresh | Done |
| Below-fold `dynamic()` via `HomeBelowFold` | Done |
| Experience `killTweensOf` + `startTransition` | Done |
| Breakpoint key-only updates | Done |
| Glow pause offscreen; skills `will-change` removed; modal scrim no blur | Done |
| Purged `@react-three/rapier`, `react-force-graph-3d`, `lenis`, `ogl`, `@react-spring/three` | Done |
| `optimizePackageImports` for `react-icons`, `framer-motion` | Done |

---

## Verdict

Jank is **not** from Lenis (fully disabled at runtime). Dominant costs:

1. **Always-on desktop hero WebGL** — `frameloop="always"`, Rapier WASM (~800 KB gzip), MeshPhysical transmission/clearcoat ×36, Drei `Html` labels with backdrop-blur
2. **Project Showcase scrub** — `scrub: 1.8` + per-frame `scrollWidth` + `.glass-panel` `backdrop-filter` while the track translates
3. **Fixed navbar** `backdrop-blur-xl` over scrolling content / WebGL
4. **Mobile path** — separate `react-force-graph-3d` stack + perpetual spring RAF + CSS2D

Competing loops today: **R3F always** + **GSAP scrub ticker (intermittent)** + **mobile spring RAF**. Lenis RAF = **0**.

**Desktop hero JS (last prod build):** ~3.1 MB raw / ~1.1 MB gzip (mostly Rapier). Public images are tiny — startup pain is JS/WASM, not assets.

### Estimated gains if top fixes land

| Metric | Estimate |
|--------|----------|
| FPS (mid laptop iGPU, hero + scrub) | **+15–35 FPS** |
| Main-thread / CPU (hero, esp. offscreen) | **−40–60%** |
| GPU (hero materials + glass scrub) | **−50–70%** |

---

## Ranked issues (by real-world impact)

| Rank | Issue | Severity | FPS Impact | File(s) |
| ---- | ----- | -------- | ---------- | ------- |
| 1 | MeshPhysical transmission/clearcoat ×36 + unique materials | Critical | Very High | `NewHeroSection/utils/reuse.ts`, `SkillNode.tsx` |
| 2 | Hero Canvas `frameloop="always"` (no offscreen pause) | Critical | Very High | `NewHeroSection/HeroScene.tsx` |
| 3 | Rapier WASM for kinematic-only puppets | Critical | High (CPU) + startup | `HeroScene.tsx`, `SkillNode.tsx`, `package.json` |
| 4 | `.glass-panel` backdrop-filter on GSAP-scrubbed cards | Critical | Very High (GPU) | `globals.css`, `ShowcaseCard.tsx`, `useHorizontalScroll.ts` |
| 5 | Horizontal scrub: `scrollWidth` every `onUpdate` + `scrub: 1.8` | Critical | High | `ProjectShowcase/hooks/useHorizontalScroll.ts` |
| 6 | 22–36 Drei `Html` labels + backdrop-blur every frame | Critical | Very High | `SkillNode.tsx`, `breakpoints.ts` |
| 7 | `ConnectionLines` work while `opacity: 0` + `computeBoundingSphere` | High | High | `ConnectionLines.tsx`, `scene.config.ts` |
| 8 | Navbar fixed `backdrop-blur-xl` | High | High (GPU) | `Navbar/Navbar.tsx` |
| 9 | Mobile `NetworkGraph3D` eternal spring RAF + CSS2D | High | High (mobile) | `HeroSection/NetworkGraph3D.tsx` |
| 10 | Dual 3D stacks (R3F+Rapier vs force-graph) | High | Startup / memory | `HeroSection.tsx`, `NetworkGraph3D.tsx` |
| 11 | `dpr≤2` + alpha + MSAA on expensive materials | High | High (GPU) | `HeroScene.tsx` |
| 12 | N× `pointermove` listeners + `getBoundingClientRect` in drag | High | Input path | `SkillNode.tsx`, `CameraManager.tsx` |
| 13 | Triple `ScrollTrigger.refresh` + undebounced resize | High | Load/resize spikes | `useHorizontalScroll.ts` |
| 14 | Eager below-fold GSAP/Framer/Skills on `/` | High | TTI / parse | `app/page.tsx` |
| 15 | About glow-spin ×6 infinite conic-gradients | High | Medium–High idle GPU | `globals.css`, `GlowFrame.tsx` |
| 16 | Experience `setActiveId` from ScrollTrigger | Medium | Scroll hitch | `Experience.tsx`, `useExperienceScroll.ts` |
| 17 | `useBreakpoint` `setWidth` every resize pixel | Medium | Resize | `useBreakpoint.ts` |
| 18 | Lenis disabled (good); unused deps still installed | Medium | Install / stale build | `SmoothScroll.tsx`, `package.json` |

---

## Action plan

### 1. Quick wins (&lt; 30 minutes)

1. Unmount `ConnectionLines` (config opacity is already `0`)
2. Cache showcase `distance`; lower `scrub` to `0.6` or use tween-based `x`
3. Solid `.glass-panel` on showcase cards (no `backdrop-filter` during scrub)
4. Navbar: near-opaque `bg`, remove `backdrop-blur-xl`
5. `showLabels: false` or selected-node only
6. Cap `dpr={[1, 1.5]}`; prefer `alpha: false`
7. Mobile spring RAF early-out when `springing` is empty
8. Debounce / collapse `ScrollTrigger.refresh` to one deferred pass

### 2. Medium improvements (1–4 hours)

1. `IntersectionObserver` → `frameloop="never"` when hero offscreen / tab hidden
2. Shared `MeshStandardMaterial` (drop transmission/clearcoat)
3. SkillNode / CameraManager idle early-outs in `useFrame`
4. Single canvas pointer router; cache drag `getBoundingClientRect`
5. `dynamic()` below-fold sections in `app/page.tsx`
6. Pause About `glow-spin` when offscreen
7. Experience: `startTransition` or imperative active markers
8. `useBreakpoint` key-only updates (no per-pixel width state)

### 3. Major refactors

1. **Remove `@react-three/rapier`** — drive positions in `useFrame` only (~0.8 MB gzip + WASM compile gone)
2. **One 3D stack** for all breakpoints; prefer `InstancedMesh` for skill spheres
3. Poster / defer `HeroScene` until idle or CTA; `optimizePackageImports`; purge unused `lenis` / `ogl` / `@react-spring/three`; clean rebuild

---

## RAF / loop ownership (current)

```
Native window scroll
 │
 ├─► ScrollTrigger (GSAP) ──scrub──► gsap.ticker (intermittent in #work)
 │
 ├─► Hero desktop/tablet: R3F frameloop="always" (continuous)
 │
 └─► Hero mobile: NetworkGraph3D requestAnimationFrame (continuous)

Lenis RAF: OFF
```

| Source | Frequency | Cleanup | Cost |
|--------|-----------|---------|------|
| R3F `frameloop="always"` | 60fps while mounted | Canvas unmount | Very high |
| Rapier Physics | Every frame | Unmount | High CPU/WASM |
| SkillNode `useFrame` ×N | Every frame | — | High |
| ConnectionLines `useFrame` | Every frame (waste) | dispose | Medium–High waste |
| CameraManager `useFrame` | Every frame | — | Low–Med waste |
| GSAP scrub `onUpdate` | Scroll + ~1.8s lag | `trigger.kill()` | High in `#work` |
| Experience ST + `gsap.to` | Milestone cross only | Triggers killed; tweens not | Low–Med |
| Mobile spring RAF | Always | `cancelAnimationFrame` | Medium |
| Lenis | Disabled | N/A | 0 |
| Framer Motion | Sections / cue / modals | Mostly OK | Low–Med |
| CSS glow-spin ×6 | Infinite | CSS only | Med idle GPU |
| CSS skills-marquee | Infinite | CSS | Low–Med |

**React during scrub:** none (imperative GSAP) — good.  
**React during Experience milestones:** yes (`setActiveId`).  
**React during drag:** refs + Zustand `getState` — good.

---

# Detailed findings

---

## Issue

Per-node `MeshPhysicalMaterial` with transmission + clearcoat + transparency (largest GPU cost)

## Severity

Critical

## Source Files

- `components/NewHeroSection/utils/reuse.ts`
- `components/NewHeroSection/SkillNode.tsx`
- `components/NewHeroSection/config/scene.config.ts`

## Source Code

```ts
// reuse.ts — createSkillMaterial / createCenterMaterial
transmission: MATERIALS.glassTransmission * 0.7,
clearcoat: 0.45,
transparent: true,
```

Each SkillNode: `useMemo(() => createSkillMaterial(), [])` — unique material per node.

## Why It Happens

Transmission + clearcoat on transparent meshes maximize fragment cost and block cheap opaque early-Z. Unique materials prevent batching / InstancedMesh.

## Performance Impact

FPS, GPU — dominant desktop/tablet cost. At `dpr=2`, 37 glass spheres can dominate frame time.

## Recommended Fix

Share one `MeshStandardMaterial` (or InstancedMesh + one material). Drop transmission/clearcoat unless visually required.

## Expected Improvement

40–70% GPU frame-time reduction on desktop.

---

## Issue

`frameloop="always"` + no offscreen pause

## Severity

Critical

## Source Files

- `components/NewHeroSection/HeroScene.tsx`
- `components/NewHeroSection/HeroSection.tsx`

## Source Code

```tsx
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  frameloop="always"
/>
```

## Why It Happens

Auto-rotate, connection pulse, and kinematic updates assume a perpetual loop. Nothing switches to `demand`/`never` when the canvas leaves the viewport.

## Performance Impact

FPS, Main Thread, GPU, battery — full 3D cost continues while scrolling Experience/Showcase.

## Recommended Fix

`IntersectionObserver` + `visibilitychange` → `frameloop={visible ? "always" : "never"}` (or `demand` + `invalidate` on interaction).

## Expected Improvement

Near 100% 3D cost eliminated while scrolled away.

---

## Issue

Rapier `Physics` wrapping purely kinematic position puppets

## Severity

Critical (startup) / High (runtime)

## Source Files

- `components/NewHeroSection/HeroScene.tsx`
- `components/NewHeroSection/SkillNode.tsx`
- `components/NewHeroSection/CenterNode.tsx`
- `package.json` (`@react-three/rapier`, `@dimforge/rapier3d-compat`)

## Source Code

```tsx
<Physics gravity={[0, 0, 0]} interpolate colliders={false}>
```

SkillNode: `body.setNextKinematicTranslation({ x, y, z })` every frame.

## Why It Happens

Nodes never dynamically collide; motion is damp math in JS. Rapier still ships ~2.1 MB chunk / ~800 KB gzip and steps WASM every frame.

## Performance Impact

TTI (parse + WASM compile), Memory, Main Thread (~0.5–2 ms/frame).

## Recommended Fix

Remove Rapier; set `mesh.position` / group transforms directly in `useFrame`.

## Expected Improvement

~0.8–1.0 MB gzip off desktop first load; 0.5–2 ms CPU/frame.

---

## Issue

Glassmorphism (`backdrop-filter: blur(20px)`) on GSAP-translated cards

## Severity

Critical

## Source Files

- `app/globals.css` (`.glass-panel`)
- `components/ProjectShowcase/ShowcaseCard.tsx`
- `components/ProjectShowcase/ViewAllCard.tsx`
- `components/ProjectShowcase/hooks/useHorizontalScroll.ts`

## Source Code

```css
.glass-panel {
  background: rgba(9, 9, 11, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.12),
    0 0 32px rgba(255, 255, 255, 0.06);
}
```

Track: `gsap.set(track, { x: -distance * eased, force3D: true })` every scrub tick.

## Why It Happens

Animated `backdrop-filter` forces the compositor to re-blur behind each visible card every frame while the parent transforms.

## Performance Impact

Scrolling smoothness, GPU, Compositing — severe in `#work` sticky phase.

## Recommended Fix

Opaque panels (`bg-zinc-950/95`) during scrub; or one static blurred layer behind the track, not per card.

## Expected Improvement

2–5× smoother scrub on mid-range / integrated GPUs.

---

## Issue

Horizontal scrub drives GSAP ticker and reads layout (`scrollWidth`) inside `onUpdate`

## Severity

Critical

## Source Files

- `components/ProjectShowcase/hooks/useHorizontalScroll.ts`

## Source Code

```ts
const getDistance = () =>
  Math.max(0, track.scrollWidth - window.innerWidth);

const setTrackX = (progress: number) => {
  const distance = getDistance();
  const eased = SCROLL_EASE(gsap.utils.clamp(0, 1, progress));
  gsap.set(track, { x: -distance * eased, force3D: true });
};

ScrollTrigger.create({
  scrub: 1.8,
  onUpdate: (self) => setTrackX(self.progress),
  // ...
});
```

Also: rAF + 120ms + 450ms `ScrollTrigger.refresh()`; undebounced resize; `applyHeight()` mutates section height.

## Why It Happens

`scrub: 1.8` keeps ticker work ~1.8s after scroll. `scrollWidth` forces layout every tick. Height writes can cascade with `invalidateOnRefresh`.

## Performance Impact

FPS, Main Thread, Layout, Scrolling smoothness.

## Recommended Fix

Cache `distance` on measure/refresh only; prefer `gsap.fromTo` + function-based `x`; lower scrub; debounce refresh; consider ST `pin` + dynamic `end`.

## Expected Improvement

Eliminate per-frame layout reads; shorter ticker tail after scroll.

---

## Issue

Dozens of Drei `Html` labels + `backdrop-blur` update every frame

## Severity

Critical

## Source Files

- `components/NewHeroSection/SkillNode.tsx`
- `components/NewHeroSection/CenterNode.tsx`
- `components/NewHeroSection/InfoCard.tsx`
- `components/NewHeroSection/config/breakpoints.ts`

## Source Code

```tsx
{config.showLabels ? (
  <Html center distanceFactor={18} ...>
    <span className="... backdrop-blur-sm">{node.label}</span>
  </Html>
) : null}
```

Tablet/desktop: `showLabels: true`, `nodeCount: 22–36`.

## Why It Happens

Each `Html` projects a DOM node from world matrix every frame while the sphere auto-rotates. Blur multiplies compositor cost.

## Performance Impact

Main Thread, Layout, Paint, FPS — often rivals WebGL on integrated GPUs.

## Recommended Fix

Default `showLabels: false`; label selected/hovered only; solid bg instead of blur; or sprites / Troika text.

## Expected Improvement

2–5× smoother hero FPS; 1–4 ms/frame on mid laptops.

---

## Issue

`ConnectionLines` updates invisible lines + `computeBoundingSphere()` every frame

## Severity

High

## Source Files

- `components/NewHeroSection/ConnectionLines.tsx`
- `components/NewHeroSection/config/scene.config.ts`

## Source Code

```ts
CONNECTIONS.opacity: 0,
pulseEnabled: true,
```

`useFrame`: write attrs → `needsUpdate` → `computeBoundingSphere()` → set opacity × N lines.

## Why It Happens

Lines are visually off but still pulse, upload buffers, and recompute spheres. Per-line unique materials.

## Recommended Fix

Do not mount `<ConnectionLines />` while opacity ≤ 0; if re-enabled, one `LineSegments` + one material; never `computeBoundingSphere` every frame.

## Expected Improvement

0.2–0.6 ms CPU/frame; −36 draw calls if unmounted.

---

## Issue

Fixed navbar `backdrop-blur-xl` over scrolling page

## Severity

High

## Source Files

- `components/Navbar/Navbar.tsx`

## Source Code

```tsx
"fixed ... backdrop-blur-xl bg-white/10"
```

## Why It Happens

Fixed blurred sampling region recomposites whatever scrolls underneath (including WebGL).

## Recommended Fix

Solid/near-opaque nav (`bg-zinc-950/90`) without blur.

## Expected Improvement

Steady scroll GPU reduction site-wide.

---

## Issue

Mobile ForceGraph: permanent spring `requestAnimationFrame` + CSS2D dual render

## Severity

High (mobile)

## Source Files

- `components/HeroSection/NetworkGraph3D.tsx`
- `components/HeroSection/graph-nodes.css`
- `components/HeroSection/graph.config.ts`

## Source Code

Eternal `requestAnimationFrame(tick)` even when `springing` is empty; `CSS2DRenderer` as `extraRenderers`; per-node unique geo/mat; link opacity 0.

## Recommended Fix

Start RAF only while springs active; share SphereGeometry/materials; drop label `backdrop-filter`; prefer one engine with desktop.

## Expected Improvement

Idle mobile CPU −30–60%.

---

## Issue

Dual Three.js-sized stacks + possible duplicate `three` chunks

## Severity

High

## Source Files

- `components/NewHeroSection/HeroSection.tsx` (dynamic HeroScene vs NetworkGraph3D)
- `package.json`, build chunks / `react-loadable-manifest.json`

## Why It Happens

Desktop: R3F + Rapier. Mobile: `react-force-graph-3d`. Not mounted together, but both can load in one session across 768px. Nested `three` copies possible (`stats-gl`).

## Recommended Fix

One implementation; alias `three` to a single copy; delete unused stack.

## Expected Improvement

~225 KB gzip off mobile path **or** entire R3F+Rapier off desktop if unified the other way; less memory churn.

---

## Issue

`dpr={[1, 2]}` + `antialias: true` + `alpha: true`

## Severity

High

## Source Files

- `components/NewHeroSection/HeroScene.tsx`

## Recommended Fix

`dpr={[1, 1.5]}`; match page bg and set `alpha: false`; consider `antialias: false` for small spheres.

## Expected Improvement

30–50% GPU on retina without large quality loss.

---

## Issue

N× `pointermove` on canvas + `getBoundingClientRect` every drag move

## Severity

High

## Source Files

- `components/NewHeroSection/SkillNode.tsx`
- `components/NewHeroSection/CameraManager.tsx`

## Recommended Fix

Single shared pointer router; cache rect on pointerdown/resize.

## Expected Improvement

Pointer path O(1); fewer forced reflows during drag.

---

## Issue

Per-frame object allocation in SkillNode `useFrame`

## Severity

High

## Source Files

- `components/NewHeroSection/SkillNode.tsx`

## Source Code

```ts
body.setNextKinematicTranslation({ x, y, z }); // new object × N × 60fps
```

## Recommended Fix

Reuse a scratch `{ x, y, z }` ref (or drop Rapier and `position.set`).

## Expected Improvement

Eliminates ~2k+ short-lived allocs/sec; fewer GC hitches.

---

## Issue

Experience path-fill tweens not killed; React `setActiveId` on milestone cross

## Severity

Medium

## Source Files

- `components/Experience/hooks/useExperienceScroll.ts`
- `components/Experience/Experience.tsx`

## Recommended Fix

`gsap.killTweensOf(pathFill)` on cleanup; `startTransition` for React; avoid remounting entire sticky panel via `key`.

## Expected Improvement

Cleaner teardown; lower hitch at milestone crossings.

---

## Issue

About infinite `@property` conic-gradient glow ×6

## Severity

High (idle)

## Source Files

- `app/globals.css` (`.glow-frame`, `@keyframes glow-spin`)
- `components/AboutMe/GlowFrame.tsx`

## Recommended Fix

Pause offscreen; shrink paint area; one shared decorative border; respect reduced motion.

## Expected Improvement

5–15% idle GPU through About.

---

## Issue

Eager home page pulls below-fold GSAP + Framer + Skills

## Severity

High (startup)

## Source Files

- `app/page.tsx` (static imports of AboutMe, Experience, ProjectShowcase, Skills, VisitorMode)

## Recommended Fix

Section-level `dynamic()` + intersection load; `experimental.optimizePackageImports` for `react-icons` / `framer-motion`.

## Expected Improvement

~100–200 KB gzip deferred from critical path.

---

## Issue

Lenis installed but disabled; unused deps; stale build may still ship Lenis

## Severity

Medium

## Source Files

- `components/SmoothScroll/SmoothScroll.tsx` (pass-through)
- `package.json` (`lenis`, `ogl`, `@react-spring/three` unused in live imports)
- `next.config.ts` (empty — no alias / optimizePackageImports)

## Recommended Fix

Remove unused packages; rebuild so artifacts match source. If Lenis returns: single clock via `gsap.ticker` + `autoRaf: false`.

---

## What’s already good

- Showcase horizontal scroll is **imperative GSAP** — no React re-renders per scrub tick
- Hero drag uses **refs** / `dragPauseRef` — no React re-renders on pointermove
- NetworkGraph3D hover uses **DOM classList**, not `setState`
- Experience path fill is GSAP (selection UI is the React cost)
- Geometries partly shared via `reuse.ts` (materials are not)
- `public/` assets are tiny; no large textures/GLB in tree
- Lenis correctly disabled (avoids multi-loop scroll sync today)

---

## Dependency → startup cost

| Dependency | In initial path? | Est. cost | Notes |
|------------|------------------|-----------|-------|
| Rapier via `@react-three/rapier` | Desktop hero | ~800 KB gz | #1 cost |
| `three` | Both hero paths | ~80–150 KB gz / copy | Possible duplicates |
| `@react-three/fiber` + `drei` | Desktop hero | ~70–120 KB gz | Html amplifies runtime |
| `react-force-graph-3d` | Mobile hero | ~225 KB gz | Second stack |
| `framer-motion` | Eager on `/` + hero | ~50–80 KB gz | Many sections |
| `gsap` + ScrollTrigger | Experience + Showcase | ~40–60 KB gz | Below-fold but eager |
| `react-icons` | Skills (eager) | Variable | Barrel risk |
| `lenis` | Source off | 0 (rebuild) | Purge from package.json |
| `ogl`, `@react-spring/three` | Unused | 0 runtime | Remove |

---

## Dual hero note

| Question | Answer |
|----------|--------|
| Both scenes mounted at once? | **No** — gated by `mounted` + `key === "mobile"` |
| Two engines in the product? | **Yes** — R3F+Rapier (tablet/desktop) + force-graph (mobile) |
| Can both load in one session? | **Yes** — crossing 768px loads the other stack |

---

## Audit sources

Internal audits (Jul 2026): React renders, GSAP/Lenis, Three.js/WebGL/GPU, CSS/layout/events, bundle/assets.
