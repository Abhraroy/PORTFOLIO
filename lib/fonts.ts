import {
  Geist,
  Geist_Mono,
  Space_Grotesk,
  Inter,
  Outfit,
  JetBrains_Mono,
  Zen_Dots,
  Pixelify_Sans
} from "next/font/google";

/**
 * --------------------------------------------------------------------------
 * Google Fonts Configuration
 * --------------------------------------------------------------------------
 * Next.js automatically optimizes and self-hosts fonts loaded via next/font/google.
 * No external network requests are made by the client's browser.
 *
 * To add a new font:
 * 1. Import it from 'next/font/google' (replace spaces with underscores, e.g. Space_Grotesk).
 * 2. Configure subsets, display, and a CSS variable name (--font-...).
 * 3. Add the font's variable to `fontVariables` below.
 * 4. (Optional) Map the CSS variable in `app/globals.css` under `@theme inline`.
 */

// Primary Sans font
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Primary Monospace font (used heavily across terminal & tech badge components)
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Display / Heading font (modern geometric font for hero banners and section titles)
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Optional alternative sans (clean UI font)
export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Optional alternative modern display font
export const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Optional alternative developer mono font
export const fontJetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontZenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zen-dots",
  display: "swap",
});

export const fontPixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
  display: "swap",
});




/**
 * Combined CSS variables string to attach directly to <html> or <body> in RootLayout.
 */
export const fontVariables = [
  fontSans.variable,
  fontMono.variable,
  fontDisplay.variable,
  fontInter.variable,
  fontOutfit.variable,
  fontJetBrainsMono.variable,
  fontZenDots.variable,
  fontPixelifySans.variable,
].join(" ");
