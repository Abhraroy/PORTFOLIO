export type HeroMobileSocial = {
  id: string;
  /** Display handle, e.g. @abhra */
  handle: string;
  href: string;
};

/**
 * Mobile hero copy & CTAs — independent of the R3F network sphere config.
 */
export const HERO_MOBILE = {
  /** Display name; split on `-` into stacked lines in HeroMobile. */
  name: "Abhradip-Roy",

  /** Status pill shown above the name. */
  status: {
    label: "Available for work",
  },

  skillPrefix: "I build software that solves real problems.",
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Three.js",
    "PostgreSQL",
  ],

  /** Single line below the typewriter — edit this anytime. */
  tagline: "From AI-powered workflows to complete web applications, I turn ideas and messy problems into useful software.",

  /** Text social handles below the tagline — edit handles & hrefs anytime. */
  socials: [
    {
      id: "github",
      handle: "@abhra",
      href: "https://github.com/abhra",
    },
    {
      id: "linkedin",
      handle: "@abhra",
      href: "https://linkedin.com/in/abhra",
    },
    {
      id: "x",
      handle: "@abhra",
      href: "https://x.com/abhra",
    },
  ] satisfies HeroMobileSocial[],

  ctas: [
    { label: "View Project", href: "/#work", variant: "primary" as const },
    { label: "Let's Talk", href: "/#contact", variant: "secondary" as const },
  ],
  typewriter: {
    typeMs: 70,
    deleteMs: 45,
    holdMs: 1800,
    pauseMs: 400,
  },
} as const;
