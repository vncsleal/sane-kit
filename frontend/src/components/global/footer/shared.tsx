"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { Footer } from "@/sanity/types";
import type { Dictionary } from "@/i18n/getDictionary";

export type FooterProps = Footer & {
  dictionary: Dictionary['footer'];
  documentId?: string;
};

// Reusable Logo or Site Title component
export const LogoOrSiteTitle = ({ 
  logo, 
  title,
  className = "" 
}: { 
  logo?: Footer['logo'],
  title?: string,
  className?: string 
}) => (
  <>
    {logo?.asset?._ref ? (
      <Image
        src={urlFor(logo.asset._ref).url()}
        alt={logo.alt || title || ""}
        width={140}
        height={40}
        className={`object-contain max-h-10 ${className}`}
      />
    ) : (
      <p className={className}>{title}</p>
    )}
  </>
);

// Copyright component
export const Copyright = ({ 
  siteTitle,
  dictionary 
}: { 
  siteTitle?: string;
  dictionary: Dictionary['footer'];
}) => (
  <p className="text-sm text-background/60">
    © {new Date().getFullYear()} {siteTitle}. {dictionary.copyright}
  </p>
);

// Legal links component
export const LegalLinks = ({
  links,
  variant = "simple"
}: {
  links?: Footer['legalLinks'],
  variant?: Footer['variant']
}) => {
  if (!links || links.length === 0) return null;

  const getClassName = () => {
    switch (variant) {
      case "tiny":
        return "flex gap-4 flex-wrap justify-center";
      case "minimal":
        return "flex gap-6";
      default:
        return "flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left";
    }
  };

  const getLinkClassName = () => {
    switch (variant) {
      case "tiny":
        return "text-muted-foreground hover:text-foreground transition-colors";
      case "minimal":
        return "text-sm text-background/75 hover:text-background";
      default:
        return "hover:text-background";
    }
  };

  return (
    <div className={getClassName()}>
      {links.map((link) => (
        <Link
          key={link._key}
          href={(link.url?.startsWith("/") ? link.url : `/${link.url}`) || "#"}
          className={getLinkClassName()}
        >
          {link.title || "Link"}
        </Link>
      ))}
    </div>
  );
};

// Navigation items component
export const NavigationItems = ({ 
  items 
}: { 
  items?: Footer['navigationItems'] 
}) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
      {items.map((item) => (
        <div
          key={item._key}
          className="flex text-base gap-1 flex-col items-start"
        >
          <div className="flex flex-col gap-2">
            {item.href ? (
              <Link
                href={item.href.startsWith("/") ? item.href : `/${item.href}`}
                className="flex justify-between items-center hover:text-background/80"
              >
                <span className="text-xl">{item.title}</span>
              </Link>
            ) : (
              <p className="text-xl">{item.title}</p>
            )}
            {item.items?.map((subItem) => (
              <Link
                key={subItem._key}
                href={
                  subItem.href?.startsWith("/")
                    ? subItem.href
                    : `/${subItem.href}`
                }
                className="flex justify-between items-center hover:text-background/80"
              >
                <span className="text-background/75">{subItem.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
