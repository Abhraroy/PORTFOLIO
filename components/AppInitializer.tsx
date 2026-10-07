"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/app/admin/_components/store";

export function AppInitializer() {
  const fetchInitialData = useAdminStore((state) => state.fetchInitialData);

  useEffect(() => {
    // Disable browser automatic scroll restoration to ensure refresh always starts at top
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Scroll to top on fresh load if no URL hash exists
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    fetchInitialData();
  }, [fetchInitialData]);

  return null;
}
