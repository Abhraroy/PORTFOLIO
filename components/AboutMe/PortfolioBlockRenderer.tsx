"use client";

import React from "react";
import Link from "next/link";
import GlowFrame from "./GlowFrame";
import { PortfolioBlockData } from "@/app/admin/_components/types";
import { trackContactInterested } from "@/lib/track";

interface PortfolioBlockRendererProps {
  block: PortfolioBlockData;
}

export function PortfolioBlockRenderer({ block }: PortfolioBlockRendererProps) {
  const {
    label,
    heading,
    subheading,
    description,
    items,
    ctaText,
    ctaUrl,
    ctaVisible,
    imageUrl,
    imageAlt,
    type,
  } = block;

  if (type === "HERO") {
    return (
      <GlowFrame className="h-full min-h-40 rounded-xl">
        <div className="flex h-full flex-col justify-between gap-5 p-5 sm:flex-row sm:items-end sm:gap-8 sm:p-6 lg:p-7 bg-[#8fb996]/20 backdrop-blur-2xl rounded-2xl text-white">
          <div className="min-w-0 flex-1 space-y-3">
            {label && (
              <p className="font-mono text-xs sm:text-[13px] tracking-[0.28em] text-white uppercase font-medium">
                {label}
              </p>
            )}
            {heading && (
              <h2
                id="about-heading"
                className="font-mono text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl font-bold"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="font-mono text-xs sm:text-sm tracking-[0.18em] text-white uppercase">
                {subheading}
              </p>
            )}
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-white sm:text-lg">
                {description}
              </p>
            )}

            {/* Block Items (Paragraphs, Bullets, Links) */}
            {items && items.length > 0 && (
              <div className="space-y-2 pt-2">
                {items
                  .filter((i) => i.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((item) =>
                    item.type === "BULLET" ? (
                      <p key={item.id} className="text-sm sm:text-base text-white flex items-center gap-2">
                        <span className="text-white">•</span> {item.content}
                      </p>
                    ) : item.type === "LINK" ? (
                      <a
                        key={item.id}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm sm:text-base text-white underline hover:text-white/80"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p key={item.id} className="text-sm sm:text-base text-white">
                        {item.content}
                      </p>
                    )
                  )}
              </div>
            )}
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              trackContactInterested();
              const contactElem = document.getElementById("contact");
              if (contactElem) {
                contactElem.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#contact";
              }
            }}
            className="cta-highlight-get-in-touch cursor-pointer inline-flex shrink-0 items-center justify-center self-start rounded-xl border border-white/15 bg-[#415d43] px-5 py-2.5 font-mono text-xs sm:text-sm tracking-[0.18em] text-white uppercase transition hover:border-white/30 hover:bg-[#4d6e4f] sm:self-end"
          >
            Get in touch
          </a>
        </div>
      </GlowFrame>
    );
  }

  if (type === "PROFILE") {
    return (
      <GlowFrame className="h-full min-h-62 rounded-2xl lg:min-h-full">
        <div
          className="flex h-full min-h-72 items-center justify-center lg:min-h-full overflow-hidden rounded-2xl"
          aria-label={imageAlt || "Profile visual"}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || "Profile Image"}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <span className="font-mono text-6xl tracking-[0.2em] text-white sm:text-7xl lg:text-8xl">
              {heading || "AR"}
            </span>
          )}
        </div>
      </GlowFrame>
    );
  }

  // Standard CARD, TEXT, LIST, MEDIA or CTA structural block
  return (
    <GlowFrame className="h-full rounded-xl">
      <div className="flex h-full flex-col justify-between gap-2.5 p-5 bg-[#415d43]/50 backdrop-blur-2xl rounded-2xl text-white">
        {label && (
          <span className="font-mono text-xs sm:text-[13px] tracking-[0.22em] text-white uppercase font-medium">
            {label}
          </span>
        )}
        <div className="space-y-1.5">
          {heading && (
            <p className="font-mono text-base sm:text-lg leading-snug text-white font-semibold">
              {heading}
            </p>
          )}
          {subheading && (
            <p className="text-xs sm:text-sm font-mono text-white">
              {subheading}
            </p>
          )}
          {description && (
            <p className="text-xs sm:text-sm leading-relaxed text-white">
              {description}
            </p>
          )}

          {/* Child Block Items */}
          {items && items.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {items
                .filter((i) => i.visible)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id}>
                    {item.type === "BULLET" ? (
                      <p className="text-xs sm:text-sm text-white flex items-start gap-1.5">
                        <span className="text-white">•</span>
                        <span>{item.content}</span>
                      </p>
                    ) : item.type === "LINK" ? (
                      <a
                        href={item.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm text-white underline hover:text-white/80"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed text-white">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {ctaVisible && ctaText && ctaUrl && (
          <div className="pt-2">
            <Link
              href={ctaUrl}
              className="inline-flex items-center text-xs sm:text-sm font-mono text-white hover:underline"
            >
              {ctaText} →
            </Link>
          </div>
        )}
      </div>
    </GlowFrame>
  );
}
