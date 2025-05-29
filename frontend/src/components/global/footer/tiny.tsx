"use client";


import { LogoOrSiteTitle, Copyright, LegalLinks, FooterProps } from "./shared";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function TinyFooter({
  title,
  logo,
  legalLinks = [],
  dictionary,
  documentId,
}: FooterProps) {
  return (
    <footer className="w-full py-6 bg-background border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-4">
          {/* Top row - Logo and Legal Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <LogoOrSiteTitle logo={logo} title={title} className="font-medium text-sm" />
              <LegalLinks links={legalLinks} variant="tiny" />
            </div>
          </div>
          
          {/* Bottom row - Copyright and Language Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t text-xs">
            <Copyright siteTitle={title} dictionary={dictionary} />
            <LanguageSwitcher variant="minimal" documentId={documentId} />
          </div>
        </div>
      </div>
    </footer>
  );
}
