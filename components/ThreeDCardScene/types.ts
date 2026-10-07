import { ReactNode, MouseEvent } from "react";

export interface ParallaxState {
  /** Normalized mouse X (-1 to 1) */
  mouseX: number;
  /** Normalized mouse Y (-1 to 1) */
  mouseY: number;
  /** Current interpolated rotation X in degrees */
  rotateX: number;
  /** Current interpolated rotation Y in degrees */
  rotateY: number;
  /** Gentle ambient breathing offset Y in px */
  floatY: number;
  /** Is mouse currently hovering over the scene */
  isHovered: boolean;
}

export interface ThreeDCardSceneContextValue {
  parallax: ParallaxState;
  /** Base perspective in pixels (default: 1200) */
  perspective: number;
  /** Base tilt angles */
  baseRotateX: number;
  baseRotateY: number;
}

export interface ThreeDCardSceneProps {
  children?: ReactNode;
  className?: string;
  /** CSS perspective value in pixels. Defaults to 1200 */
  perspective?: number;
  /** Initial resting X rotation in degrees. Defaults to 7 */
  initialRotateX?: number;
  /** Initial resting Y rotation in degrees. Defaults to -11 */
  initialRotateY?: number;
  /** Maximum rotation delta from mouse parallax. Defaults to 6 */
  maxMouseRotateX?: number;
  /** Maximum rotation delta from mouse parallax. Defaults to 8 */
  maxMouseRotateY?: number;
  /** Enable mouse parallax interaction. Defaults to true */
  enableParallax?: number | boolean;
  /** Enable gentle ambient levitation/floating. Defaults to true */
  enableFloat?: boolean;
}

export interface ThreeDCardProps {
  children?: ReactNode;
  className?: string;
  width?: string;
  height?: string;
}

export interface CardLineItem {
  /** Line number or identifier (e.g. "01", "02", "L1"). Auto-generated if omitted. */
  lineNo?: string | number;
  /** Main text content of this line */
  text: string;
  /** Optional highlight styling */
  highlight?: boolean;
  /** Optional muted / dimmed styling */
  dimmed?: boolean;
  /** Optional prefix symbol (e.g. ">", "$", "•", "→") */
  prefix?: string;
  /** Optional tag badge on the right of the line */
  tag?: string;
}

export type LineContentInput = string | CardLineItem;

/**
 * Normalizes string or CardLineItem into a uniform CardLineItem with padded line numbers.
 */
export function normalizeLine(
  input: LineContentInput,
  index: number,
  padLength: number = 2
): CardLineItem {
  if (typeof input === "string") {
    return {
      lineNo: String(index + 1).padStart(padLength, "0"),
      text: input,
    };
  }
  return {
    ...input,
    lineNo:
      input.lineNo !== undefined
        ? typeof input.lineNo === "number"
          ? String(input.lineNo).padStart(padLength, "0")
          : input.lineNo
        : String(index + 1).padStart(padLength, "0"),
  };
}

export interface CardContentProps {
  /** Title at the top header (e.g. "blank.dev") */
  title?: string;
  /** Subtitle or mode indicator (e.g. "bio.ts" or "overview") */
  subtitle?: string;
  /** Small badge or pill in the header */
  badge?: string;
  /** Status indicator label */
  statusText?: string;
  /** Primary lines of content (strings or CardLineItem objects) */
  lines?: LineContentInput[];
  /** Secondary lines shown in the footer block */
  footerLines?: LineContentInput[];
  /** Custom children if freeform JSX is needed */
  children?: ReactNode;
  className?: string;
}

export interface FloatingStatCardProps {
  className?: string;
  /** Header label / title */
  title?: string;
  /** Optional tag or badge */
  tag?: string;
  /** Single line number if displaying single item */
  lineNo?: string | number;
  /** List of lines with line numbers */
  lines?: LineContentInput[];
  /** Freeform children */
  children?: ReactNode;
  translateZ?: number;
  rotateZ?: number;
  parallaxMultiplier?: number;
  /** Backwards compatibility props */
  value?: string;
  label?: string;
  trend?: string;
  period?: string;
}

export interface FloatingInsightCardProps {
  className?: string;
  /** Tag in the header (e.g. "NOTE", "MANIFESTO") */
  tag?: string;
  /** Title or header */
  title?: string;
  /** Single line number */
  lineNo?: string | number;
  /** List of lines with line numbers */
  lines?: LineContentInput[];
  /** Footer line or reference (e.g. "01 // principles") */
  footer?: string;
  /** Freeform children */
  children?: ReactNode;
  translateZ?: number;
  rotateZ?: number;
  parallaxMultiplier?: number;
  /** Backwards compatibility props */
  quote?: string;
  author?: string;
  category?: string;
}

export interface FloatingActionCardProps {
  className?: string;
  /** Line number (e.g. "01") */
  lineNo?: string | number;
  /** Action button text */
  label?: string;
  /** Optional destination link */
  href?: string;
  /** Click handler */
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
  /** Freeform children */
  children?: ReactNode;
  translateZ?: number;
  rotateZ?: number;
  parallaxMultiplier?: number;
}

export interface FloatingBadgeCardProps {
  className?: string;
  /** Line number (e.g. "01") */
  lineNo?: string | number;
  /** Badge text */
  text?: string;
  /** Optional list of lines */
  lines?: LineContentInput[];
  /** Status dot color class (default: "bg-emerald-500") */
  statusColor?: string;
  /** Freeform children */
  children?: ReactNode;
  translateZ?: number;
  rotateZ?: number;
  parallaxMultiplier?: number;
}
