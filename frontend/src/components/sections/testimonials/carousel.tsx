"use client";

import { useState, useEffect } from "react";
import {
  Carousel as UICarousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/sanity/client";
import { SectionHeader, TestimonialVariantProps } from "./shared";

export default function Carousel({
  heading,
  subheading,
  testimonials = [],
}: TestimonialVariantProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || testimonials.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [api, current, testimonials.length]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <SectionHeader heading={heading} subheading={subheading} />
          
          <UICarousel setApi={setApi} className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem className="lg:basis-1/2" key={testimonial._key}>
                  <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-video flex justify-between flex-col">
                    <User className="w-8 h-8 stroke-1" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight">
                          {testimonial.title}
                        </h3>
                        <p className="text-muted-foreground max-w-xs text-base">
                          {testimonial.content}
                        </p>
                      </div>
                      <p className="flex flex-row gap-2 text-sm items-center">
                        <Avatar className="h-6 w-6">
                          {testimonial.avatar ? (
                            <AvatarImage
                              src={urlFor(testimonial.avatar).url()}
                              alt={testimonial.avatar.alt || testimonial.author || ""}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              {testimonial.author?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span>{testimonial.author}</span>
                        {testimonial.role && (
                          <span className="text-muted-foreground text-xs">
                            {testimonial.role}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </UICarousel>
        </div>
      </div>
    </div>
  );
}
