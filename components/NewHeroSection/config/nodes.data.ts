import type { CenterNodeData, SkillNodeData } from "../types/network";

/**
 * Center brand node (fixed at the origin).
 * Set `logoUrl` to a path under `/public` to show a logo plane on the sphere.
 */
export const CENTER_NODE: CenterNodeData = {
  id: "center",
  // label: "Placeholder",
  logoUrl: "/download.svg",
};

/**
 * Default dimensions, padding, and font sizes for the InfoCard popup.
 * Controls overall card width, image height, padding, gap, and all font sizes.
 * Can also be overridden individually per node in SKILL_CATALOG or via Admin CMS.
 */
export const INFO_CARD_CONFIG = {
  // Dimensions & Layout
  width: "320px",
  height: "auto",                 // Fixed overall card height (e.g. "350px", "auto")
  minHeight: "auto",              // Minimum overall card height (e.g. "280px", "auto")
  imageHeight: "150px",           // Header image / banner height
  padding: "14px",
  gap: "10px",
  borderRadius: "12px",

  // Font Sizes
  titleFontSize: "24px",          // Title heading font size
  descriptionFontSize: "20px",    // Body description font size
  techBadgeFontSize: "9px",       // Tech stack badge font size
  ctaFontSize: "21px",            // CTA action button font size
  escButtonFontSize: "10px",      // Esc close button font size
};

/**
 * Full skill catalog used by the network.
 * Breakpoints take `SKILL_CATALOG.slice(0, nodeCount)` — keep important skills first.
 *
 * Each entry feeds:
 * - `label` → optional always-on label (`showLabels`)
 * - `title` / `description` / `techStack` / `cta` / `image` → click info card
 */
export const SKILL_CATALOG: readonly SkillNodeData[] = [
  {
    id: "nextjs",
    label: "Next.js",
    title: "Next.js",
    description: "Full-stack React framework for production apps with App Router and SSR.",
    techStack: ["App Router", "RSC", "Vercel"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "react",
    label: "React",
    title: "React",
    description: "Component-driven UI library for interactive product surfaces.",
    techStack: ["Hooks", "R3F", "Suspense"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "typescript",
    label: "TypeScript",
    title: "TypeScript",
    description: "Typed JavaScript for safer, scalable application code.",
    techStack: ["Strict mode", "Zod", "Generics"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "nodejs",
    label: "Node.js",
    title: "Node.js",
    description: "Server runtime for APIs, tooling, and real-time backends.",
    techStack: ["Express", "REST", "WebSockets"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    title: "PostgreSQL",
    description: "Relational database for structured, reliable product data.",
    techStack: ["SQL", "Indexes", "Prisma"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "supabase",
    label: "Supabase",
    title: "Supabase",
    description: "Postgres platform with auth, storage, and realtime primitives.",
    techStack: ["Auth", "Storage", "Realtime"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "python",
    label: "Python",
    title: "Python",
    description: "General-purpose language for scripting, data, and ML pipelines.",
    techStack: ["FastAPI", "Pandas", "Scripts"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "ai",
    label: "AI",
    title: "AI Integration",
    description: "Product features powered by LLMs, embeddings, and agent workflows.",
    techStack: ["OpenAI", "Agents", "RAG"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "ml",
    label: "ML",
    title: "Machine Learning",
    description: "Models and pipelines that turn data into predictions and insights.",
    techStack: ["scikit-learn", "PyTorch", "Eval"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "prisma",
    label: "Prisma",
    title: "Prisma",
    description: "Type-safe ORM for Postgres and modern TypeScript backends.",
    techStack: ["Schema", "Migrations", "Client"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "tailwind",
    label: "Tailwind",
    title: "Tailwind CSS",
    description: "Utility-first styling for fast, consistent interface systems.",
    techStack: ["v4", "Design tokens", "Responsive"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "threejs",
    label: "Three.js",
    title: "Three.js",
    description: "WebGL rendering for immersive 3D portfolio and product experiences.",
    techStack: ["R3F", "Drei", "Shaders"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "zustand",
    label: "Zustand",
    title: "Zustand",
    description: "Lightweight state management for React interaction layers.",
    techStack: ["Stores", "Selectors", "SSR-safe"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "framer",
    label: "Motion",
    title: "Framer Motion",
    description: "Production-ready motion for UI transitions and presence.",
    techStack: ["AnimatePresence", "Layout", "Gestures"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "docker",
    label: "Docker",
    title: "Docker",
    description: "Containerized environments for consistent builds and deploys.",
    techStack: ["Compose", "Images", "CI"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "git",
    label: "Git",
    title: "Git",
    description: "Version control workflows for collaborative product delivery.",
    techStack: ["Branching", "PRs", "Reviews"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "graphql",
    label: "GraphQL",
    title: "GraphQL",
    description: "Flexible APIs that let clients request exactly the data they need.",
    techStack: ["Schema", "Resolvers", "Caching"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "redis",
    label: "Redis",
    title: "Redis",
    description: "In-memory store for caching, queues, and low-latency sessions.",
    techStack: ["Cache", "Pub/Sub", "Queues"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "aws",
    label: "AWS",
    title: "AWS",
    description: "Cloud infrastructure for scalable compute, storage, and networking.",
    techStack: ["S3", "Lambda", "ECS"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "figma",
    label: "Figma",
    title: "Figma",
    description: "Design collaboration from wireframes to production-ready systems.",
    techStack: ["Components", "Tokens", "Handoff"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "jest",
    label: "Testing",
    title: "Testing",
    description: "Unit and integration coverage that keeps shipping confidence high.",
    techStack: ["Vitest", "RTL", "E2E"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "rust",
    label: "Rust",
    title: "Rust",
    description: "Systems language for performance-critical and memory-safe tools.",
    techStack: ["CLI", "WASM", "Safety"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "go",
    label: "Go",
    title: "Go",
    description: "Concise language for networked services and cloud tooling.",
    techStack: ["APIs", "Concurrency", "CLI"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "kotlin",
    label: "Kotlin",
    title: "Kotlin",
    description: "Modern JVM language for Android and backend services.",
    techStack: ["Coroutines", "JVM", "Android"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "swift",
    label: "Swift",
    title: "Swift",
    description: "Native Apple-platform development for polished mobile experiences.",
    techStack: ["SwiftUI", "iOS", "macOS"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "java",
    label: "Java",
    title: "Java",
    description: "Enterprise-grade language for durable backend systems.",
    techStack: ["Spring", "JVM", "APIs"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "csharp",
    label: "C#",
    title: "C#",
    description: ".NET language for apps, services, and cross-platform tooling.",
    techStack: [".NET", "ASP.NET", "Unity"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "cpp",
    label: "C++",
    title: "C++",
    description: "Low-level performance for engines, tools, and systems work.",
    techStack: ["STL", "Memory", "Perf"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "php",
    label: "PHP",
    title: "PHP",
    description: "Server-side language behind many production web platforms.",
    techStack: ["Laravel", "APIs", "CMS"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "ruby",
    label: "Ruby",
    title: "Ruby",
    description: "Expressive language with a strong Rails product ecosystem.",
    techStack: ["Rails", "ActiveRecord", "APIs"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "graphql2",
    label: "tRPC",
    title: "tRPC",
    description: "End-to-end typesafe APIs shared between client and server.",
    techStack: ["TypeScript", "Routers", "React Query"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "ci",
    label: "CI/CD",
    title: "CI/CD",
    description: "Automated pipelines that test, build, and ship with confidence.",
    techStack: ["GitHub Actions", "Preview", "Deploy"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "auth",
    label: "Auth",
    title: "Authentication",
    description: "Secure identity flows for users, sessions, and permissions.",
    techStack: ["OAuth", "JWT", "RBAC"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "observability",
    label: "Observability",
    title: "Observability",
    description: "Logging, metrics, and traces that make production debuggable.",
    techStack: ["Sentry", "OpenTelemetry", "Dashboards"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "designsys",
    label: "Design Sys",
    title: "Design Systems",
    description: "Reusable UI foundations that keep products coherent at scale.",
    techStack: ["Tokens", "Components", "A11y"],
    cta: { label: "View projects", href: "/#work" },
  },
  {
    id: "websocket",
    label: "Realtime",
    title: "Realtime",
    description: "Live collaboration and presence over sockets and event streams.",
    techStack: ["WebSockets", "SSE", "Presence"],
    cta: { label: "View projects", href: "/#work" },
  },
] as const;

/**
 * Returns a mutable copy of the first `count` skills from the catalog.
 *
 * @param count - Max number of skills to include (clamped to catalog length)
 */
export function getSkillsForCount(count: number): SkillNodeData[] {
  return SKILL_CATALOG.slice(0, Math.min(count, SKILL_CATALOG.length)).map((skill) => ({
    ...skill,
    techStack: [...skill.techStack],
    cta: { ...skill.cta },
  }));
}
