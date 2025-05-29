"use client";

import { Check, Minus, MoveRight, PhoneCall, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { CompareFeaturesSection } from "@/sanity/types";

// Icon mapping
export const IconMap = {
  arrowRight: MoveRight,
  phone: PhoneCall,
  plus: Plus,
};

// Section header component
export const SectionHeader = ({ 
  badgeText, 
  heading, 
  subheading 
}: Pick<CompareFeaturesSection, 'badgeText' | 'heading' | 'subheading'>) => (
  <div className="flex text-center justify-center items-center gap-4 flex-col">
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
  </div>
);

// Component for rendering feature values
export const FeatureValueCell = ({ 
  value, 
  customText 
}: { 
  value: "true" | "false" | "custom"; 
  customText?: string 
}) => {
  if (value === "custom" && customText) {
    return <p className="text-muted-foreground text-sm">{customText}</p>;
  }

  if (value === "true") {
    return <Check className="w-4 h-4 text-primary" />;
  }
  
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

// Plan button component
export const PlanButton = ({ 
  buttonText, 
  buttonUrl = "#", 
  buttonVariant = "default", 
  buttonIcon,
  highlighted = false
}: { 
  buttonText?: string; 
  buttonUrl?: string; 
  buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link"; 
  buttonIcon?: "arrowRight" | "phone" | "plus";
  highlighted?: boolean;
}) => {
  if (!buttonText) return null;
  
  return (
    <Button 
      variant={
        (buttonVariant as VariantProps<typeof buttonVariants>["variant"]) || 
        (highlighted ? "default" : "outline")
      }
      className="gap-4 mt-8"
      asChild
    >
      <Link href={buttonUrl}>
        {buttonText}{" "}
        {buttonIcon && 
          (() => {
            const Icon = IconMap[buttonIcon];
            return Icon ? <Icon className="w-4 h-4" /> : null;
          })()
        }
      </Link>
    </Button>
  );
};
