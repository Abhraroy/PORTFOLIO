"use client";

import { motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import { FiSend, FiMail } from "react-icons/fi";
import {
  BUILD_TOGETHER,
  CONTACT_BADGES,
} from "./buildTogether.config";
import { useAdminStore } from "@/app/admin/_components/store";
import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { trackContactFormSubmit, trackContactInterested } from "@/lib/track";

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

/**
 * Contact section — a glass message panel framed by status badges
 * on top and social channels on the bottom.
 */
export default function BuildTogether() {
  const { details } = useAdminStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const contactEmail = details?.email || "";

  const formatLocationLabel = () => {
    if (!details) return "Remote · Worldwide";
    if (details.location) return details.location;
    const parts = [
      details.address,
      details.district,
      details.state,
      details.country,
      details.pin_code ? `PIN: ${details.pin_code}` : null,
    ].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(", ");
    }
    return "Remote · Worldwide";
  };

  const dynamicBadges = [
    { id: "available", label: "Available for work" },
    {
      id: "location",
      label: formatLocationLabel(),
    },
    { id: "response", label: "Replies within 24h" },
  ];

  const socialChannels = [
    { id: "github", label: "GitHub", href: details?.github_url, Icon: FaGithub },
    { id: "linkedin", label: "LinkedIn", href: details?.linkedin_url, Icon: FaLinkedinIn },
    { id: "x", label: "X (Twitter)", href: details?.x_url, Icon: FaXTwitter },
    { id: "instagram", label: "Instagram", href: details?.instagram_url, Icon: FaInstagram },
    { id: "discord", label: "Discord", href: details?.discord_url, Icon: FaDiscord },
    { id: "email", label: "Email", href: contactEmail ? `mailto:${contactEmail}` : undefined, Icon: FaEnvelope },
  ].filter((s): s is { id: string; label: string; href: string; Icon: typeof FaGithub } => Boolean(s.href));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackContactFormSubmit();
    const subject = encodeURIComponent(
      name ? `New project inquiry from ${name}` : "New project inquiry",
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name || "Anonymous"}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-24 overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 "
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Header */}
        <motion.header
          className="max-w-2xl space-y-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          custom={0}
          variants={fadeUp}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {BUILD_TOGETHER.eyebrow}
          </p>
          <h2
            id="contact-heading"
            className="font-mono text-2xl tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {BUILD_TOGETHER.heading}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white sm:text-[15px]">
            {BUILD_TOGETHER.subtitle}
          </p>
        </motion.header>

        {/* Top — status badges */}
        <motion.ul
          className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-2.5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          custom={1}
          variants={fadeUp}
          aria-label="Availability"
        >
          {dynamicBadges.map((badge) => (
            <li
              key={badge.id}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-sm"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                aria-hidden
              />
              {badge.label}
            </li>
          ))}
        </motion.ul>

        {/* Center — glass message panel */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass-panel mt-7 w-full rounded-2xl p-4 text-left sm:mt-8 sm:p-6 lg:p-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          custom={2}
          variants={fadeUp}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/50 transition focus:border-white/30 focus:bg-white/[0.06] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/50 transition focus:border-white/30 focus:bg-white/[0.06] focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-3 block sm:mt-4">
            <span className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-white uppercase">
              Message
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder={BUILD_TOGETHER.placeholder}
              className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/50 transition focus:border-white/30 focus:bg-white/[0.06] focus:outline-none"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="hidden font-mono text-[10px] tracking-[0.14em] text-white uppercase sm:block">
              {contactEmail}
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Contact Request")}&body=${encodeURIComponent("Hi,\n\nI would like to get in touch regarding a potential project / collaboration opportunity.\n\nBest regards,")}`}
                onClick={() => trackContactInterested()}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <FiMail className="h-3.5 w-3.5" aria-hidden />
                Quick Message
              </a>
              <button
                type="submit"
                className="cta-highlight-get-in-touch cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#415d43] px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/30 hover:bg-[#4d6e4f]"
              >
                <FiSend className="h-3.5 w-3.5" aria-hidden />
                {BUILD_TOGETHER.cta}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Bottom — social channels */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-4 sm:mt-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          custom={3}
          variants={fadeUp}
        >
          <span className="font-mono text-[10px] tracking-[0.24em] text-white uppercase">
            Or find me on
          </span>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {socialChannels.map(({ id, label, href, Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  aria-label={label}
                  onClick={() => trackContactInterested()}
                  className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
