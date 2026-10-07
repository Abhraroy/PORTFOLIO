"use client";

import dynamic from "next/dynamic";

const AboutMe = dynamic(
  () => import("@/components/AboutMe").then((m) => m.AboutMe),
  { ssr: false },
);
const Experience = dynamic(
  () => import("@/components/Experience").then((m) => m.Experience),
  { ssr: false },
);
const Skills = dynamic(
  () => import("@/components/Skills").then((m) => m.Skills),
  { ssr: false },
);
const ProjectShowcase = dynamic(
  () =>
    import("@/components/ProjectShowcase").then((m) => m.ProjectShowcase),
  { ssr: false },
);
const BuildTogether = dynamic(
  () => import("@/components/BuildTogether").then((m) => m.BuildTogether),
  { ssr: false },
);

const SelectedWork = dynamic(
  () => import("@/components/SelectedWork").then((m) => m.SelectedWork),
  { ssr: false },
);

/** Below-fold home sections — lazy-loaded so they do not compete with the hero chunk. */
export default function HomeBelowFold() {
  return (
    <>
      <AboutMe />
      <Experience />
      <SelectedWork />
      <Skills />
      <ProjectShowcase />
      <BuildTogether />
    </>
  );
}
