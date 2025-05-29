"use client";

import type { PricingSection } from "@/sanity/types";
import DefaultPricing from "./default";

export default function PricingSectionRouter(props: PricingSection) {
  // Currently, we only have one variant, but this structure allows for easy expansion
  // to multiple variants in the future if needed
  return <DefaultPricing {...props} />;
}

// Re-export the type for convenience
export type { PricingSection };
