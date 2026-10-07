"use client";

import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ActiveCard } from "@/zustand";
import { INFO_CARD_CONFIG } from "./config/nodes.data";

type InfoCardProps = {
  /** Active card payload from the Zustand store. */
  card: ActiveCard;
  /** Called when the user closes the card (button / Esc handled upstream). */
  onClose: () => void;
};

function formatDimension(val: string | number | undefined, fallback: string): string {
  if (val === undefined) return fallback;
  return typeof val === "number" ? `${val}px` : val;
}

/**
 * HTML info card beside the selected node (Drei Html — not WebGL UI).
 * Framer Motion handles enter animation. Card clicks do not clear focus.
 *
 * @param props.card - Selected skill card data + local anchor position
 * @param props.onClose - Dismiss handler
 */
export default function InfoCard({ card, onClose }: InfoCardProps) {
  const cardWidth = formatDimension(card.data.cardWidth, INFO_CARD_CONFIG.width);
  const cardHeight = formatDimension(card.data.cardHeight, INFO_CARD_CONFIG.height);
  const cardMinHeight = formatDimension(card.data.cardMinHeight, INFO_CARD_CONFIG.minHeight);
  const cardImageHeight = formatDimension(card.data.cardImageHeight, INFO_CARD_CONFIG.imageHeight);
  const titleFontSize = formatDimension(card.data.titleFontSize, INFO_CARD_CONFIG.titleFontSize);
  const descriptionFontSize = formatDimension(card.data.descriptionFontSize, INFO_CARD_CONFIG.descriptionFontSize);
  const techBadgeFontSize = formatDimension(card.data.techBadgeFontSize, INFO_CARD_CONFIG.techBadgeFontSize);
  const ctaFontSize = formatDimension(card.data.ctaFontSize, INFO_CARD_CONFIG.ctaFontSize);
  const escButtonFontSize = formatDimension(undefined, INFO_CARD_CONFIG.escButtonFontSize);
  const padding = formatDimension(card.data.padding, INFO_CARD_CONFIG.padding);

  const hasExplicitHeight = cardHeight !== "auto";
  const hasExplicitMinHeight = cardMinHeight !== "auto";

  return (
    <Html
      position={[1.35, 0.55, 0]}
      distanceFactor={12}
      style={{ pointerEvents: "none" }}
      zIndexRange={[100, 0]}
      occlude={false}
      transform={false}
      sprite
    >
      <AnimatePresence mode="wait">
        {/* ================================================================= */}
        {/* NEW MINIMAL INFO CARD DESIGN (Heading & Description Only)          */}
        {/* ================================================================= */}
        <motion.div
          key={card.nodeId}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex flex-col overflow-hidden rounded-xl border border-white/15 bg-zinc-950/90 shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
          style={{
            width: cardWidth,
            padding,
            gap: INFO_CARD_CONFIG.gap,
          }}
          data-network-card="true"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-mono font-semibold tracking-wide text-white"
              style={{ fontSize: titleFontSize }}
            >
              {card.data.title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 px-1.5 py-0.5 text-white transition hover:bg-white/10 hover:text-white/80"
              style={{ fontSize: escButtonFontSize }}
              aria-label="Close"
            >
              Esc
            </button>
          </div>

          <p
            className="leading-relaxed text-white"
            style={{ fontSize: descriptionFontSize }}
          >
            {card.data.description}
          </p>
        </motion.div>

        {/* ================================================================= */}
        {/* PRESERVED PREVIOUS INFO CARD DESIGN (COMMENTED OUT)               */}
        {/* ================================================================= */}
        {/*
        <motion.div
          key={card.nodeId}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex flex-col overflow-hidden border border-white/10 bg-zinc-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          style={{
            width: cardWidth,
            height: hasExplicitHeight ? cardHeight : undefined,
            minHeight: hasExplicitMinHeight ? cardMinHeight : undefined,
            borderRadius: INFO_CARD_CONFIG.borderRadius,
          }}
          data-network-card="true"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {card.data.image ? (
            <div
              className="relative w-full shrink-0 border-b border-white/10"
              style={{ height: cardImageHeight }}
            >
              <Image
                src={card.data.image}
                alt=""
                fill
                className="object-cover"
                sizes={cardWidth}
              />
            </div>
          ) : cardImageHeight && cardImageHeight !== "0px" ? (
            <div
              className="relative w-full shrink-0 border-b border-white/10 bg-gradient-to-br from-zinc-800/80 via-zinc-900/90 to-zinc-950 flex items-center justify-center overflow-hidden"
              style={{ height: cardImageHeight }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />
              <span className="font-mono text-xs font-semibold text-zinc-500 tracking-wider uppercase z-10 select-none">
                {card.data.title}
              </span>
            </div>
          ) : (
            <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700" />
          )}

          <div
            className="flex flex-col flex-1 justify-between"
            style={{
              padding,
              gap: INFO_CARD_CONFIG.gap,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-mono font-semibold tracking-wide text-zinc-50"
                style={{ fontSize: titleFontSize }}
              >
                {card.data.title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-white/10 px-1.5 py-0.5 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
                style={{ fontSize: escButtonFontSize }}
                aria-label="Close"
              >
                Esc
              </button>
            </div>

            <p
              className="leading-relaxed text-zinc-400"
              style={{ fontSize: descriptionFontSize }}
            >
              {card.data.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {card.data.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300"
                  style={{ fontSize: techBadgeFontSize }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <Link
              href={card.data.cta.href}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-mono font-medium tracking-wide text-zinc-100 transition hover:bg-white/15"
              style={{ fontSize: ctaFontSize }}
              onClick={(e) => {
                onClose();
                if (card.data.cta.href.includes("#")) {
                  const hash = card.data.cta.href.split("#")[1];
                  if (window.location.pathname === "/" || card.data.cta.href.startsWith("#")) {
                    e.preventDefault();
                    const elem = document.getElementById(hash);
                    if (elem) {
                      elem.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = card.data.cta.href;
                    }
                  }
                }
              }}
            >
              {card.data.cta.label}
            </Link>
          </div>
        </motion.div>
        */}
      </AnimatePresence>
    </Html>
  );
}
