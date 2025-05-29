"use client";

import type { HeroSection } from "@/sanity/types";
import ButtonBanner from "./buttonBanner";
import BadgeBanner from "./badgeBanner";
import GridGallery from "./gridGallery";

export default function HeroSectionRouter(props: HeroSection) {
  const { variant = "buttonBanner" } = props;

  // Route to the appropriate variant component
  switch (variant) {
    case "badgeBanner":
      return <BadgeBanner {...props} />;
    case "gridGallery":
      return <GridGallery {...props} />;
    case "buttonBanner":
    default:
      return <ButtonBanner {...props} />;
  }
}

// Re-export the main component types for convenience
export type { HeroSection };
