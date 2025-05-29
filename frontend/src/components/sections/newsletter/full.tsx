"use client";

import type { NewsletterSection } from "@/sanity/types";
import { SectionHeader, SubscriptionForm } from "./shared";

type FullProps = NewsletterSection;

export default function Full({
  variant = "full",
  badgeText,
  heading,
  subheading,
  inputPlaceholder,
  buttonText,
  buttonIcon,
  successMessage,
  privacyText,
}: FullProps) {
  return (
    <div className="w-full py-20 lg:py-40 bg-muted">
      <div className="container mx-auto">
        <div className="flex flex-col text-center py-14 gap-8 items-center">
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
