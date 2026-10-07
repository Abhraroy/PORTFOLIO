"use client";

import React, { useState, useEffect } from "react";
import { CardContentProps } from "./types";
import { FiDownload } from "react-icons/fi";
import { trackResumeDownload, trackScrolledPastHero } from "@/lib/track";

const ROLES = [
  "DEVELOPER",
  "AGENTIC AI",
  "FULL-STACK",
  "AI ENGINEER",
  "APPLIED AI",
];

/**
 * CardContent
 * The inner content of the main physical 3D card.
 * Written directly in this file without props passed down.
 */
export default function CardContent({ className = "" }: CardContentProps = {}) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState(ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    fallbackId?: string
  ) => {
    e.preventDefault();
    trackScrolledPastHero();
    if (typeof window === "undefined") return;

    if (window.location.pathname === "/" || window.location.pathname === "") {
      const elem =
        document.getElementById(targetId) ||
        (fallbackId ? document.getElementById(fallbackId) : null);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        if (window.history?.pushState) {
          window.history.pushState(null, "", `#${targetId}`);
        }
        return;
      }
    }

    window.location.href = `/#${targetId}`;
  };

  useEffect(() => {
    const targetWord = ROLES[roleIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, 50);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    } else {
      if (currentText.length < targetWord.length) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, 110);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="w-full h-[460px] gap-2 p-2 flex justify-center items-center">
        <div className="flex-[10] flex flex-col h-full">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start w-full">
              <span className="text-[#cfff04] font-pixelify text-[2rem]">
                Welcome,
              </span>
              <span className="font-pixelify-sans text-[2rem]">I'm</span>
              <span className="font-pixelify-sans text-[2.5rem]">
                Abhradip Roy
              </span>
            </div>
            <div className="w-fit h-fit flex-col gap-6 overflow-hidden">
              <div className="flex flex-row gap-2 items-baseline shrink-0 flex-nowrap font-pixelify text-[#cfff04] text-[1.1rem]">
                <span className="shrink-0 select-none">$ /- blank&nbsp;</span>
                <span className="shrink-0 leter-spacing-[-1px]">
                  {currentText}
                </span>
                <span
                  className="terminal-bottom-cursor shrink-0"
                  aria-hidden="true"
                />
              </div>
              <span className="text-[#cfff04] font-pixelify text-[1rem]">
                $ /- blank&nbsp; Loading resume...
              </span>
            </div>
            <div className="flex flex-col  flex-wrap gap-6 w-[80%]">
              <a
                href="/api/resume/download"
                download
                onClick={() => trackResumeDownload()}
                className="font-pixelify-sans text-[1.5rem] bg-black text-white p-2 pl-4 pr-4 rounded-sm border-4 border-solid cursor-pointer border-[#cfff04] flex items-center justify-center gap-2 flex-1 w-full active:scale-95 transition-all duration-150"
                title="Download Resume / CV"
              >
                Check my CV <FiDownload className="h-3.5 w-3.5 text-white" />
              </a>
              <div className="flex flex-row gap-2 items-center justify-center">
                <a
                  href="#skills"
                  onClick={(e) => handleNavClick(e, "skills")}
                  className="font-pixelify-sans text-[1rem] text-white p-1 rounded-sm border-r-4 border-l-4 border-solid cursor-pointer border-[#cfff04]  hover:text-[#cfff04] active:scale-95 transition-all duration-150 inline-block text-center select-none"
                >
                  SKILLS
                </a>{" "}
                <a
                  href="#work"
                  onClick={(e) => handleNavClick(e, "work", "projects")}
                  className="font-pixelify-sans text-[1rem] text-white p-1 rounded-sm border-r-4 border-l-4 border-solid cursor-pointer border-[#cfff04] hover:text-[#cfff04] active:scale-95 transition-all duration-150 inline-block text-center select-none"
                >
                  PROJECTS
                </a>{" "}
                <a
                  href="#experience"
                  onClick={(e) => handleNavClick(e, "experience", "achievements")}
                  className="font-pixelify-sans text-[1rem] text-white p-1 rounded-sm border-r-4 border-l-4 border-solid cursor-pointer border-[#cfff04] hover:text-[#cfff04] active:scale-95 transition-all duration-150 inline-block text-center select-none"
                >
                  ACHIEVMENTS
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-start h-full overflow-clip">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className="count rotate-90 inline-block text-[1rem] font-extrabold"
              style={{ "--delay": `${i * 0.3}s` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
