"use client";

import type { FeatureSection } from "@/sanity/types";
import { Badge } from "@/components/ui/badge";
import { FeatureItem, FeatureImage } from "./shared";

type WithImageProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'features' | 'image'>;

export default function WithImage({
  badgeText,
  heading,
  subheading,
  features = [],
  image
}: WithImageProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid border rounded-lg py-8 px-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              {badgeText && (
                <div>
                  <Badge variant="outline">{badgeText}</Badge>
                </div>
              )}
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  {heading}
                </h2>
                {subheading && (
                  <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                    {subheading}
                  </p>
                )}
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              {features.map((feature) => (
                <FeatureItem key={feature._key} feature={feature} />
              ))}
            </div>
          </div>
          <FeatureImage image={image} heading={heading} />
        </div>
      </div>
    </div>
  );
}
