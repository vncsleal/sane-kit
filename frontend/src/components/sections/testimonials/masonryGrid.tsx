"use client";

import { Quote } from "lucide-react";
import { SectionHeader, TestimonialAuthor, TestimonialVariantProps } from "./shared";

export default function MasonryGrid({
  heading,
  subheading,
  testimonials = [],
}: TestimonialVariantProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <SectionHeader heading={heading} subheading={subheading} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => {
              const isHighlighted = i === 0 || i === 3;
              const testimonialLength = testimonial.content?.length || 0;

              let heightClass = "aspect-square";
              if (isHighlighted || testimonialLength > 200) {
                heightClass = "";
              }

              return (
                <div
                  key={testimonial._key}
                  className={`relative bg-muted rounded-lg overflow-hidden ${heightClass} ${
                    isHighlighted ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="relative z-10 flex flex-col justify-between h-full p-6">
                    <Quote className="w-8 h-8 stroke-1 mb-4 text-primary/40" />

                    <div className="flex flex-col gap-4">
                      <h3 className="text-xl tracking-tight font-medium">
                        {testimonial.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {testimonial.content}
                      </p>
                    </div>

                    <TestimonialAuthor testimonial={testimonial} />
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
