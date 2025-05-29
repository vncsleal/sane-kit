"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader, FeatureImage } from "./shared";

type LeftImageProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'image'>;

export default function LeftImage({
  badgeText,
  heading,
  subheading,
  image
}: LeftImageProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
          <FeatureImage image={image} heading={heading} />
          <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
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
