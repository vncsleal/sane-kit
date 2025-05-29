"use client";

import type { NewsletterSection } from "@/sanity/types";
import Default from "./default";
import Highlight from "./highlight";
import Minimal from "./minimal";
import Full from "./full";

export default function NewsletterSectionRouter(props: NewsletterSection) {
  const { variant = "default" } = props;

  // Route to the appropriate variant component
  switch (variant) {
    case "highlight":
      return <Highlight {...props} />;
    case "minimal":
      return <Minimal {...props} />;
    case "full":
      return <Full {...props} />;
    case "default":
    default:
      return <Default {...props} />;
  }
}

// Re-export the main component types for convenience
export type { NewsletterSection };
