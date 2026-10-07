"use client";

import { useEffect } from "react";
import { useAdminStore } from "./store";

export function AdminInitializer() {
  const fetchInitialData = useAdminStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return null;
}
