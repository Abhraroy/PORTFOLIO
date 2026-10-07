import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Lenis disabled — syncLenisScrollTrigger kept commented for easy restore.
// import type Lenis from "lenis";

let pluginRegistered = false;

/** Register ScrollTrigger once for client-side GSAP usage. */
export function registerScrollTrigger() {
  if (typeof window === "undefined" || pluginRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.clearScrollMemory();
  pluginRegistered = true;
}

/**
 * Wire Lenis smooth scroll to ScrollTrigger so trigger positions stay accurate.
 * Returns a cleanup function.
 *
 * Lenis disabled — this helper is unused while native scroll is active.
 * ScrollTrigger works with the document scroller by default.
 */
// export function syncLenisScrollTrigger(lenis: Lenis) {
//   registerScrollTrigger();
//
//   ScrollTrigger.scrollerProxy(document.documentElement, {
//     scrollTop(value) {
//       if (arguments.length) {
//         lenis.scrollTo(value, { immediate: true });
//       }
//       return lenis.scroll;
//     },
//     getBoundingClientRect() {
//       return {
//         top: 0,
//         left: 0,
//         width: window.innerWidth,
//         height: window.innerHeight,
//       };
//     },
//   });
//
//   const onScroll = () => ScrollTrigger.update();
//   const onRefresh = () => lenis.resize();
//
//   lenis.on("scroll", onScroll);
//   ScrollTrigger.addEventListener("refresh", onRefresh);
//   ScrollTrigger.refresh();
//
//   return () => {
//     lenis.off("scroll", onScroll);
//     ScrollTrigger.removeEventListener("refresh", onRefresh);
//   };
// }
