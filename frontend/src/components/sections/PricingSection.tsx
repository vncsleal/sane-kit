"use client";

import { Check, MoveRight, PhoneCall, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
	SanityPricingSection,
	SanityPricingFeature,
	SanityPricingPlan,
} from "@/sanity/types/schema";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

// Icon mapping
const IconMap = {
	arrowRight: MoveRight,
	phone: PhoneCall,
	plus: Plus,
};

export default function PricingSection({
	badgeText = "Pricing",
	i18n_badgeText,
	heading,
	i18n_heading,
	subheading,
	i18n_subheading,
	plans = [],
}: SanityPricingSection) {
	const { getLocalizedValue } = useLanguage();

	// Localize section texts
	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);

	// Header section
	const HeaderSection = () => (
		<>
			{localizedBadgeText && <Badge>{localizedBadgeText}</Badge>}{" "}
			{/* Use localized text */}
			<div className="flex gap-2 flex-col">
				<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
					{localizedHeading} {/* Use localized text */}
				</h2>
				{localizedSubheading && ( // Use localized text
					<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
						{localizedSubheading}
					</p>
				)}
			</div>
		</>
	);

	// Standard card-based pricing layout
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex text-center justify-center items-center gap-4 flex-col">
					<HeaderSection />
					<div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
						{plans.map((plan: SanityPricingPlan) => {
							// Localize plan texts
							const localizedPlanTitle = getLocalizedValue(
								plan.i18n_title,
								plan.title,
							);
							const localizedPlanDescription = getLocalizedValue(
								plan.i18n_description,
								plan.description,
							);
							const localizedPrice = getLocalizedValue(
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
								<Card
									key={plan._key}
									className={`w-full rounded-md ${plan.highlighted ? "shadow-2xl" : ""}`}
								>
									<CardHeader>
										<CardTitle>
											<span className="flex flex-row gap-4 items-center font-normal">
												{localizedPlanTitle} {/* Use localized text */}
											</span>
										</CardTitle>
										{localizedPlanDescription && ( // Use localized text
											<CardDescription>
												{localizedPlanDescription}
											</CardDescription>
										)}
									</CardHeader>
									<CardContent>
										<div className="flex flex-col gap-8 justify-start">
											<p className="flex flex-row items-center gap-2 text-xl">
												<span className="text-4xl">{localizedPrice}</span>{" "}
												{/* Use localized text */}
												{localizedBillingPeriod && ( // Use localized text
													<span className="text-sm text-muted-foreground">
														{" "}
														{localizedBillingPeriod}
													</span>
												)}
											</p>
											<div className="flex flex-col gap-4 justify-start">
												{plan.features.map((feature: SanityPricingFeature) => {
													// Localize feature texts
													const localizedFeatureTitle = getLocalizedValue(
														feature.i18n_title,
														feature.title,
													);
													const localizedFeatureDescription = getLocalizedValue(
														feature.i18n_description,
														feature.description,
													);
													return (
														<div
															key={feature._key}
															className="flex flex-row gap-4"
														>
															<Check className="w-4 h-4 mt-2 text-primary" />
															<div className="flex flex-col">
																<p>{localizedFeatureTitle}</p>{" "}
																{/* Use localized text */}
																{localizedFeatureDescription && ( // Use localized text
																	<p className="text-muted-foreground text-sm">
																		{localizedFeatureDescription}
																	</p>
																)}
															</div>
														</div>
													);
												})}
											</div>
											<Button
												variant={
													plan.buttonVariant ||
													(plan.highlighted ? "default" : "outline")
												}
												className="gap-4"
												asChild
											>
												<Link href={plan.buttonUrl}>
													{localizedButtonText} {/* Use localized text */}
													{plan.buttonIcon &&
														(() => {
															const Icon = plan.buttonIcon
																? IconMap[plan.buttonIcon]
																: null;
															return Icon ? <Icon className="w-4 h-4" /> : null;
														})()}
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
