"use client";

import { LogoOrSiteTitle, Copyright, LegalLinks, NavigationItems, FooterProps } from "./shared";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function SimpleFooter({
  title,
  logo,
  description,
  address = [],
  legalLinks = [],
  navigationItems = [],
  dictionary,
  documentId,
}: FooterProps) {
  return (
    <footer className="w-full pt-10 lg:pt-20 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column - Branding and Info */}
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <div className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                <LogoOrSiteTitle logo={logo} title={title} />
              </div>
              {description && (
                <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                  {description}
                </p>
              )}
            </div>

            <div className="flex gap-10 md:gap-20 flex-col md:flex-row">
              {/* Address */}
              {address && address.length > 0 && (
                <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                  {address.map((line, i) => (
                    <p key={`address-${i}`}>{line}</p>
                  ))}
                </div>
              )}

              {/* Legal Links */}
              <LegalLinks links={legalLinks} />
            </div>
          </div>

          {/* Right Column - Navigation */}
          <NavigationItems items={navigationItems} />
        </div>

        {/* Copyright and Language Switcher */}
        <div className="mt-16 py-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Copyright siteTitle={title} dictionary={dictionary} />
            <LanguageSwitcher variant="minimal" documentId={documentId} />
          </div>
        </div>
      </div>
    </footer>
  );
}
