"use client";

import type { NewsletterSection } from "@/sanity/types";
import { SectionHeader, SubscriptionForm } from "./shared";

type DefaultProps = NewsletterSection;

export default function Default({
  variant = "default",
  badgeText,
  heading,
  subheading,
  inputPlaceholder,
  buttonText,
  buttonIcon,
  successMessage,
  privacyText,
}: DefaultProps) {
  // Define container styles for the default variant
  const containerStyle = "bg-muted rounded-md p-4 lg:p-14";
  
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
