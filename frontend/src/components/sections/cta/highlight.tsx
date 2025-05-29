"use client";

import type { CtaSection } from "@/sanity/types";
import { SectionHeader, ButtonsGroup } from "./shared";

type HighlightProps = CtaSection;

export default function Highlight({
  variant = "highlight",
  badgeText,
  heading,
  subheading,
  buttons = [],
}: HighlightProps) {
  // Define container styles for the highlight variant
  const containerStyle = "bg-primary text-primary-foreground rounded-md p-4 lg:p-14";

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
