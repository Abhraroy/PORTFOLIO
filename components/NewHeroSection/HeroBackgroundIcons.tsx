import { HERO_BACKGROUND_ICONS } from "./config/hero.background.config";

/**
 * Decorative tech icons scattered across the hero background.
 * Fixed positions in config — no runtime randomness (SSR-safe).
 */
export default function HeroBackgroundIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden md:hidden"
      aria-hidden
    >
      {HERO_BACKGROUND_ICONS.map(
        ({ id, Icon, top, left, size, rotate, opacity }) => (
          <Icon
            key={id}
            className="absolute text-white"
            style={{
              top,
              left,
              width: size,
              height: size,
              opacity,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        ),
      )}
    </div>
  );
}
