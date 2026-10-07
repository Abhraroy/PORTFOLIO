export type NavItem = {
  label: string;
  href: string;
};

export const NAV_BRAND = {
  label: "blankdev",
  href: "/",
} as const;

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
