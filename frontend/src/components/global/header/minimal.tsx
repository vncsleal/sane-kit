"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { HeaderProps } from ".";
import { HeaderLogo, HeaderCTAButton, createHeaderClassName } from "./shared";

export default function Minimal({
  title,
  logo,
  navigationItems = [],
  ctaButtons = [],
  locale: currentLocaleFromProps,
  dictionary
}: HeaderProps) {
  const locale = currentLocaleFromProps;

  const [scrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteName = title;
  const headerClasses = createHeaderClassName("minimal", scrolled);

  return (
    <header className={headerClasses}>
      <div className="container px-4 md:px-2 mx-auto min-h-20 flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex justify-start">
          <HeaderLogo logo={logo} title={siteName} locale={locale} />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex justify-end w-full gap-4 items-center">
          <div className="hidden lg:flex gap-4 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item._key}
                href={item.href || "#"}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            ))}
            {ctaButtons.map((button) => (
              <HeaderCTAButton
                key={button._key}
                {...button}
                locale={locale}
              />
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={mobileMenuOpen ? (dictionary?.header?.closeMenu ?? "Close menu") : (dictionary?.header?.openMenu ?? "Open menu")}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item._key}
                    href={item.href || "#"}
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)} // Close menu on click
                  >
                    {item.title}
                  </Link>
                ))}
                {ctaButtons.map((button) => (
                  <HeaderCTAButton
                    key={button._key}
                    {...button}
                    locale={locale}
                    className="w-full" // Make button full width in mobile menu
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
