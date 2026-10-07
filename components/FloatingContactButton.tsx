"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiArrowUp } from "react-icons/fi";
import { trackContactInterested } from "@/lib/track";

export default function FloatingContactButton() {
  const pathname = usePathname();
  const [isInContactSection, setIsInContactSection] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hide on admin routes
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || isAdmin) return;

    const contactElement = document.getElementById("contact");
    if (!contactElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInContactSection(entry.isIntersecting);
      },
      {
        threshold: 0.15, // Triggers when 15% of #contact section enters viewport
      }
    );

    observer.observe(contactElement);

    return () => {
      observer.disconnect();
    };
  }, [isAdmin, pathname]);

  if (!mounted || isAdmin) return null;

  const scrollToContact = () => {
    trackContactInterested();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isInContactSection ? (
          <motion.button
            key="contact-me-btn"
            onClick={scrollToContact}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            aria-label="Scroll to Contact section"
            className="group flex items-center gap-2 rounded-full border border-white/20 bg-[#09090b]/85 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/15 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.22)] cursor-pointer"
          >
            <FiMail className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
            <span>Contact Me</span>
          </motion.button>
        ) : (
          <motion.button
            key="back-to-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            aria-label="Scroll back to top"
            className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-[#09090b]/85 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/15 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.22)] cursor-pointer"
          >
            <FiArrowUp className="h-4 w-4 text-white transition-transform group-hover:-translate-y-0.5" />
            <span>Top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
