"use client";

import type { StatsSection } from "@/sanity/types";
import { SectionHeader, StatCard } from "./shared";

export default function Grid({
  heading,
  subheading,
  stats = [],
}: StatsSection) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <SectionHeader heading={heading} subheading={subheading} />
        
        <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8">
          {stats.map((stat) => (
            <StatCard key={stat._key} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
