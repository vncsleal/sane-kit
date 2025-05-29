"use client";

import type { CtaSection } from "@/sanity/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconMap, ButtonVariant } from "./shared";

type FullProps = CtaSection;

export default function Full({
  badgeText,
  heading,
  subheading,
  buttons = [],
}: FullProps) {
  return (
    <div className="w-full py-20 lg:py-40 bg-muted">
      <div className="container mx-auto">
        <div className="flex flex-col text-center py-14 gap-4 items-center">
          {/* Badge */}
          {badgeText && (
            <div>
              <Badge>{badgeText}</Badge>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              {heading}
            </h3>
            {subheading && (
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                {subheading}
              </p>
            )}
          </div>

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className="flex flex-row gap-4 flex-wrap justify-center">
              {buttons.map((button) => {
                const Icon =
                  button.icon && button.icon !== "none"
                    ? IconMap[button.icon]
                    : null;

                return (
                  <Button
                    key={button._key}
                    variant={(button.variant as ButtonVariant) || "default"}
                    className="gap-4"
                    asChild
                  >
                    <Link href={button.url || "#"}>
                      {button.label}
                      {Icon && <Icon className="w-4 h-4" />}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
