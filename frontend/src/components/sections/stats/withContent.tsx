"use client";

import type { StatsSection } from "@/sanity/types";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./shared";

export default function WithContent({
  badgeText,
  contentHeading,
  contentText,
  stats = [],
}: StatsSection) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Content column */}
          <div className="flex gap-4 flex-col items-start">
            {badgeText && (
              <div>
                <Badge>{badgeText}</Badge>
              </div>
            )}
            <div className="flex gap-2 flex-col">
              {contentHeading && (
                <h2 className="text-xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                  {contentHeading}
                </h2>
              )}
              {contentText && (
                <p className="text-lg lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
                  {contentText}
                </p>
              )}
            </div>
          </div>

          {/* Stats column */}
          <div className="flex justify-center items-center">
            <div className="grid text-left grid-cols-1 sm:grid-cols-2 w-full gap-2">
              {stats.slice(0, 4).map((stat) => (
                <StatCard key={stat._key} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
