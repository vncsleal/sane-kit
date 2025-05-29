"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader, FeatureImage } from "./shared";

type RightImageProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'image'>;

export default function RightImage({
  badgeText,
  heading,
  subheading,
  image
}: RightImageProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row-reverse gap-10 lg:items-center">
          <FeatureImage image={image} heading={heading} />
          <div className="flex gap-4 pr-0 lg:pr-20 flex-col flex-1">
            <SectionHeader
              badgeText={badgeText}
              heading={heading}
              subheading={subheading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
