"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiDownload, FiHome } from "react-icons/fi";
import { NAV_BRAND, NAV_LINKS } from "./nav.config";
import { useAdminStore } from "@/app/admin/_components/store";

const navShell =
  "mx-auto flex h-16 max-w-7xl items-center justify-between border border-white/10 bg-white/10 px-4 backdrop-blur-xl sm:px-6";
const brandClass =
  "font-mono text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:text-white/80";
const linkClass = "text-sm text-white transition-colors hover:text-white/80";

type NavTier = "mobile" | "tablet" | "desktop";

function readTier(): NavTier {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
  if (window.matchMedia("(min-width: 768px)").matches) return "tablet";
  return "mobile";
}

export function ResumeCtaButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/api/resume/download"
      download
      title="Download Resume / CV"
    >
      <FiDownload className="h-3.5 w-3.5 text-white" />
      <span>Resume / CV</span>
    </a>
  );
}

export const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.includes("#")) {
    const hash = href.split("#")[1];
    if (window.location.pathname === "/" || href.startsWith("#")) {
      e.preventDefault();
      const elem = document.getElementById(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  }
};

function MobileNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  brandName?: string;
}) {
  const mobileNavLinks = NAV_LINKS.filter((item) => item.label.toLowerCase() !== "home");

  return (
    <div className="w-full">
      <nav
        className={`${navShell} w-full rounded-full`}
        aria-label="Primary mobile"
      >
        <Link
          href={NAV_BRAND.href}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-white/30 hover:bg-white/20 hover:text-white"
          onClick={(e) => {
            setOpen(false);
            handleNavClick(e, NAV_BRAND.href);
          }}
          aria-label="Home"
          title="Home"
        >
          <FiHome className="h-4 w-4 text-white" />
        </Link>

        <div className="flex items-center gap-2">
          <ResumeCtaButton />

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-3 space-y-1 rounded-2xl border border-white/10 bg-zinc-950/95 p-3 backdrop-blur-xl shadow-2xl">
          {mobileNavLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/5 hover:text-white"
                onClick={(e) => {
                  setOpen(false);
                  handleNavClick(e, item.href);
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabletNav({ brandName }: { brandName: string }) {
  return (
    <nav
      className={`${navShell} w-full rounded-full`}
      aria-label="Primary tablet"
    >
      {/* <Link href={NAV_BRAND.href} className={brandClass}>
        {brandName}
      </Link> */}

      <div className="flex items-center gap-5">
        <ul className="flex items-center gap-5">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ResumeCtaButton />
      </div>
    </nav>
  );
}

function DesktopNav({ brandName }: { brandName: string }) {
  return (
    <nav
      className={`${navShell} w-full rounded-full`}
      aria-label="Primary desktop"
    >
      {/* <Link href={NAV_BRAND.href} className={brandClass}>
        {brandName}
      </Link> */}

      <div className="flex items-center gap-8">
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ResumeCtaButton />
      </div>
    </nav>
  );
}

/**
 * Navbar — glass blur kept; only one breakpoint tree mounts at a time.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<NavTier>("desktop");
  const { details } = useAdminStore();
  const brandName = details?.full_name || NAV_BRAND.label;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const update = () => {
      const next = readTier();
      setTier(next);
      if (next !== "mobile") setOpen(false);
    };
    update();
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-fit w-full items-center justify-center p-6">
        {tier === "mobile" ? (
          <MobileNav open={open} setOpen={setOpen} brandName={brandName} />
        ) : tier === "tablet" ? (
          <TabletNav brandName={brandName} />
        ) : (
          <DesktopNav brandName={brandName} />
        )}
      </div>
    </header>
  );
}
