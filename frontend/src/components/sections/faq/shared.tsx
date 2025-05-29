"use client";

import { PhoneCall, MoveRight, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqSection } from "@/sanity/types";

// Icon mapping used across variants
export const IconMap = {
  phone: PhoneCall,
  arrowRight: MoveRight,
  plus: Plus,
  check: Check,
  none: null,
};

// Common content section component with conditional centering
export const ContentSection = ({ 
  badgeText, 
  heading, 
  subheading, 
  buttonText,
  buttonUrl = "#",
  buttonIcon = "phone",
  isCenter = false 
}: Pick<FaqSection, 'badgeText' | 'heading' | 'subheading' | 'buttonText' | 'buttonUrl' | 'buttonIcon'> & { isCenter?: boolean }) => {
  // Get icon component if one is specified
  const Icon = buttonIcon && buttonIcon !== "none" ? IconMap[buttonIcon] : null;

  return (
    <div
      className={`flex gap-4 flex-col ${isCenter ? "items-center text-center" : ""}`}
    >
      {badgeText && (
        <div>
          <Badge variant="outline">{badgeText}</Badge>
        </div>
      )}
      <div className={`flex gap-2 flex-col ${isCenter ? "items-center" : ""}`}>
        <h4
          className={`text-3xl md:text-5xl tracking-tighter ${isCenter ? "text-center" : "text-left"} max-w-xl font-regular`}
        >
          {heading}
        </h4>
        {subheading && (
          <p
            className={`text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl ${isCenter ? "text-center" : "text-left"}`}
          >
            {subheading}
          </p>
        )}
      </div>
      {buttonText && (
        <div>
          <Button className="gap-4" variant="outline" asChild>
            <Link href={buttonUrl || "#"}>
              {buttonText}
              {Icon && <Icon className="w-4 h-4" />}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

// Common FAQ accordion component
export const FaqAccordion = ({ 
  faqItems = [] 
}: Pick<FaqSection, 'faqItems'>) => (
  <Accordion type="single" collapsible className="w-full">
    {faqItems.map((item) => (
      <AccordionItem key={item._key} value={item._key || ""}>
        <AccordionTrigger>{item.question}</AccordionTrigger>
        <AccordionContent>{item.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
