"use client";

import { motion } from "framer-motion";
import { useAdminStore } from "@/app/admin/_components/store";
import { PortfolioBlockRenderer } from "./PortfolioBlockRenderer";
import { PortfolioBlockData } from "@/app/admin/_components/types";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/** Desktop grid column spans for horizontal grid blocks 1..6 */
const BLOCK_POSITION_SPAN: Record<number, string> = {
  1: "md:col-span-6",
  2: "md:col-span-3",
  3: "md:col-span-3",
  4: "md:col-span-2",
  5: "md:col-span-2",
  6: "md:col-span-2",
};

/** Standard 7 fixed layout blocks definitions with fallback content */
const DEFAULT_BLOCKS: PortfolioBlockData[] = [
  {
    id: "default-blk-1",
    sectionId: "about-default",
    blockNumber: 1,
    type: "HERO",
    label: "About me",
    heading: "Building interactive products with clarity and craft.",
    subheading: "Full-stack engineer",
    description:
      "I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs. Focused on Next.js, TypeScript, and systems that stay readable as they grow.",
    ctaText: "Get in touch",
    ctaUrl: "/#contact",
    ctaVisible: true,
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-2",
    sectionId: "about-default",
    blockNumber: 2,
    type: "CARD",
    label: "Focus",
    heading: "Product engineering",
    description: "Interfaces, APIs, and the space between.",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-3",
    sectionId: "about-default",
    blockNumber: 3,
    type: "CARD",
    label: "Experience",
    heading: "4+ yrs",
    description: "Shipping for web & startups",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-4",
    sectionId: "about-default",
    blockNumber: 4,
    type: "CARD",
    label: "Stack",
    heading: "Next · TS · Node",
    description: "Prisma · Three · Postgres",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-5",
    sectionId: "about-default",
    blockNumber: 5,
    type: "CARD",
    label: "Based",
    heading: "Remote",
    description: "Open to collab worldwide",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-6",
    sectionId: "about-default",
    blockNumber: 6,
    type: "CARD",
    label: "Status",
    heading: "Available",
    description: "Select freelance & full-time",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-blk-7",
    sectionId: "about-default",
    blockNumber: 7,
    type: "PROFILE",
    heading: "AR",
    imageAlt: "Profile Visual",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AboutMe() {
  const { sections, activeModeId, details } = useAdminStore();

  const aboutSection = sections.find((s) => s.key === "ABOUT" && s.visible);
  const dbBlocks = aboutSection?.blocks || [];

  const modeContent = details?.modeContents?.find(
    (m) => m.portfolioModeId === activeModeId
  ) || details?.modeContents?.[0];

  const dynamicDefaultBlocks: PortfolioBlockData[] = DEFAULT_BLOCKS.map((b) => {
    if (b.blockNumber === 1) {
      return {
        ...b,
        heading: modeContent?.headline || b.heading,
        description: modeContent?.detailed_bio || modeContent?.short_bio || b.description,
      };
    }
    if (b.blockNumber === 3 && details?.years_of_experience) {
      return {
        ...b,
        heading: `${details.years_of_experience}+ yrs`,
      };
    }
    if (
      b.blockNumber === 5 &&
      (details?.location || details?.district || details?.state || details?.country || details?.address)
    ) {
      const locHeading =
        details.location ||
        [details.district, details.state, details.country].filter(Boolean).join(", ") ||
        b.heading;
      return {
        ...b,
        heading: locHeading,
      };
    }
    if (b.blockNumber === 7) {
      const initials = details?.full_name
        ? details.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : b.heading;
      return {
        ...b,
        heading: initials || b.heading,
        imageUrl: details?.profile_image || b.imageUrl,
      };
    }
    return b;
  });

  // Build fixed 7 blocks: merge DB content for each blockNumber (1..7) over default layout definition
  const finalBlocks = [1, 2, 3, 4, 5, 6, 7].map((num) => {
    const defaultBlk = dynamicDefaultBlocks.find((b) => b.blockNumber === num)!;

    // Match persona-specific block first, then global unassigned block
    const modeMatch = dbBlocks.find(
      (b) => b.blockNumber === num && b.portfolioModeId === activeModeId && b.visible
    );
    const globalMatch = dbBlocks.find(
      (b) => b.blockNumber === num && (!b.portfolioModeId || b.portfolioModeId === "") && b.visible
    );
    const matched = modeMatch || globalMatch;

    if (!matched) return defaultBlk;

    return {
      ...defaultBlk,
      ...matched,
      // Fixed blockNumber and structural layout type
      blockNumber: num,
      type: defaultBlk.type,
    };
  });

  // Spatial blocks mapping:
  // Horizontal grid blocks 1 to 6 (left column)
  const heroBlock = finalBlocks[0]; // Block 1 (Top Hero)
  const middleGridBlocks = finalBlocks.slice(1, 6); // Blocks 2..6
  // Vertical block 7 (right column panel - numbered last)
  const profileBlock = finalBlocks[6]; // Block 7 (Profile Panel)

  return (
    <section
      id="about"
      className="relative w-full scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-0 lg:py-28 "
      aria-labelledby="about-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(63,63,70,0.28)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full  max-w-7xl items-stretch gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(220px,0.55fr)] lg:gap-6">
        {/* Left Column — Horizontal Blocks 1 to 6 (Numbered Left-to-Right, Top-to-Bottom) */}
        <div
          className="order-2 grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-6 lg:order-1"
          role="list"
        >
          {/* Spatial Block 1 (Top Horizontal Hero) */}
          {heroBlock && (
            <motion.div
              role="listitem"
              className="md:col-span-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={0}
              variants={fadeUp}
            >
              <PortfolioBlockRenderer block={heroBlock} />
            </motion.div>
          )}

          {/* Spatial Blocks 2 to 6 (Middle/Bottom Bento Grid) */}
          {middleGridBlocks.map((block, index) => (
            <motion.div
              key={block.id || `blk-${block.blockNumber}`}
              role="listitem"
              className={`${
                BLOCK_POSITION_SPAN[block.blockNumber] ?? "md:col-span-2"
              } min-h-28 md:min-h-32`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={index + 1}
              variants={fadeUp}
            >
              <PortfolioBlockRenderer block={block} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View — Circular social profile avatar (rendered instead of rectangular profile block) */}
        {profileBlock && (
          <motion.div
            className="order-1 flex justify-center py-2 lg:hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            custom={0}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-0.5 bg-gradient-to-tr from-[#415d43] via-[#8fb996] to-white/40 shadow-[0_0_30px_rgba(143,185,150,0.3)]">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-white/20 bg-[#415d43]/50">
                  {profileBlock.imageUrl ? (
                    <img
                      src={profileBlock.imageUrl}
                      alt={profileBlock.imageAlt || "Profile picture"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-2xl sm:text-3xl font-bold text-white">
                      {profileBlock.heading || "AR"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Column — Vertical Panel Block 7 (Desktop only) */}
        {profileBlock && (
          <motion.div
            className="hidden lg:block lg:order-2 lg:min-h-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            custom={0}
            variants={fadeUp}
          >
            <PortfolioBlockRenderer block={profileBlock} />
          </motion.div>
        )}
      </div>
    </section>
  );
}


