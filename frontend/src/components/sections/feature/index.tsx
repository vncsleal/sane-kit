"use client";

import type { FeatureSection } from "@/sanity/types";
import SlidingComparison from "./slidingComparison";
import CarouselFeature from "./carouselFeature";
import BigMasonryGrid from "./bigMasonryGrid";
import MasonryGrid from "./masonryGrid";
import ImageCards from "./imageCards";
import LeftImage from "./leftImage";
import RightImage from "./rightImage";
import WithImage from "./withImage";
import Default from "./default";

export default function FeatureSectionRouter(props: FeatureSection) {
  const { variant = "default" } = props;

  // Route to the appropriate variant component
  switch (variant) {
    case "slidingComparison":
      return <SlidingComparison {...props} />;
    case "carouselFeature":
      return <CarouselFeature {...props} />;
    case "bigMasonryGrid":
      return <BigMasonryGrid {...props} />;
    case "masonryGrid":
      return <MasonryGrid {...props} />;
    case "imageCards":
      return <ImageCards {...props} />;
    case "leftImage":
      return <LeftImage {...props} />;
    case "rightImage":
      return <RightImage {...props} />;
    case "withImage":
      return <WithImage {...props} />;
    case "default":
    default:
      return <Default {...props} />;
  }
}

// Re-export the main component types for convenience
export type { FeatureSection };
