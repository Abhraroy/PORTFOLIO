"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import HeroBackgroundIcons from "./HeroBackgroundIcons";
import HeroMobile from "./HeroMobile";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { FaUnlockAlt } from "react-icons/fa";

// const HeroScene = dynamic(() => import("./HeroScene"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-full w-full items-center justify-center bg-zinc-950">
//       <span className="font-mono text-xs tracking-[0.2em] text-white uppercase">
//         Loading network
//       </span>
//     </div>
//   ),
// });
import { ThreeDFloatingHeroCard } from "@/components/ThreeDCardScene";
import { trackScrolledPastHero } from "@/lib/track";


const emptySubscribe = () => () => {};

/**
 * Full-viewport portfolio hero shell with padded scroll margins.
 * Mobile uses a static hero; tablet and desktop use the R3F network sphere.
 */
export default function HeroSection() {
  const { config, key } = useBreakpoint();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [showScrollCue, setShowScrollCue] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = key === "mobile";

  useEffect(() => {
    const onScroll = () => {
      setShowScrollCue(window.scrollY <= 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollPastHero = () => {
    // Fire-and-forget tracking
    trackScrolledPastHero();

    const el = sectionRef.current;
    if (!el) {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      return;
    }
    const next = el.nextElementSibling as HTMLElement | null;
    if (next) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({
      top: el.offsetTop + el.offsetHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`relative flex h-dvh min-h-screen w-full flex-col bg-transparent ${
        isMobile ? "px-4 py-6 sm:p-8" : "p-12 sm:p-14 md:px-16 md:py-16"
      }`}
      aria-label={isMobile ? "Portfolio hero" : "Interactive skills network"}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-transparent"
        aria-hidden
      />
      {/* <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,82,91,0.42)_0%,rgba(39,39,42,0.22)_28%,rgba(24,24,27,0.08)_52%,rgba(9,9,11,0)_72%)]"
        aria-hidden
      /> */}
      {/* Text-shaped background */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none bg-transparent "
        aria-hidden
      >
        <span className="font-display opacity-0 md:opacity-100 text-[28vw] font-black tracking-[0.15em] leading-none select-none text-transparent bg-clip-text bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,rgba(161,161,170,0.12)_35%,rgba(63,63,70,0.04)_65%,transparent_85%)] [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]">
          blank
        </span>
      </div>
      

      <HeroBackgroundIcons />

      <div className="relative z-1 min-h-0 w-full flex-1 flex items-center justify-center overflow-visible">
        <div className="w-full h-full bg-transparent flex items-center justify-center">
          {!mounted ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="block md:hidden w-full h-full">
                <HeroMobile />
              </div>
              <div className="hidden md:flex w-full h-full items-center justify-center">
                <ThreeDFloatingHeroCard onExploreClick={scrollPastHero} />
              </div>
            </div>
          ) : isMobile ? (
            <HeroMobile />
            // <ThreeDFloatingHeroCard onExploreClick={scrollPastHero} />
          ) : (
            <ThreeDFloatingHeroCard onExploreClick={scrollPastHero} />
          )}
        </div>
      </div>

      {showScrollCue && !isMobile ? (
        <motion.button
          type="button"
          disabled
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none opacity-0 invisible absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit cursor-default flex-row items-center justify-center gap-1.5 rounded-full border border-white/20 bg-[#415d43] px-6 py-2.5 text-white backdrop-blur-xl sm:bottom-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0 }}
          aria-label="Click to scroll to next section (disabled)"
        >
          <motion.span
            aria-hidden
            className="flex items-center justify-center"
          >
            {/* <FaUnlockAlt className="text-zinc-100" /> */}
          </motion.span>
          <span className="font-mono text-[11px] font-semibold tracking-[0.28em] uppercase text-white pl-[0.28em]">
            Click to scroll
          </span>
        </motion.button>
      ) : null}
    </section>
  );
}
