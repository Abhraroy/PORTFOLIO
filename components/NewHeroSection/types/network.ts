/** Readonly XYZ tuple used for positions and look-at targets. */
export type Vec3 = readonly [number, number, number];

/** Mutable XYZ tuple. */
export type MutableVec3 = [number, number, number];

export type BreakpointKey = "mobile" | "tablet" | "desktop";

/** Layout metrics for one viewport band — see CONFIG.md. */
export type BreakpointConfig = {
  minWidth: number;
  radius: number;
  nodeCount: number;
  showLabels: boolean;
  hitScale: number;
  cameraDistance: number;
  centerSize: number;
  nodeSize: number;
  holdMs: number;
  labelFontSize: number;
};

/** Skill catalog entry — tooltip label + click card fields. */
export type SkillNodeData = {
  id: string;
  label: string;
  title: string;
  description: string;
  techStack: readonly string[];
  cta: {
    label: string;
    href: string;
  };
  image?: string;
  /** Optional width for the node's info card (e.g., "250px", "16rem", 260). */
  cardWidth?: string | number;
  /** Optional overall height for the info card (e.g., "350px", 400). */
  cardHeight?: string | number;
  /** Optional minimum overall height for the info card (e.g., "300px", 350). */
  cardMinHeight?: string | number;
  /** Optional height for the card's header image container (e.g., "120px", 100). */
  cardImageHeight?: string | number;
  /** Optional title font size (e.g., "14px", "1rem"). */
  titleFontSize?: string | number;
  /** Optional description font size (e.g., "12px", "0.85rem"). */
  descriptionFontSize?: string | number;
  /** Optional tech badge font size (e.g., "10px", "9px"). */
  techBadgeFontSize?: string | number;
  /** Optional CTA button font size (e.g., "12px", "11px"). */
  ctaFontSize?: string | number;
  /** Optional card padding (e.g., "16px", "1rem"). */
  padding?: string | number;
};

/** Center brand node config. */
export type CenterNodeData = {
  id: string;
  // label: string;
  logoUrl?: string;
};

/** Skill plus Fibonacci placement. */
export type PositionedSkillNode = SkillNodeData & {
  position: Vec3;
  index: number;
};

/** Camera pose helper return type. */
export type CameraTarget = {
  position: Vec3;
  lookAt: Vec3;
};
