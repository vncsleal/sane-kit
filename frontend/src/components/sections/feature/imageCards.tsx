"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader } from "./shared";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

type ImageCardsProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'features'>;

export default function ImageCards({
  badgeText,
  heading,
  subheading,
  features = []
}: ImageCardsProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <SectionHeader
              badgeText={badgeText}
              heading={heading}
              subheading={subheading}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature._key} className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2">
                  {feature.image?.asset?._ref && (
                    <div className="relative w-full h-full">
                      <Image
                        src={urlFor(feature.image.asset._ref).url()}
                        alt={feature.image.alt || feature.title || ""}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-xl tracking-tight">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-muted-foreground text-base">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
