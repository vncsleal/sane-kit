"use client";

import { Check, LucideProps, User, Settings, Lock, Star, Heart, BarChart, DollarSign, Calendar, Clock, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { FeatureSection } from "@/sanity/types";

// Icon mapping used across multiple variants
export const IconMap: Record<string, React.ComponentType<LucideProps>> = {
  user: User,
  settings: Settings,
  lock: Lock,
  star: Star,
  heart: Heart,
  barChart: BarChart,
  dollar: DollarSign,
  calendar: Calendar,
  clock: Clock,
  mail: Mail,
};

// Reusable header content component
export const SectionHeader = ({ 
  badgeText, 
  heading, 
  subheading 
}: Pick<FeatureSection, 'badgeText' | 'heading' | 'subheading'>) => (
  <div className="flex gap-4 flex-col">
    {badgeText && (
      <div>
        <Badge>{badgeText}</Badge>
      </div>
    )}
    <div className="flex gap-2 flex-col">
      <h2 className="text-xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
        {heading}
      </h2>
      {subheading && (
        <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
          {subheading}
        </p>
      )}
    </div>
  </div>
);

// Reusable image component
export const FeatureImage = ({ 
  image, 
  heading = "" 
}: { 
  image?: FeatureSection['image'], 
  heading?: string 
}) => (
  <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
    {image?.asset?._ref && (
      <div className="relative h-full w-full">
        <Image
          src={urlFor(image.asset._ref).url()}
          alt={image.alt || heading || ""}
          fill
          className="object-cover rounded-md"
        />
      </div>
    )}
  </div>
);

// Feature item component used in default and withImage variants
export const FeatureItem = ({ 
  feature 
}: { 
  feature: NonNullable<FeatureSection['features']>[number] 
}) => (
  <div className="flex flex-row gap-6 items-start">
    <Check className="w-4 h-4 mt-2 text-primary" />
    <div className="flex flex-col gap-1">
      <p>{feature.title}</p>
      {feature.description && (
        <p className="text-muted-foreground text-sm">
          {feature.description}
        </p>
      )}
    </div>
  </div>
);
