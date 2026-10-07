"use client";

import { motion } from "framer-motion";
import {
  useVisitorModeStore,
  VISITOR_MODES,
  type VisitorMode as VisitorModeType,
} from "@/zustand";
import { useAdminStore } from "@/app/admin/_components/store";

const DEFAULT_MODE_LABELS: Record<string, string> = {
  explorer: "Explorer",
  builder: "Builder",
  business: "Business",
};

export default function VisitorMode() {
  const mode = useVisitorModeStore((s) => s.mode);
  const setMode = useVisitorModeStore((s) => s.setMode);
  const setSwitching = useVisitorModeStore((s) => s.setSwitching);
  const { modes, activeModeId, setActiveModeId } = useAdminStore();

  const options =
    modes && modes.length > 0
      ? modes.map((m) => ({
          key: m.id,
          name: m.mode_name,
          modeType: m.mode_name.toLowerCase(),
        }))
      : VISITOR_MODES.map((vm) => ({
          key: vm,
          name: DEFAULT_MODE_LABELS[vm] || vm,
          modeType: vm,
        }));

  return (
    <section
      className="w-full bg-transparent px-4 py-6 sm:px-6 sm:py-8"
      aria-label="Visitor mode"
    >
      <div
        className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-3 rounded-2xl border border-white/20 bg-transparent p-2 sm:flex-row sm:items-center sm:justify-center sm:gap-1 sm:p-1.5"
        role="tablist"
        aria-label="Choose visitor mode"
      >
        {options.map((opt, index) => {
          const selected =
            activeModeId === opt.key ||
            mode === opt.modeType ||
            (index === 0 && !activeModeId);

          return (
            <motion.button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setMode(opt.modeType as VisitorModeType);
                if (opt.key && opt.key !== opt.modeType) {
                  setActiveModeId(opt.key);
                } else if (modes.length > 0) {
                  const match = modes.find(
                    (m) => m.mode_name.toLowerCase() === opt.modeType
                  );
                  if (match) setActiveModeId(match.id);
                }
              }}
              onAnimationComplete={() => {
                if (selected) setSwitching(false);
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: selected ? 1 : 0.98,
              }}
              whileHover={{ scale: selected ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 28,
                delay: index * 0.05,
              }}
              className={`relative isolate min-h-11 flex-1 overflow-hidden rounded-xl px-4 py-2.5 font-mono text-xs tracking-[0.18em] uppercase transition-colors sm:min-h-10 sm:px-5 ${
                selected
                  ? "text-white font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="visitor-mode-indicator"
                  className="absolute inset-0 -z-10 rounded-xl border border-white/15 bg-[#415d43]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}
              <span className="relative z-10">{opt.name}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
