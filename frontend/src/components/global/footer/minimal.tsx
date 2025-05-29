"use client";

import { LogoOrSiteTitle, Copyright, LegalLinks, FooterProps } from "./shared";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function MinimalFooter({
  title,
  logo,
  legalLinks = [],
  dictionary,
  documentId,
}: FooterProps) {
  return (
    <footer className="w-full py-8 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-6">
          {/* Top row - Logo and Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <LogoOrSiteTitle logo={logo} title={title} className="font-semibold text-lg" />
            <LegalLinks links={legalLinks} variant="minimal" />
          </div>

          {/* Bottom row - Copyright and Language Switcher */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-background/10">
            <Copyright siteTitle={title} dictionary={dictionary} />
            <LanguageSwitcher variant="minimal" documentId={documentId} />
          </div>
        </div>
      </div>
    </footer>
  );
}
