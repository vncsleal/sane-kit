"use client";

import { Check, Minus, MoveRight, PhoneCall, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import type { VariantProps } from "class-variance-authority"; // Import VariantProps
import Link from "next/link";
import React from "react";
import type { SanityCompareFeaturesSection } from "@/sanity/types/schema";
import { useLanguage } from "@/lib/language-context";

// Icon mapping
const IconMap = {
	arrowRight: MoveRight,
	phone: PhoneCall,
	plus: Plus,
};

export default function CompareFeaturesSection({
	badgeText,
	i18n_badgeText,
	heading,
	i18n_heading,
	subheading,
	i18n_subheading,
	features = [],
	plans = [],
	footnote,
	i18n_footnote,
}: SanityCompareFeaturesSection) {
	const { getLocalizedValue } = useLanguage();

	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);
	const localizedFootnote = getLocalizedValue(i18n_footnote, footnote);

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex text-center justify-center items-center gap-4 flex-col">
					{localizedBadgeText && <Badge>{localizedBadgeText}</Badge>}
					<div className="flex gap-2 flex-col">
						<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
							{localizedHeading}
						</h2>
						{localizedSubheading && (
							<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
								{localizedSubheading}
							</p>
						)}
					</div>

					<div className="grid text-left w-full grid-cols-3 lg:grid-cols-4 divide-x pt-20">
						{/* First column header (empty) */}
						<div className="col-span-3 lg:col-span-1" />

						{/* Plan headers */}
						{plans.map((plan) => {
							const localizedPlanTitle = getLocalizedValue(
								plan.i18n_title,
								plan.title,
							);
							const localizedPlanDescription = getLocalizedValue(
								plan.i18n_description,
								plan.description,
							);
							const localizedPlanPrice = getLocalizedValue(
								plan.i18n_price,
								plan.price,
							);
							const localizedBillingPeriod = getLocalizedValue(
								plan.i18n_billingPeriod,
								plan.billingPeriod,
							);
							const localizedButtonText = getLocalizedValue(
								plan.i18n_buttonText,
								plan.buttonText,
							);

							return (
								<div
									key={plan._key}
									className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col"
								>
									<p className="text-2xl">{localizedPlanTitle}</p>
									{localizedPlanDescription && (
										<p className="text-sm text-muted-foreground">
											{localizedPlanDescription}
										</p>
									)}
									<p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
										<span className="text-4xl">{localizedPlanPrice}</span>
										{localizedBillingPeriod && (
											<span className="text-sm text-muted-foreground">
												{localizedBillingPeriod}
											</span>
										)}
									</p>
									<Button
										variant={
											(plan.buttonVariant as VariantProps<
												typeof buttonVariants // Use VariantProps with buttonVariants
											>["variant"]) ||
											(plan.highlighted ? "default" : "outline")
										}
										className="gap-4 mt-8"
										asChild
									>
										<Link href={plan.buttonUrl}>
											{localizedButtonText}{" "}
											{plan.buttonIcon &&
												(() => {
													const Icon = IconMap[plan.buttonIcon];
													return Icon ? <Icon className="w-4 h-4" /> : null;
												})()}
										</Link>
									</Button>
								</div>
							);
						})}

						{/* Features heading */}
						<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
							<b>Features</b>
						</div>
						<div />
						<div />
						<div />

						{/* Feature rows */}
						{features.map((feature) => {
							const localizedFeatureTitle = getLocalizedValue(
								feature.i18n_title, // Removed 'as any' cast
								feature.title,
							);

							return (
								<React.Fragment key={feature._id}>
									{/* Feature name */}
									<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4 border-t">
										{localizedFeatureTitle}
									</div>

									{/* Feature values for each plan */}
									{plans.map((plan) => {
										const featureValue = plan.featureValues?.find((fv) => {
											if (!fv.featureRef) return false;
											return fv.featureRef._id === feature._id;
										});

										if (!featureValue || featureValue.value === "false") {
											return (
												<div
													key={`${plan._key}-${feature._id}`}
													className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
												>
													<Minus className="w-4 h-4 text-muted-foreground" />
												</div>
											);
										}

										if (featureValue.value === "true") {
											return (
												<div
													key={`${plan._key}-${feature._id}`}
													className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
												>
													<Check className="w-4 h-4 text-primary" />
												</div>
											);
										}

										const localizedCustomText = getLocalizedValue(
											featureValue.i18n_customText,
											featureValue.customText,
										);
										return (
											<div
												key={`${plan._key}-${feature._id}`}
												className="px-3 py-1 md:px-6 md:py-4 flex justify-center items-center border-t"
											>
												<p className="text-muted-foreground text-sm">
													{localizedCustomText}
												</p>
											</div>
										);
									})}
								</React.Fragment>
							);
						})}
					</div>

					{/* Footnote */}
					{localizedFootnote && (
						<div className="w-full pt-10 mt-10 border-t">
							<p className="text-sm text-muted-foreground text-center">
								{localizedFootnote}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
