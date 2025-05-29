"use client";

import type { TestimonialsSection } from "@/sanity/types";
import Carousel from "./carousel";
import Grid from "./grid";
import MasonryGrid from "./masonryGrid";

export default function TestimonialsSectionRouter(props: TestimonialsSection) {
  const {
    variant = "carousel",
    heading,
    subheading,
    testimonials = [],
  } = props;

  // Route to the appropriate variant component with properly typed props
  const variantProps = { 
    heading: heading || "", 
    subheading, 
    testimonials 
  };

  // Select the appropriate component based on the variant
  switch (variant) {
    case "carousel":
      return <Carousel {...variantProps} />;
    case "grid":
      return <Grid {...variantProps} />;
    case "masonry-grid":
      return <MasonryGrid {...variantProps} />;
    default:
      return <Carousel {...variantProps} />;
  }
}

// Re-export the main component types for convenience
export type { TestimonialsSection };
