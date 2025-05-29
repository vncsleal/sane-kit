"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader, FeatureItem } from "./shared";

type DefaultProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'features'>;

export default function Default({ 
  badgeText, 
  heading, 
  subheading, 
  features = [] 
}: DefaultProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
          <SectionHeader 
            badgeText={badgeText} 
            heading={heading} 
            subheading={subheading} 
          />
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              {features.map((feature) => (
                <FeatureItem key={feature._key} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
