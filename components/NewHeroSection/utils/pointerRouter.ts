type PointerHandlers = {
  onMove: (e: PointerEvent) => void;
  onUp: (e: PointerEvent) => void;
};

const active = new Map<number, PointerHandlers>();
let attachedEl: HTMLElement | null = null;
let attachCount = 0;

function onMove(e: PointerEvent) {
  active.get(e.pointerId)?.onMove(e);
}

function onUp(e: PointerEvent) {
  const handlers = active.get(e.pointerId);
  if (!handlers) return;
  handlers.onUp(e);
  active.delete(e.pointerId);
}

/**
 * Attach a single set of canvas pointer listeners (shared across all skill nodes).
 * Call once from a parent that owns the WebGL canvas element.
 */
export function attachPointerRouter(el: HTMLElement) {
  if (attachedEl === el) {
    attachCount += 1;
    return () => detachPointerRouter(el);
  }
  if (attachedEl) {
    detachPointerRouter(attachedEl);
  }
  attachedEl = el;
  attachCount = 1;
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
  return () => detachPointerRouter(el);
}

function detachPointerRouter(el: HTMLElement) {
  if (attachedEl !== el) return;
  attachCount = Math.max(0, attachCount - 1);
  if (attachCount > 0) return;
  el.removeEventListener("pointermove", onMove);
  el.removeEventListener("pointerup", onUp);
  el.removeEventListener("pointercancel", onUp);
  attachedEl = null;
  active.clear();
}

/** Register handlers for an active press (pointerdown on a skill node). */
export function registerPointerPress(
  pointerId: number,
  handlers: PointerHandlers,
) {
  active.set(pointerId, handlers);
}

/** Clear a press without waiting for pointerup (e.g. unmount mid-gesture). */
export function clearPointerPress(pointerId: number) {
  active.delete(pointerId);
}
