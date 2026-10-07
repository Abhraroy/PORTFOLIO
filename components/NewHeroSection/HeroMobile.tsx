"use client";

import Link from "next/link";
import { HERO_MOBILE } from "./config/hero.mobile.config";
import { useSkillTypewriter } from "./hooks/useSkillTypewriter";
import { useAdminStore } from "@/app/admin/_components/store";
import { trackContactInterested } from "@/lib/track";

/**
 * Lightweight mobile hero: status badge, name, typewriter, tagline, socials, CTAs.
 * Replaces the R3F network sphere below the tablet breakpoint.
 */
export default function HeroMobile() {
  const { details, mobileHeroSkills } = useAdminStore();

  const cmsSkillLabels = mobileHeroSkills
    ?.filter((s) => s.visible)
    .map((s) => s.text) || [];

  const skillList =
    cmsSkillLabels.length > 0 ? cmsSkillLabels : [...HERO_MOBILE.skills];

  const { displayText, announcedSkill } = useSkillTypewriter({
    skills: skillList,
    ...HERO_MOBILE.typewriter,
  });

  const typeSlotWidth =
    Math.max(...skillList.map((skill) => skill.length)) + 1;

  const fullName = details?.full_name || "blankdev";
  const nameParts = fullName.includes(" ") ? fullName.split(" ") : [fullName, ""];
  const firstName = nameParts[0] || "blankdev";
  const lastName = nameParts.slice(1).join(" ") || "";

  const dbModeContent = details?.modeContents?.[0];
  const dynamicTagline =
    dbModeContent?.short_bio || dbModeContent?.headline || HERO_MOBILE.tagline;

  const mobileSocials = [
    { id: "github", handle: "github", href: details?.github_url },
    { id: "linkedin", handle: "linkedin", href: details?.linkedin_url },
    { id: "x", handle: "x.com", href: details?.x_url },
    { id: "email", handle: "email", href: details?.email ? `mailto:${details.email}` : undefined },
  ].filter((s): s is { id: string; handle: string; href: string } => Boolean(s.href));

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-2 pt-6 pb-16">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-5 text-center">
        <div
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-sm"
          aria-label="Status"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            aria-hidden
          />
          {HERO_MOBILE.status.label}
        </div>

        <h1
          className="flex flex-col items-center font-mono text-4xl tracking-tight text-white sm:text-5xl"
          aria-label={`${firstName} ${lastName}`}
        >
          <span className="block leading-[0.95]">{firstName}</span>
          <span className="block leading-[0.95]">{lastName}</span>
        </h1>

        <div className="flex flex-col items-center justify-center gap-2.5 font-mono text-sm text-white text-center max-w-sm px-2">
          <span className="leading-relaxed">{HERO_MOBILE.skillPrefix}</span>
          <span
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 text-center leading-none text-white backdrop-blur-sm shadow-sm"
            style={{ minWidth: `${Math.max(typeSlotWidth + 4, 16)}ch` }}
          >
            <span className="leading-none font-medium whitespace-nowrap">
              {displayText || "\u00A0"}
            </span>
            <span
              className="hero-mobile-cursor ml-1 inline-block h-[1.1em] w-[0.55ch] shrink-0 border-r-2 border-white"
              aria-hidden
            />
          </span>
          <span className="sr-only" aria-live="polite">
            {HERO_MOBILE.skillPrefix} {announcedSkill}
          </span>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-white">
          {dynamicTagline}
        </p>

        <div className="flex flex-wrap items-center justify-center font-mono text-xs tracking-[0.06em] text-white">
          {mobileSocials.map(({ id, handle, href }, index) => (
            <span key={id} className="inline-flex items-center">
              {index > 0 ? (
                <span className="px-2 text-white/50" aria-hidden>
                  /
                </span>
              ) : null}
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer noopener"
                onClick={() => trackContactInterested()}
                className="transition hover:text-white/80"
              >
                {handle}
              </a>
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-3 px-2">
        {HERO_MOBILE.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            onClick={(e) => {
              trackContactInterested();
              if (cta.href.includes("#")) {
                const hash = cta.href.split("#")[1];
                if (window.location.pathname === "/" || cta.href.startsWith("#")) {
                  e.preventDefault();
                  const elem = document.getElementById(hash);
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = cta.href;
                  }
                }
              }
            }}
            className={
              cta.variant === "primary"
                ? "cta-highlight-get-in-touch cursor-pointer inline-flex flex-1 min-w-[140px] items-center justify-center rounded-xl border border-white/15 bg-[#415d43] px-6 py-3 font-mono text-xs tracking-[0.18em] text-white uppercase whitespace-nowrap transition hover:border-white/30 hover:bg-[#4d6e4f] sm:flex-none"
                : "cursor-pointer inline-flex flex-1 min-w-[140px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs tracking-[0.18em] text-white uppercase whitespace-nowrap transition hover:border-white/25 hover:bg-white/10 sm:flex-none"
            }
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
