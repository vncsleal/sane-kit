"use client";

import type { FaqSection } from "@/sanity/types";
import { ContentSection, FaqAccordion } from "./shared";

type CenteredProps = FaqSection;

export default function Centered({
  badgeText = "FAQ",
  heading,
  subheading,
  buttonText,
  buttonUrl = "#",
  buttonIcon = "phone",
  faqItems = [],
}: CenteredProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          {/* Centered content section */}
          <div className="flex text-center justify-center items-center gap-4 flex-col">
            <ContentSection
              badgeText={badgeText}
              heading={heading}
              subheading={subheading}
              buttonText={buttonText}
              buttonUrl={buttonUrl}
              buttonIcon={buttonIcon}
              isCenter={true}
            />
          </div>

          {/* Centered accordion */}
          <div className="max-w-3xl w-full mx-auto">
            <FaqAccordion faqItems={faqItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
