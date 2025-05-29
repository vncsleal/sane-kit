"use client";

import { MoveRight, PhoneCall, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PricingSection } from "@/sanity/types";

// Icon mapping used across components
export const IconMap = {
  arrowRight: MoveRight,
  phone: PhoneCall,
  plus: Plus,
};

export type PricingSectionProps = PricingSection;

// Common section header component
export const SectionHeader = ({ 
  badgeText, 
  heading, 
  subheading 
}: Pick<PricingSection, 'badgeText' | 'heading' | 'subheading'>) => (
  <>
    {badgeText && <Badge>{badgeText}</Badge>}
    <div className="flex gap-2 flex-col">
      <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
        {heading}
      </h2>
      {subheading && (
        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
          {subheading}
        </p>
      )}
    </div>
  </>
);

// Common feature item component
export const FeatureItem = ({ 
  feature 
}: { 
  feature: NonNullable<NonNullable<PricingSection['plans']>[number]['features']>[number] 
}) => (
  <div className="flex flex-row gap-4">
    <Check className="w-4 h-4 mt-2 text-primary" />
    <div className="flex flex-col">
      <p>{feature.title}</p>
      {feature.description && (
        <p className="text-muted-foreground text-sm">
          {feature.description}
        </p>
      )}
    </div>
  </div>
);
