# NewHeroSection — Config Guide

How to tune the 3D network hero without hunting through components.

All tunables live under `components/NewHeroSection/config/`.  
Components should **not** hardcode sizes, speeds, or colors — change the config files instead.

---

## Files

| File | Purpose |
|------|---------|
| [`breakpoints.ts`](./config/breakpoints.ts) | Mobile / tablet / desktop layout (radius, node count, sizes, camera distance) |
| [`scene.config.ts`](./config/scene.config.ts) | Rotation, materials, lines, physics, camera FOV, background |
| [`nodes.data.ts`](./config/nodes.data.ts) | Center brand + skill catalog (labels, card copy, CTA) |

---

## Interaction model (current)

The hero is a **padded shell**: the 3D canvas is inset (~3–4rem). Padded margins are normal page scroll areas; only the inset surface captures pointer/orbit gestures.

| Input | Result |
|-------|--------|
| **Mouse move / enter / leave** | Nothing — no tooltips, no locks, no camera move |
| **Click / tap** sphere (press, no move) | Opens info card (left-click by default, or right-click when `NEXT_PUBLIC_ENABLE_HERO_RIGHT_CLICK="true"`); auto-spin keeps going |
| **Press + drag** sphere (move past ~6px) | Drags the node (left-click); auto-spin pauses until release; then soft spring-back |
| **Left-click + drag empty space** (move past ~6px) | Orbits the camera. Blocked while a node is pressed/dragged |
| **Click empty canvas / Esc / card close** | Clears selection + card |
| **Wheel / trackpad anywhere on hero** | Naturally scrolls the page down to next section (not tied to 3D zoom) |
| **Bottom “Scroll” cue** | Visual affordance in the lower padding; does not capture clicks |
| **Idle** | Network **auto-spin** continues |

> **Environment Flag (`NEXT_PUBLIC_ENABLE_HERO_RIGHT_CLICK`)**:
> - When set to `"true"`: **Right-click** on a skill node opens the info card, leaving left-click exclusively for dragging nodes and orbiting the scene.
> - When `"false"` (default): **Left-click** on a skill node opens the info card.

State is managed in Zustand: [`store/interactionStore.ts`](../../zustand/interactionStore.ts).  
Press/drag lock: [`utils/gestureLocks.ts`](./utils/gestureLocks.ts).


---

## `breakpoints.ts`

Resolved from `window.innerWidth` via `getBreakpointConfig(width)`.

### Breakpoint keys

- `mobile` — `width < 768`
- `tablet` — `768 ≤ width < 1280`
- `desktop` — `width ≥ 1280`

### Fields and what they affect

| Field | Type | Affects |
|-------|------|---------|
| `minWidth` | number | Lower bound used to pick this breakpoint |
| `radius` | number | Fibonacci sphere radius — how spread out nodes are |
| `nodeCount` | number | How many entries from `SKILL_CATALOG` are placed (sliced from the start) |
| `showLabels` | boolean | Always-on labels under nodes (no hover tooltips) |
| `hitScale` | number | Multiplies invisible hit-sphere size — larger = easier to grab on touch |
| `cameraDistance` | number | Initial camera distance from the origin (OrbitControls start pose) |
| `centerSize` | number | Radius of the center **blankdev** sphere |
| `nodeSize` | number | Radius of each skill sphere — **fixed**; hover does not scale this |
| `holdMs` | number | Reserved for long-press; selection is click/tap on all devices today |
| `labelFontSize` | number | Relative font size for always-on labels |

### Examples

- **Fewer nodes on desktop:** lower `BREAKPOINTS.desktop.nodeCount` (e.g. `24`).
- **Tighter sphere:** lower `radius` (e.g. `8`).
- **Bigger grab targets on mobile:** raise `mobile.hitScale` (e.g. `1.6`).
- **Camera farther back:** raise `cameraDistance`.

---

## `scene.config.ts`

### `ROTATION`

| Field | Affects |
|-------|---------|
| `speedY` | Horizontal spin of the whole network (rad/s). Only axis used — continuous pitch was removed because it flips the sphere. |

Paused while `dragPauseRef` is true (node drag).

### `MATERIALS`

| Block | Affects |
|-------|---------|
| `center` | Center node color / glass / emissive |
| `skill` | Skill node look (always applied; not changed on hover) |
| `skillHover` | **Unused** for animation — hover is tooltip-only; kept for reference |
| `glassTransmission` | Glass pass-through on physical materials |

### `CONNECTIONS`

| Field | Affects |
|-------|---------|
| `color` | Ambient base wireframe color (hex) |
| `pulseColor` | Color of traveling data packets / energy pulses (hex) |
| `opacity` | Base ambient wireframe opacity |
| `pulseOpacity` | Peak opacity of the traveling data packet |
| `kNeighbors` | Number of closest neighbor connections per skill node |
| `segmentsPerCurve` | Tessellation / segment count of each curved Great Circle arc along the sphere |
| `curvatureRadiusOffset` | Outward bulge offset (>0 arches slightly above nodes, 0 = exact sphere surface) |
| `lineWidth` | Line thickness (renderer-dependent) |
| `flowEnabled` | Toggle data packet / energy flow animation on/off |
| `flowSpeed` | Speed of data packets streaming along the lines |
| `pulseLength` | Length of glowing head and trailing falloff (0.05 to 0.6) |
| `pulseEnabled` | Soft overall opacity breathing pulse on/off |
| `pulseSpeed` | How fast the breathing oscillates |
| `pulseAmplitude` | How much breathing opacity swings |

### `PHYSICS`

| Field | Affects |
|-------|---------|
| `gravity` | Keep `[0,0,0]` for a floating graph |
| `returnDamping` | How fast a released node eases back to its Fibonacci rest spot |
| `maxDragOffset` | Max distance a node can be pulled from rest |

Satellites are **kinematic** (no dynamic collisions). They will not scatter or “flee” the cursor from physics.

### `CAMERA`

| Field | Affects |
|-------|---------|
| `defaultLookAt` | OrbitControls target (usually origin) |
| `fov` / `near` / `far` | Perspective camera lens |
| `spring` / `focusPull` / `focusOffset` | Legacy focus-zoom tokens — **not used** for click (no zoom-to-node) |

### Other

| Export | Affects |
|--------|---------|
| `SPHERE_GEOMETRY` | Mesh smoothness of visible spheres |
| `HIT_SPHERE_SEGMENTS` | Tessellation of invisible hit volumes |
| `SCENE_BG` | Canvas background color |
| `defaultCameraTarget(distance)` | Initial camera position helper |

---

## `nodes.data.ts`

| Export | Affects |
|--------|---------|
| `CENTER_NODE.label` | Text on the center sphere |
| `CENTER_NODE.logoUrl` | Optional logo texture path under `/public` |
| `INFO_CARD_CONFIG` | Global styling & sizing tokens: `width`, `height`, `minHeight`, `imageHeight`, `padding`, `gap`, `borderRadius`, `titleFontSize`, `descriptionFontSize`, `techBadgeFontSize`, `ctaFontSize`, `escButtonFontSize` |
| `SKILL_CATALOG` | Static fallback skill catalog (used when Admin CMS has no nodes configured) |
| Per-node overrides (`cardWidth`, `cardHeight`, `cardMinHeight`, `cardImageHeight`, `titleFontSize`, `descriptionFontSize`, `techBadgeFontSize`, `ctaFontSize`, `padding`) | Custom card sizing/styling overrides per node |

### Sizing & Font Size Control
All InfoCard font sizes and card dimensions are styled centrally in [`nodes.data.ts`](./config/nodes.data.ts) via `INFO_CARD_CONFIG`.

### Admin CMS Integration
The **actual data of hero nodes** (label, title, description, tech stack tags, CTA, ordering, and visibility on the 3D sphere) can be managed via the **Admin Panel CMS** under **`/admin/cms/hero-nodes`**.

---

## Zustand store (`interactionStore.ts`)

| State / action | Role |
|----------------|------|
| `selectedId` / `activeCard` | Which node’s **info card** is open |
| `isDragging` / `dragPauseRef` | Pauses auto-rotate while dragging |
| `selectNode(id, data, localPosition)` | Click → open card |
| `clearFocus()` | Dismiss card |

---

## Quick recipes

**Make the hero calmer**
- Lower `ROTATION.speedY`
- Set `CONNECTIONS.pulseEnabled = false`

**Make drag return snappier**
- Raise `PHYSICS.returnDamping`

**Make drag freer**
- Raise `PHYSICS.maxDragOffset`

**Hide always-on labels**
- Set `showLabels: false` on the breakpoint

**Add a center logo**
- Put an image in `public/` and set `CENTER_NODE.logoUrl = "/your-logo.png"`

---

## Quick reference — what to change where

Use this map when you only need the knob, not the full docs above.

### Satellite (skill) spheres

| What | File | Field | Notes |
|------|------|-------|-------|
| Size | `breakpoints.ts` | `nodeSize` | Per breakpoint (`mobile` / `tablet` / `desktop`) |
| Spread | `breakpoints.ts` | `radius` | Fibonacci sphere radius |
| How many | `breakpoints.ts` | `nodeCount` | Takes first N from `SKILL_CATALOG` |
| Grab ease | `breakpoints.ts` | `hitScale` | Larger = easier to grab on touch |
| Labels on/off | `breakpoints.ts` | `showLabels` | Always-on labels |
| Label size | `breakpoints.ts` | `labelFontSize` | Relative font size |
| Color / glass | `scene.config.ts` | `MATERIALS.skill` | `color`, `emissive`, `opacity`, etc. |
| Content | `nodes.data.ts` | `SKILL_CATALOG` | `label`, card fields (`title`, `description`, …) |

### Connection lines (center → satellite)

| What | File | Field |
|------|------|-------|
| Opacity | `scene.config.ts` | `CONNECTIONS.opacity` |
| Width | `scene.config.ts` | `CONNECTIONS.lineWidth` |
| Color | `scene.config.ts` | `CONNECTIONS.color` |
| Pulse | `scene.config.ts` | `pulseEnabled`, `pulseSpeed`, `pulseAmplitude` |

### Drag

| What | File | Field | Default |
|------|------|-------|---------|
| Max pull distance | `scene.config.ts` | `PHYSICS.maxDragOffset` | `2.5` |
| Return speed | `scene.config.ts` | `PHYSICS.returnDamping` | `8` |
| Press → drag threshold (px) | `utils/gestureLocks.ts` | `GESTURE_THRESHOLD_PX` | `6` |

### Central sphere

| What | File | Field |
|------|------|-------|
| Size | `breakpoints.ts` | `centerSize` |
| Label | `nodes.data.ts` | `CENTER_NODE.label` |
| Logo | `nodes.data.ts` | `CENTER_NODE.logoUrl` (path under `/public`) |
| Color / material | `scene.config.ts` | `MATERIALS.center` (`color`, `emissive`, `emissiveIntensity`, `opacity`, …) |

### Camera & spin

| What | File | Field |
|------|------|-------|
| Camera distance | `breakpoints.ts` | `cameraDistance` |
| Auto-spin speed | `scene.config.ts` | `ROTATION.speedY` |
| Scene background | `scene.config.ts` | `SCENE_BG` |
