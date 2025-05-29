"use client";

import type { FeatureSection } from "@/sanity/types";
import { SectionHeader } from "./shared";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CarouselFeatureProps = Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading' | 'features'>;

export default function CarouselFeature({
  badgeText,
  heading,
  subheading,
  features = []
}: CarouselFeatureProps) {
  const featuresWithImages = features.filter(
    (feature) => feature.image?.asset?._ref,
  );
  const placeholderKeys = [
    "placeholder-slide-1",
    "placeholder-slide-2",
    "placeholder-slide-3",
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-end items-end gap-10">
          <div className="flex gap-4 flex-col items-start">
            <SectionHeader
              badgeText={badgeText}
              heading={heading}
              subheading={subheading}
            />
          </div>
          <div className="w-full max-w-full px-6">
            <Carousel>
              <CarouselContent>
                {featuresWithImages.length > 0
                  ? featuresWithImages.map((feature) => {
                      return (
                        <CarouselItem key={feature._key}>
                          <div className="rounded-md aspect-video bg-muted overflow-hidden">
                            {feature.image?.asset?._ref ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={urlFor(feature.image.asset._ref).url()}
                                  alt={feature.image.alt || feature.title || ""}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-6 h-full">
                                <span className="text-sm">
                                  {feature.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      );
                    })
                  : Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={placeholderKeys[index]}>
                        <div className="flex rounded-md aspect-video bg-muted items-center justify-center p-6">
                          <span className="text-sm">
                            Captura de tela da plataforma {index + 1}
                          </span>
                        </div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
