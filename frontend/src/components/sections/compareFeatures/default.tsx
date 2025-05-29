"use client";

import type { CompareFeaturesSection } from "@/sanity/types";
import { SectionHeader, FeatureValueCell, PlanButton } from "./shared";
import { CompareFeatureWithTitle } from "./index";
import React from "react";

export interface DefaultProps extends Omit<CompareFeaturesSection, 'features'> {
  features: CompareFeatureWithTitle[];
  isLoading: boolean;
}

export default function Default({
  badgeText,
  heading,
  subheading,
  features = [],
  plans = [],
  footnote,
  isLoading,
}: DefaultProps) {
  if (isLoading) {
    return (
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <p className="text-center">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <SectionHeader badgeText={badgeText} heading={heading} subheading={subheading} />

          <div className="grid text-left w-full grid-cols-3 lg:grid-cols-4 divide-x pt-20">
            {/* First column header (empty) */}
            <div className="col-span-3 lg:col-span-1" />

            {/* Plan headers */}
            {plans.map((plan) => (
              <div
                key={plan._key || `plan-${plan.title}`}
                className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col"
              >
                <p className="text-2xl">{plan.title}</p>
                {plan.description && (
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                )}
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl">{plan.price}</span>
                  {plan.billingPeriod && (
                    <span className="text-sm text-muted-foreground">
                      {plan.billingPeriod}
                    </span>
                  )}
                </p>
                <PlanButton
                  buttonText={plan.buttonText}
                  buttonUrl={plan.buttonUrl}
                  buttonVariant={plan.buttonVariant}
                  buttonIcon={plan.buttonIcon}
                  highlighted={plan.highlighted === "true"}
                />
              </div>
            ))}

            {/* Features heading */}
            <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
              <b>Features</b>
            </div>
            {/* Create empty cells with unique keys for each plan column */}
            {plans.map((plan) => (
              <div key={`header-${plan._key || plan.title}`} />
            ))}

            {/* Feature rows */}
            {features.map((feature, index) => {
              return (
                <React.Fragment key={feature._key || `feature-${feature._id}-${index}`}>
                  {/* Feature name */}
                  <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4 border-t">
                    {feature.title}
                  </div>

                  {/* Feature values for each plan */}
                  {plans.map((plan, planIndex) => {
                    // Find the value for this feature in this plan
                    const featureValue = plan.featureValues?.find(
                      (fv) => fv.featureRef?._ref === feature._id
                    );
                    
                    if (!featureValue || featureValue.value === "false") {
                      return (
                        <div
                          key={`${feature._id || index}-${plan._key || planIndex}`}
                          className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
                        >
                          <FeatureValueCell value="false" />
                        </div>
                      );
                    }

                    if (featureValue.value === "true") {
                      return (
                        <div
                          key={`${feature._id || index}-${plan._key || planIndex}`}
                          className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
                        >
                          <FeatureValueCell value="true" />
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={`${feature._id || index}-${plan._key || planIndex}`}
                        className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
                      >
                        <FeatureValueCell value="custom" customText={featureValue.customText} />
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Footnote */}
          {footnote && (
            <div className="w-full pt-10 mt-10 border-t">
              <p className="text-sm text-center text-muted-foreground">
                {footnote}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
