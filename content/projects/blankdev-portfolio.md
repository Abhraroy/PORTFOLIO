# blankdev — Immersive Founder & Systems Portfolio

> **Status:** Live & Active  
> **Architecture:** Next.js 16 App Router, Three.js / React Three Fiber (R3F), GSAP ScrollTrigger, Framer Motion, Zustand

---

## Executive Overview

**blankdev** is an interactive, dark-mode portfolio platform engineered to showcase complex software architecture, interactive WebGL 3D network graphs, and founder narratives. Designed as a product in itself rather than a static resume page, it features visitor modes, scroll-driven storytelling, and a built-in administrative CMS.

---

## Core Engineering Innovations

### 1. Interactive 3D WebGL Skill Network
- Powered by `@react-three/fiber` and Three.js.
- Interactive node connections with dynamic hover physics and custom GLSL shader glows.

### 2. Scroll-Driven Storytelling
- Smooth integration with GSAP ScrollTrigger for pinned timeline navigation and progressive section reveal.

### 3. Shared Design System & Glass UI
- CSS design system with HSL dark palette tokens, custom scrollbars, animated border frames, and backdrop filters.

---

## Performance Optimization

- **Off-Screen WebGL Disabling:** Automatically pauses Three.js render loop when out of viewport to preserve GPU cycles.
- **Fluid Layout:** Full responsive adaptation across mobile, tablet, and ultra-wide displays.
