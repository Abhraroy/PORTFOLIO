"use client";

import { useCallback, useEffect, useRef } from "react";

type HoldHandlers = {
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerLeave: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;
};

/**
 * Mobile long-press helper (currently unused by SkillNode — click selects).
 * Kept for optional touch long-press flows.
 *
 * @param onHold - Callback after the hold threshold
 * @param thresholdMs - Hold duration in milliseconds
 * @param enabled - When false, handlers no-op
 * @returns Pointer handlers to spread onto a target
 */
export function useHoldGesture(
  onHold: () => void,
  thresholdMs: number,
  enabled: boolean,
): HoldHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heldRef = useRef(false);
  const onHoldRef = useRef(onHold);
  onHoldRef.current = onHold;

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clear(), [clear]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!enabled) return;
      // Touch / pen only — mouse uses hover path.
      if (event.pointerType === "mouse") return;
      heldRef.current = false;
      clear();
      timerRef.current = setTimeout(() => {
        heldRef.current = true;
        onHoldRef.current();
      }, thresholdMs);
    },
    [clear, enabled, thresholdMs],
  );

  const cancelIfNotHeld = useCallback(
    (_event: React.PointerEvent) => {
      clear();
      heldRef.current = false;
    },
    [clear],
  );

  return {
    onPointerDown,
    onPointerUp: cancelIfNotHeld,
    onPointerLeave: cancelIfNotHeld,
    onPointerCancel: cancelIfNotHeld,
  };
}
