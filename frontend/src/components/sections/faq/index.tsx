"use client";

import type { FaqSection } from "@/sanity/types";
import { stegaClean } from 'next-sanity';
import SideBySide from "./sideBySide";
import Centered from "./centered";

export default function FaqSectionRouter(props: FaqSection) {
  const { variant = "sideBySide" } = props;

  // Route to the appropriate variant component
  switch (stegaClean(variant)) {
    case "centered":
      return <Centered {...props} />;
    case "sideBySide":
    default:
      return <SideBySide {...props} />;
  }
}

// Re-export the main component types for convenience
export type { FaqSection };
