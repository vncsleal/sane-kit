"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/sanity/client";
import type { TestimonialsSection } from "@/sanity/types";

export type TestimonialVariantProps = Pick<TestimonialsSection, 'heading' | 'subheading' | 'testimonials'>;

// Common section header component
export const SectionHeader = ({ heading, subheading }: Pick<TestimonialsSection, 'heading' | 'subheading'>) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
      {heading || "Confiado por milhares de empresas em todo o mundo"}
    </h2>
    {subheading && (
      <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
        {subheading}
      </p>
    )}
  </div>
);

// Common testimonial author component
export const TestimonialAuthor = ({ 
  testimonial 
}: { 
  testimonial: NonNullable<TestimonialsSection['testimonials']>[0]
}) => (
  <div className="mt-6 pt-4 flex items-center gap-3">
    <Avatar className="h-10 w-10">
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
    <div>
      <p className="font-medium">{testimonial.author}</p>
      {testimonial.role && (
        <p className="text-sm text-muted-foreground">
          {testimonial.role}
        </p>
      )}
    </div>
  </div>
);
