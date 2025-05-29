"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import type { Header as SanityHeaderType } from "@/sanity/types";
import { Locale } from "@/i18n/i18n-config";
import { SanityDocument } from "next-sanity";
import { Dictionary } from "@/i18n/getDictionary";

// Updated HeaderProps to include locale, dictionary, alternatePages and make SanityHeaderType fields optional
export type HeaderProps = {
  alternatePages?: SanityDocument[];
  locale: Locale;
  dictionary: Dictionary;
} & Partial<Omit<SanityHeaderType, 'language'>>;

// Remove locale from HeaderButtonProps
export interface HeaderButtonProps {
  label?: string;
  url?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  _key?: string;
  className?: string; // Added className
}

// Helper function to ensure URLs are absolute, accepting locale as a parameter
export function ensureAbsoluteUrl(url: string | undefined, locale: string): string {
  if (!url) return "#";
  // Check if already absolute or correctly prefixed for the current locale
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("#") || url.startsWith(`/${locale}`)) {
    return url;
  }
  // If it's a root-relative link (starts with / but not /locale), prefix with locale
  if (url.startsWith("/")) {
    return `/${locale}${url}`;
  }
  // For other relative links (e.g., "contact"), prefix with locale
  return `/${locale}/${url}`;
}

export function HeaderLogo({
  logo,
  title,
  className,
  locale, // Add locale here
}: {
  logo?: SanityHeaderType["logo"]; // Kept as is, as it's part of Partial<SanityHeaderType>
  title?: string; // Kept as is
  className?: string;
  locale?: Locale; // Add locale to props type
}) {
  const logoAlt = logo?.alt || title || "Site Logo";

  // Define conditional classes for the logo
  const conditionalLogoClasses = locale === "en" ? "mix-blend-difference grayscale contrast-100" : "";

  if (logo?.asset?._ref) {
    return (
      <Image
        src={urlFor(logo.asset._ref).url()}
        alt={logoAlt}
        width={140}
        height={40}
        className={cn("object-contain max-h-10", className, conditionalLogoClasses)} // Apply conditional classes
      />
    );
  }

  return (
    <p className={cn("font-semibold", className, conditionalLogoClasses)}> {/* Apply conditional classes */}
      {title || "Site Name"}
    </p>
  );
}

// Update HeaderCTAButton to accept locale as a prop
export function HeaderCTAButton({ label, url, variant = "default", _key, locale, className }: HeaderButtonProps & { locale: Locale }) {
  // const locale = useLocale(); // Locale is now passed as a prop
  if (!label) return null;
  
  return (
    <Button
      key={_key}
      asChild
      variant={variant}
      size="default"
      className={cn(className)}
    >
      <Link href={ensureAbsoluteUrl(url, locale)}>
        {label}
        <MoveRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}

export function createHeaderClassName(variant?: string, scrolled?: boolean) {
  return cn("w-full z-40 fixed top-0 left-0", {
    "bg-background":
      variant === "default" || variant === "minimal" || variant === "centered",
    "transition-all duration-300": variant === "transparent",
    "bg-background/80 backdrop-blur-md": variant === "transparent" && scrolled,
    "bg-transparent": variant === "transparent" && !scrolled,
  });
}
