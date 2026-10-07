/* eslint-disable @next/next/no-img-element */
import type { Skill } from "./skills.config";

type SkillItemProps = {
  skill: Skill;
};

/** Skill icon rendered via local SVG with a fallback to Syvixor API and CSS-only tooltip. */
export default function SkillItem({ skill }: SkillItemProps) {
  const { name, icon, id } = skill;
  const iconSlug = icon || id;
  const localSrc = `/icons/skills/${iconSlug}.svg`;
  const remoteFallback = `https://skills.syvixor.com/api/icons?i=${iconSlug}`;

  return (
    <li className="skill-item relative flex shrink-0 list-none flex-col items-center">
      <button
        type="button"
        className="skill-item__btn flex size-14 items-center justify-center rounded-xl border border-white/10 bg-[#415d43]/30 backdrop-blur-md text-white hover:border-white/25 hover:bg-[#415d43]/60 hover:text-white focus-visible:border-white/30 focus-visible:outline-none sm:size-16 transition-colors duration-200"
        aria-label={name}
      >
        <img
          src={localSrc}
          alt={name}
          className="size-14 sm:size-14 object-contain select-none pointer-events-none"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== remoteFallback) {
              img.src = remoteFallback;
            }
          }}
        />
      </button>

      <span className="skill-item__tooltip" role="tooltip">
        {name}
      </span>
    </li>
  );
}
