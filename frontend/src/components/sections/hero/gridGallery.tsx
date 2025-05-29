"use client";

import type { HeroSection } from "@/sanity/types";
import { ButtonsGroup } from "./shared";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/client";
import Image from "next/image";


export default function GridGallery({
  heading,
  subheading,
  badgeText,
  buttons = [],
  media,
}: HeroSection) {
  const additionalImages = media?.additionalImages || [];
  const mainImage = media?.type === "image" && media.image ? 1 : 0;
  const additionalImagesCount = additionalImages.length;
  const totalImages = mainImage + additionalImagesCount;
  
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        {/* Single image layout */}
        {totalImages <= 1 ? (
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Content column */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              {badgeText && (
                <div>
                  <Badge variant="outline">{badgeText}</Badge>
                </div>
              )}

              {/* Heading */}
              <h1 className="text-5xl md:text-7xl tracking-tighter font-regular text-left max-w-lg">
                {heading}
              </h1>

              {/* Subheading */}
              {subheading && (
                <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-lg">
                  {subheading}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-row gap-4 flex-wrap">
                <ButtonsGroup buttons={buttons} />
              </div>
            </div>

            {/* Main image */}
            {media?.type === "image" && media.image && (
              <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                <Image
                  src={urlFor(media.image).width(800).height(600).url()}
                  alt={media.image.alt || "Hero image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        ) : (
          /* Multiple images layout */
          <div className="w-full mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Content column */}
              <div className="flex flex-col gap-6">
                {/* Badge */}
                {badgeText && (
                  <div>
                    <Badge variant="outline">{badgeText}</Badge>
                  </div>
                )}

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl tracking-tighter font-regular text-left max-w-lg">
                  {heading}
                </h1>

                {/* Subheading */}
                {subheading && (
                  <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-lg">
                    {subheading}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex flex-row gap-4 flex-wrap">
                  <ButtonsGroup buttons={buttons} />
                </div>
              </div>

              {/* Images grid column */}
              <div className="grid grid-cols-2 gap-4">
                {/* Main image */}
                {media?.type === "image" && media.image && (
                  <div className="col-span-2 aspect-[4/3] relative rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(media.image).width(800).height(600).url()}
                      alt={media.image.alt || "Hero image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                )}

                {/* Additional images */}
                {additionalImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={urlFor(image).width(400).height(400).url()}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
