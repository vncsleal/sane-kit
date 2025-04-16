"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoveRight, Plus, Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { SanityNewsletterSection } from "@/sanity/types/schema";
import { useLanguage } from "@/lib/language-context"; // Import useLanguage

// Map of icon names to components
const IconMap = {
	arrowRight: MoveRight,
	plus: Plus,
	mail: Mail,
	none: null,
};

export default function NewsletterSection({
	variant = "default",
	badgeText,
	i18n_badgeText, // Add i18n prop
	heading,
	i18n_heading, // Add i18n prop
	subheading,
	i18n_subheading, // Add i18n prop
	inputPlaceholder = "Enter your email",
	i18n_inputPlaceholder, // Add i18n prop
	buttonText = "Subscribe",
	i18n_buttonText, // Add i18n prop
	buttonIcon = "mail",
	successMessage = "Thank you for subscribing!",
	i18n_successMessage, // Add i18n prop
	privacyText,
	i18n_privacyText, // Add i18n prop
}: SanityNewsletterSection) {
	const { getLocalizedValue } = useLanguage(); // Use the hook
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Localize texts
	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedSubheading = getLocalizedValue(i18n_subheading, subheading);
	const localizedInputPlaceholder = getLocalizedValue(
		i18n_inputPlaceholder,
		inputPlaceholder,
	);
	const localizedButtonText = getLocalizedValue(i18n_buttonText, buttonText);
	const localizedSuccessMessage = getLocalizedValue(
		i18n_successMessage,
		successMessage,
	);
	const localizedPrivacyText = getLocalizedValue(i18n_privacyText, privacyText);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		// Basic email validation
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Please enter a valid email address");
			setIsSubmitting(false);
			return;
		}

		try {
			// Here you would typically call your API endpoint to handle the subscription
			// For example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 800));

			setSubmitted(true);
			setEmail("");
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Define variant-specific styles
	const containerStyles = {
		default: "bg-muted rounded-md p-4 lg:p-14",
		highlight: "bg-primary text-primary-foreground rounded-md p-4 lg:p-14",
		minimal: "",
		full: "bg-muted py-14 w-full",
	};

	// Icon for the button
	const Icon = buttonIcon && buttonIcon !== "none" ? IconMap[buttonIcon] : null;

	// Common content section to avoid duplication
	const contentSection = (
		<>
			{/* Badge */}
			{localizedBadgeText && ( // Use localized text
				<div>
					<Badge variant={variant === "highlight" ? "secondary" : "default"}>
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

			{/* Form */}
			{!submitted ? (
				<form
					onSubmit={handleSubmit}
					className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
				>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder={localizedInputPlaceholder} // Use localized text
						className={`flex-1 ${
							variant === "highlight"
								? "bg-primary-foreground border-primary-foreground/20 "
								: variant === "minimal"
									? "border-border/60 bg-background"
									: "bg-background border-muted-foreground/20"
						}`}
						required
					/>
					<Button
						type="submit"
						variant={variant === "highlight" ? "secondary" : "default"}
						disabled={isSubmitting}
						className="gap-2 whitespace-nowrap"
					>
						{localizedButtonText} {/* Use localized text */}
						{Icon && <Icon className="h-4 w-4" />}
					</Button>
				</form>
			) : (
				<div
					className={`p-4 rounded-md ${variant === "highlight" ? "bg-secondary/60" : "bg-secondary/20"}`}
				>
					{localizedSuccessMessage} {/* Use localized text */}
				</div>
			)}

			{/* Error message */}
			{error && <div className="text-destructive text-sm">{error}</div>}

			{/* Privacy text */}
			{localizedPrivacyText && ( // Use localized text
				<p
					className={`text-sm ${variant === "highlight" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
				>
					{localizedPrivacyText}
				</p>
			)}
		</>
	);

	// Full-width variant has a different structure
	if (variant === "full") {
		return (
			<div className="w-full py-20 lg:py-40 bg-muted">
				<div className="container mx-auto">
					<div className="flex flex-col text-center py-14 gap-6 items-center">
						{contentSection}
					</div>
				</div>
			</div>
		);
	}

	// Default rendering for other variants
	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div
					className={`flex flex-col text-center gap-6 items-center ${containerStyles[variant]}`}
				>
					{contentSection}
				</div>
			</div>
		</div>
	);
}
