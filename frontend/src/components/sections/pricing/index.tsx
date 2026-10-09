"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import DefaultPricing from "./default";

export default function PricingSectionRouter(props: ExtractPageBuilderType<"pricingSection">) {
  // Currently, we only have one variant, but this structure allows for easy expansion
  // to multiple variants in the future if needed
  return <DefaultPricing {...props} />;
}
