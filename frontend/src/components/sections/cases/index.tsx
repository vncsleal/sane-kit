"use client";

import type { ExtractPageBuilderType } from "@/sanity/page-builder";
import { stegaClean } from 'next-sanity';
import LogoCarousel from "./logoCarousel";
import CompactSlider from "./compactSlider";

export default function CasesSection({
	heading,
	subheading,
	variant = "logoCarousel",
	cases = [],
}: ExtractPageBuilderType<"casesSection">) {
	// Prepare just the props needed for variant components
	const variantProps = { 
		heading, 
		subheading, 
		cases 
	};
	
	// Route to the appropriate variant component based on the variant prop
	switch (stegaClean(variant)) {
		case "logoCarousel":
			return <LogoCarousel {...variantProps} />;
		case "compactSlider":
			return <CompactSlider {...variantProps} />;
		default:
			// Fallback to logoCarousel as default variant
			return <LogoCarousel {...variantProps} />;
	}
}
