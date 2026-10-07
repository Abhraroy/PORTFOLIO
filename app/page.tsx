import HomeBelowFold from "@/components/HomeBelowFold";
import { HeroSection } from "@/components/NewHeroSection";
import { VisitorMode } from "@/components/VisitorMode";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#111d13]">
      <HeroSection />
      <VisitorMode />
      <HomeBelowFold />
    </main>
  );
}
