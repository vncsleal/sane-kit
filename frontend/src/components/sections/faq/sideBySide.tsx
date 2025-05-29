"use client";

import type { FaqSection } from "@/sanity/types";
import { ContentSection, FaqAccordion } from "./shared";

type SideBySideProps = FaqSection;

export default function SideBySide({
  badgeText = "FAQ",
  heading,
  subheading,
  buttonText,
  buttonUrl = "#",
  buttonIcon = "phone",
  faqItems = [],
}: SideBySideProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left column with content */}
          <div className="flex gap-10 flex-col">
            <ContentSection
              badgeText={badgeText}
              heading={heading}
              subheading={subheading}
              buttonText={buttonText}
              buttonUrl={buttonUrl}
              buttonIcon={buttonIcon}
              isCenter={false}
            />
          </div>

          {/* Right column with accordion */}
          <FaqAccordion faqItems={faqItems} />
        </div>
      </div>
    </div>
  );
}
