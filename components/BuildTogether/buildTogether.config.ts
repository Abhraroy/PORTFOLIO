import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export type ContactBadge = {
  id: string;
  label: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  Icon: IconType;
};

export const BUILD_TOGETHER = {
  eyebrow: "Contact",
  heading: "Let's build something together",
  subtitle:
    "Have an idea, a product, or a rough sketch on a napkin? Drop a message below and let's turn it into something real.",
  /** Contact address the message form composes to. */
  email: "",
  placeholder:
    "Tell me about your project — what you're building, timelines, and where I can help…",
  cta: "Send message",
} as const;

/** Small status pills shown above the message panel. */
export const CONTACT_BADGES: readonly ContactBadge[] = [
  { id: "available", label: "Available for work" },
  { id: "remote", label: "Remote · Worldwide" },
  { id: "response", label: "Replies within 24h" },
] as const;

/** Social channels rendered as icon buttons below the message panel. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/",
    Icon: FaGithub,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/",
    Icon: FaLinkedinIn,
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://x.com/",
    Icon: FaXTwitter,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/",
    Icon: FaInstagram,
  },
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.com/",
    Icon: FaDiscord,
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${BUILD_TOGETHER.email}`,
    Icon: FaEnvelope,
  },
] as const;
