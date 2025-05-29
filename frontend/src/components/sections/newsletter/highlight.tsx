"use client";

import type { NewsletterSection } from "@/sanity/types";
import { SectionHeader, SubscriptionForm } from "./shared";

type HighlightProps = NewsletterSection;

export default function Highlight({
  variant = "highlight",
  badgeText,
  heading,
  subheading,
  inputPlaceholder,
  buttonText,
  buttonIcon,
  successMessage,
  privacyText,
}: HighlightProps) {
  // Define container styles for the highlight variant
  const containerStyle = "bg-primary text-primary-foreground rounded-md p-4 lg:p-14";

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className={`flex flex-col text-center gap-8 items-center ${containerStyle}`}>
          <SectionHeader 
            badgeText={badgeText} 
            heading={heading} 
            subheading={subheading} 
            variant={variant}
          />
          
          <SubscriptionForm
            inputPlaceholder={inputPlaceholder}
            buttonText={buttonText}
            buttonIcon={buttonIcon}
            successMessage={successMessage}
            privacyText={privacyText}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
}
