"use client";

import { MoveRight, PhoneCall, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CtaSection } from "@/sanity/types";

// Define the button variant type to match Shadcn's Button component
export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";

// Icon mapping used across variants
export const IconMap = {
  arrowRight: MoveRight,
  phone: PhoneCall,
  plus: Plus,
  none: null,
};

// Common section header component
export const SectionHeader = ({ 
  badgeText, 
  heading, 
  subheading,
  variant = "default"
}: Pick<CtaSection, 'badgeText' | 'heading' | 'subheading'> & { variant?: string }) => (
  <>
    {/* Badge */}
    {badgeText && (
      <div>
        <Badge
          variant={variant === "highlight" ? "secondary" : "default"}
        >
          {badgeText}
        </Badge>
      </div>
    )}

    {/* Content */}
    <div className="flex flex-col gap-2">
      <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
        {heading}
      </h3>
      {subheading && (
        <p
          className={`text-lg leading-relaxed tracking-tight max-w-xl ${
            variant === "highlight"
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          }`}
        >
          {subheading}
        </p>
      )}
    </div>
  </>
);

// Buttons component
export const ButtonsGroup = ({ 
  buttons = [], 
  variant = "default" 
}: Pick<CtaSection, 'buttons'> & { variant?: string }) => (
  <>
    {buttons && buttons.length > 0 && (
      <div className="flex flex-row gap-4 flex-wrap justify-center">
        {buttons.map((button) => {
          // Map icon name to component
          const Icon =
            button.icon && button.icon !== "none"
              ? IconMap[button.icon]
              : null;

          // Adjust button variants for highlight background
          let buttonVariant = button.variant || "default";
          if (variant === "highlight") {
            if (buttonVariant === "default") buttonVariant = "secondary";
            else if (buttonVariant === "outline") buttonVariant = "ghost";
          }

          return (
            <Button
              key={button._key}
              variant={buttonVariant as ButtonVariant}
              className="gap-4"
              asChild
            >
              <Link href={button.url || "#"}>
                {button.label}
                {Icon && <Icon className="w-4 h-4" />}
              </Link>
            </Button>
          );
        })}
      </div>
    )}
  </>
);
