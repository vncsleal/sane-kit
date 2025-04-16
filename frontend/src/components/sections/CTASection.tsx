"use client";

import { MoveRight, PhoneCall, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/lib/language-context"; // Import useLanguage
import type { SanityCTASection } from "@/sanity/types/schema"; // Import the correct type

// Define the button variant type to match Shadcn's Button component
type ButtonVariant =
	| "default"
	| "secondary"
	| "outline"
	| "ghost"
	| "link"
	| "destructive";

// Map of icon names to components
const IconMap = {
	arrowRight: MoveRight,
	phone: PhoneCall,
	plus: Plus,
	none: null,
};

export default function CTASection({
	variant = "default",
	badgeText,
	i18n_badgeText, // Add i18n prop
	heading,
	i18n_heading, // Add i18n prop
	subheading,
	i18n_subheading, // Add i18n prop
	buttons = [],
}: SanityCTASection) {
	const { getLocalizedValue } = useLanguage(); // Use the hook

	// Localize texts
	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);

	// If using full variant, we need a different structure
	if (variant === "full") {
		return (
			<div className="w-full py-20 lg:py-40 bg-muted">
				<div className="container mx-auto">
					<div className="flex flex-col text-center py-14 gap-4 items-center">
						{/* Badge */}
						{localizedBadgeText && ( // Use localized text
							<div>
								<Badge>{localizedBadgeText}</Badge>
							</div>
						)}

						{/* Content */}
						<div className="flex flex-col gap-2">
							<h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
								{localizedHeading} {/* Use localized text */}
							</h3>
							{localizedSubheading && ( // Use localized text
								<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
									{localizedSubheading}
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
									const localizedButtonLabel = getLocalizedValue(
										button.i18n_label,
										button.label,
									); // Localize button label

									return (
										<Button
											key={button._key}
											variant={(button.variant as ButtonVariant) || "default"}
											className="gap-4"
											asChild
										>
											<Link href={button.url}>
												{localizedButtonLabel} {/* Use localized label */}
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

	// Define variant-specific styles for other variants
	const containerStyles = {
		default: "bg-muted rounded-md p-4 lg:p-14",
		highlight: "bg-primary text-primary-foreground rounded-md p-4 lg:p-14",
		minimal: "",
	};

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div
					className={`flex flex-col text-center gap-8 items-center ${containerStyles[variant]}`}
				>
					{/* Badge */}
					{localizedBadgeText && ( // Use localized text
						<div>
							<Badge
								variant={variant === "highlight" ? "secondary" : "default"}
							>
								{localizedBadgeText}
							</Badge>
						</div>
					)}

					{/* Content */}
					<div className="flex flex-col gap-2">
						<h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
							{localizedHeading} {/* Use localized text */}
						</h3>
						{localizedSubheading && ( // Use localized text
							<p
								className={`text-lg leading-relaxed tracking-tight max-w-xl ${
									variant === "highlight"
										? "text-primary-foreground/80"
										: "text-muted-foreground"
								}`}
							>
								{localizedSubheading}
							</p>
						)}
					</div>

					{/* Buttons */}
					{buttons.length > 0 && (
						<div className="flex flex-row gap-4 flex-wrap justify-center">
							{buttons.map((button) => {
								// Map icon name to component
								const Icon =
									button.icon && button.icon !== "none"
										? IconMap[button.icon]
										: null;
								const localizedButtonLabel = getLocalizedValue(
									button.i18n_label,
									button.label,
								); // Localize button label

								// Adjust button variants for highlight background
								let buttonVariant = button.variant || "default";
								if (variant === "highlight") {
									if (buttonVariant === "default") buttonVariant = "secondary";
									else if (buttonVariant === "outline") buttonVariant = "ghost";
								}

								return (
									<Button
										key={button._key}
										variant={buttonVariant as ButtonVariant}
										className="gap-4"
										asChild
									>
										<Link href={button.url}>
											{localizedButtonLabel} {/* Use localized label */}
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
