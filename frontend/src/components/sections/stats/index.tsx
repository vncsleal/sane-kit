"use client";

import type { StatsSection } from "@/sanity/types";
import { stegaClean } from 'next-sanity';
import Grid from "./grid";
import WithContent from "./withContent";

export default function StatsSectionRouter(props: StatsSection) {
  const { variant = "grid" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "withContent":
      return <WithContent {...props} />;
    case "grid":
    default:
      return <Grid {...props} />;
  }
}

// Re-export the main component types for convenience
export type { StatsSection };
