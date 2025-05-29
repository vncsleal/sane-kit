"use client";

import type { CtaSection } from "@/sanity/types";
import { SectionHeader, ButtonsGroup } from "./shared";

type MinimalProps = CtaSection;

export default function Minimal({
  variant = "minimal",
  badgeText,
  heading,
  subheading,
  buttons = [],
}: MinimalProps) {
  // Minimal variant has no special container styles
  const containerStyle = "";

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className={`flex flex-col text-center gap-8 items-center ${containerStyle}`}>
          <SectionHeader
            badgeText={badgeText}
            heading={heading}
            subheading={subheading}
            variant={variant}
          />
          <ButtonsGroup buttons={buttons} variant={variant} />
        </div>
      </div>
    </div>
  );
}
