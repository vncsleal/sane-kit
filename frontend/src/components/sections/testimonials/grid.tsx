"use client";

import { Quote } from "lucide-react";
import { SectionHeader, TestimonialAuthor, TestimonialVariantProps } from "./shared";

export default function Grid({
  heading,
  subheading,
  testimonials = [],
}: TestimonialVariantProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <SectionHeader heading={heading} subheading={subheading} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._key}
                className="bg-muted rounded-md p-6 flex flex-col justify-between"
              >
                <Quote className="w-8 h-8 stroke-1 mb-4 text-primary/40" />

                <div className="flex flex-col gap-4">
                  <h3 className="text-xl tracking-tight">{testimonial.title}</h3>
                  <p className="text-muted-foreground text-base flex-grow">
                    {testimonial.content}
                  </p>
                </div>

                <TestimonialAuthor testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
