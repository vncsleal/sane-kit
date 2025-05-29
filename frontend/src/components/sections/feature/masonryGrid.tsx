"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader, IconMap } from "./shared";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

type MasonryGridProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'features'>;

export default function MasonryGrid({
  badgeText,
  heading,
  subheading,
  features = []
}: MasonryGridProps) {
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
            {features.map((feature, index) => {
              const Icon =
                feature.icon && IconMap[feature.icon]
                  ? IconMap[feature.icon]
                  : IconMap.user;

              const shouldSpanTwoColumns =
                index === 0 ||
                (index >= 3 &&
                  Math.floor((index - 3) / 4) * 4 + 3 <= index &&
                  index <= Math.floor((index - 3) / 4) * 4 + 4);

              return (
                <div
                  key={feature._key}
                  className={`relative bg-muted rounded-md overflow-hidden
                    ${
                      shouldSpanTwoColumns
                        ? "h-full lg:col-span-2 aspect-square lg:aspect-auto"
                        : "aspect-square"
                    }`}
                >
                  {feature.image?.asset?._ref ? (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={urlFor(feature.image.asset._ref).url()}
                        alt={feature.image.alt || feature.title || ""}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                  ) : (
                    <div className="absolute top-6 left-6">
                      <Icon className="w-8 h-8 stroke-1" />
                    </div>
                  )}

                  <div className="relative z-10 flex justify-between flex-col h-full p-6">
                    {!feature.image?.asset?._ref && <div className="mb-10" />}
                    <div className="flex flex-col mt-auto">
                      <h3
                        className={`text-xl tracking-tight ${
                          feature.image?.asset?._ref ? "text-white" : ""
                        }`}
                      >
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p
                          className={`max-w-xs text-base ${
                            feature.image?.asset?._ref
                              ? "text-white/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
