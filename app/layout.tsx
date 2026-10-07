import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import FloatingContactButton from "@/components/FloatingContactButton";
import { AppInitializer } from "@/components/AppInitializer";

export const metadata: Metadata = {
  title: "Abhradip Roy — blankdev",
  description: "Full-stack developer crafting fast, polished web applications and AI-powered systems.",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppInitializer />
        <SmoothScroll>
          {/* <Navbar /> */}
          {children}
          <FloatingContactButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
