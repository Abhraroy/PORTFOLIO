"use client";

import SkillItem from "./SkillItem";
import { SKILLS, type Skill } from "./skills.config";

/** Enough copies so ultrawide viewports never show a gap mid-loop. */
const COPIES = 4;

function SkillList({ skills, ariaHidden }: { skills: Skill[]; ariaHidden?: boolean }) {
  return (
    <ul
      className="skills-track__group flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7"
      role="list"
      aria-hidden={ariaHidden || undefined}
    >
      {skills.map((skill, index) => (
        <SkillItem key={`${skill.id}-${index}`} skill={skill} />
      ))}
    </ul>
  );
}

export default function SkillsCarousel() {
  return (
    <div
      className="skills-carousel relative w-full overflow-hidden py-10 sm:py-12"
      aria-label="Skills carousel — hover to pause"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#111d13] to-transparent sm:w-24 md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#111d13] to-transparent sm:w-24 md:w-32"
        aria-hidden
      />

      <div className="skills-track">
        {Array.from({ length: COPIES }, (_, i) => (
          <SkillList key={i} skills={SKILLS} ariaHidden={i > 0} />
        ))}
      </div>
    </div>
  );
}
