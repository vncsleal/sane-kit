"use client";

import { MoveUpRight, MoveDownLeft } from "lucide-react";
import type { StatsSection } from "@/sanity/types";

// Type for individual stat
type Stat = NonNullable<StatsSection['stats']>[number];

// Color mapping for stat trends
export const colorClasses = {
  primary: "text-primary",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

// Common section header component
export const SectionHeader = ({ 
  heading, 
  subheading 
}: Pick<StatsSection, 'heading' | 'subheading'>) => {
  if (!heading && !subheading) return null;
  
  return (
    <div className="mb-16 text-center">
      {heading && (
        <h2 className="text-3xl md:text-5xl tracking-tighter mb-4 font-regular">
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
          {subheading}
        </p>
      )}
    </div>
  );
};

// Common stat card component
export const StatCard = ({ stat }: { stat: Stat }) => {
  if (!stat) return null;
  
  // Determine icon based on trend direction
  const Icon = stat.trendDirection === "down" ? MoveDownLeft : MoveUpRight;

  // Use 'primary' as fallback if stat.color is undefined
  const iconColor = colorClasses[stat.color || "primary"];

  return (
    <div
      key={stat._key}
      className="flex gap-0 flex-col justify-between p-6 border rounded-md"
    >
      {stat.trendDirection !== "none" && (
        <Icon className={`w-4 h-4 mb-10 ${iconColor}`} />
      )}
      <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
        {stat.value}
        {stat.trendValue && (
          <span className="text-muted-foreground text-sm tracking-normal">
            {stat.trendValue}
          </span>
        )}
      </h2>
      <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
        {stat.label}
      </p>
    </div>
  );
};
