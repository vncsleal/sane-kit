"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import DefaultContact from "./defaultContact";

export default function ContactSection(props: ExtractPageBuilderType<"contactSection">) {
	// For now, we only have one variant, but this structure allows for 
	// adding more variants in the future
	
	// Extract all props needed by the DefaultContact component
	const contactProps = {
		badgeText: props.badgeText,
		heading: props.heading,
		description: props.description,
		features: props.features,
		formTitle: props.formTitle,
		formFields: props.formFields,
		buttonText: props.buttonText,
		buttonIcon: props.buttonIcon,
	};
	
	// If variants are added in the future, a switch statement can be used here
	return <DefaultContact {...contactProps} />;
}
