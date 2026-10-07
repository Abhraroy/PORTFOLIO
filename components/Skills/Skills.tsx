"use client";

import { motion } from "framer-motion";
import SkillsCarousel from "./SkillsCarousel";
import { SKILLS_SECTION } from "./skills.config";

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Skills section — CSS marquee with edge fades and tooltips. */
export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full scroll-mt-24 overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="skills-heading"
    >
      <div className="relative mx-auto w-full max-w-7xl">
        <motion.header
          className="mb-8 max-w-2xl space-y-3 sm:mb-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={headerFade}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {SKILLS_SECTION.eyebrow}
          </p>
          <h2
            id="skills-heading"
            className="font-mono text-2xl tracking-tight text-white sm:text-3xl font-bold"
          >
            {SKILLS_SECTION.heading}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white sm:text-[15px]">
            {SKILLS_SECTION.subtitle}
          </p>
        </motion.header>
      </div>

      {/* Full-bleed carousel so edge fades sit against the section background */}
      <SkillsCarousel />
      {/* <SkillsCarousel /> */}
    </section>
  );
}
