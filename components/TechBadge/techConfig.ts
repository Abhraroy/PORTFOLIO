export const LOCAL_SKILL_ICONS = new Set([
  "appwrite",
  "aws",
  "chroma",
  "chromium",
  "cloudflare",
  "docker",
  "drizzle",
  "express",
  "fastapi",
  "figma",
  "firebase",
  "framer",
  "git",
  "github",
  "graphql",
  "linux",
  "mongodb",
  "mysql",
  "neon",
  "nextjs",
  "nodejs",
  "playwright",
  "postgresql",
  "prisma",
  "python",
  "react",
  "redis",
  "sql",
  "sqlalchemy",
  "sqlite",
  "supabase",
  "tailwind",
  "threejs",
  "typescript",
  "vercel",
  "vite",
  "zod",
  "zustand",
]);

export const TECH_SLUG_MAP: Record<string, string> = {
  // TypeScript & JavaScript
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",

  // Frameworks & Runtimes
  nextjs: "nextjs",
  "next.js": "nextjs",
  next: "nextjs",
  "next js": "nextjs",
  react: "react",
  "react.js": "react",
  reactjs: "react",
  "react js": "react",
  "react native": "react",
  reactnative: "react",
  nodejs: "nodejs",
  "node.js": "nodejs",
  node: "nodejs",
  "node js": "nodejs",
  express: "express",
  "express.js": "express",
  expressjs: "express",
  "express js": "express",
  fastapi: "fastapi",
  python: "python",
  py: "python",
  python3: "python",
  vite: "vite",
  bun: "bun",
  deno: "deno",
  vue: "vue",
  vuejs: "vue",
  "vue.js": "vue",
  angular: "angular",
  svelte: "svelte",

  // Styling & UI
  tailwind: "tailwind",
  tailwindcss: "tailwind",
  "tailwind css": "tailwind",
  "tailwind-css": "tailwind",
  threejs: "threejs",
  "three.js": "threejs",
  three: "threejs",
  "three js": "threejs",
  framer: "framer",
  "framer motion": "framer",
  framermotion: "framer",
  figma: "figma",
  css: "css",
  css3: "css",
  html: "html",
  html5: "html",
  sass: "sass",

  // Databases & Backend Services
  postgresql: "postgresql",
  postgres: "postgresql",
  psql: "postgresql",
  mysql: "mysql",
  mongodb: "mongodb",
  mongo: "mongodb",
  sqlite: "sqlite",
  sqlite3: "sqlite",
  redis: "redis",
  supabase: "supabase",
  firebase: "firebase",
  neon: "neon",
  "neon db": "neon",
  "neon postgres": "neon",
  appwrite: "appwrite",
  prisma: "prisma",
  "prisma orm": "prisma",
  drizzle: "drizzle",
  "drizzle orm": "drizzle",
  sqlalchemy: "sqlalchemy",
  sql: "sql",
  chroma: "chroma",
  chromadb: "chroma",
  graphql: "graphql",

  // DevOps, Testing & Scraping
  docker: "docker",
  git: "git",
  github: "github",
  aws: "aws",
  "amazon web services": "aws",
  s3: "aws",
  ec2: "aws",
  cloudflare: "cloudflare",
  playwright: "playwright",
  chromium: "chromium",
  chrome: "chromium",
  linux: "linux",
  vercel: "vercel",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  zod: "zod",
  zustand: "zustand",
  go: "go",
  golang: "go",
  rust: "rust",
};

// Generic descriptive terms that shouldn't attempt icon fetches
const NON_ICON_KEYWORDS = new Set([
  "placeholder",
  "aiagents",
  "aiagent",
  "ai",
  "agents",
  "agent",
  "webscraping",
  "scraping",
  "ocr",
  "vllm",
  "llm",
  "llms",
  "stt",
  "tts",
  "rag",
  "nlp",
  "ml",
  "api",
  "apis",
  "restapi",
  "microservices",
  "architecture",
  "systemarchitecture",
  "productionscale",
  "highthroughput",
  "scalability",
  "fullstack",
  "frontend",
  "backend",
]);

export function getTechSlug(rawTech: string): string | null {
  if (!rawTech) return null;
  const trimmed = rawTech.trim().toLowerCase();

  // 1. Direct match in dictionary
  if (TECH_SLUG_MAP[trimmed]) {
    return TECH_SLUG_MAP[trimmed];
  }

  // 2. Alphanumeric cleaned match
  const clean = trimmed.replace(/[^a-z0-9]/g, "");
  if (!clean) return null;

  if (TECH_SLUG_MAP[clean]) {
    return TECH_SLUG_MAP[clean];
  }

  // 3. Known local icon
  if (LOCAL_SKILL_ICONS.has(clean)) {
    return clean;
  }

  // 4. Blacklisted generic terms
  if (NON_ICON_KEYWORDS.has(clean)) {
    return null;
  }

  // 5. If it contains spaces or multiple words that didn't match the dictionary,
  // it's likely a descriptive phrase rather than a recognized icon name
  if (trimmed.includes(" ")) {
    return null;
  }

  // 6. Reasonable length single-word tech identifier
  if (clean.length >= 2 && clean.length <= 18) {
    return clean;
  }

  return null;
}
