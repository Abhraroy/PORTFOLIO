export type BentoCell = {
  id: string;
  label: string;
  value: string;
  detail?: string;
  /** Tailwind grid-area class for desktop layout */
  area: string;
};

export const ABOUT = {
  eyebrow: "About me",
  name: "blankdev",
  role: "Full-stack engineer",
  headline: "Building interactive products with clarity and craft.",
  body: "I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs. Focused on Next.js, TypeScript, and systems that stay readable as they grow.",
  cta: { label: "Get in touch", href: "/#contact" },
} as const;

export const BENTO_CELLS: readonly BentoCell[] = [
  {
    id: "focus",
    label: "Focus",
    value: "Product engineering",
    detail: "Interfaces, APIs, and the space between.",
    area: "focus",
  },
  {
    id: "experience",
    label: "Experience",
    value: "4+ yrs",
    detail: "Shipping for web & startups",
    area: "experience",
  },
  {
    id: "stack",
    label: "Stack",
    value: "Next · TS · Node",
    detail: "Prisma · Three · Postgres",
    area: "stack",
  },
  {
    id: "based",
    label: "Based",
    value: "Remote",
    detail: "Open to collab worldwide",
    area: "based",
  },
  {
    id: "status",
    label: "Status",
    value: "Available",
    detail: "Select freelance & full-time",
    area: "status",
  },
] as const;
